from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.analysis.expansion_engine import expand_investigation
from backend.analysis.fund_flow import analyze_fund_flow
from backend.analysis.fund_flow_traversal import build_fund_flow_paths
from backend.analysis.risk_signals import calculate_risk_signals
from backend.analysis.wallet_analysis import analyze_wallet
from backend.attribution.attribution_engine import calculate_attribution
from backend.blockchain.fetcher import fetch_wallet_transactions
from backend.blockchain.validator import is_valid_ethereum_address
from backend.evidence.evidence_engine import generate_evidence


router = APIRouter()


class InvestigationRequest(BaseModel):
    wallet_address: str


@router.post("/investigate")
def investigate_wallet(request: InvestigationRequest):
    """
    Investigate an Ethereum wallet and selectively expand
    into important related wallets.
    """
    address = request.wallet_address.strip()

    if not is_valid_ethereum_address(address):
        raise HTTPException(
            status_code=400,
            detail="Invalid Ethereum wallet address.",
        )

    if address.lower() == "0x0000000000000000000000000000000000000000":
        raise HTTPException(
            status_code=400,
            detail="Zero address cannot be investigated.",
        )

    # ---------------------------------------------------------------
    # 1. Fetch transactions for the investigated wallet
    # ---------------------------------------------------------------
    try:
        transactions = fetch_wallet_transactions(address)
    except (ConnectionError, TimeoutError, RuntimeError, ValueError) as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Blockchain data retrieval failed: {exc}",
        ) from exc

    # ---------------------------------------------------------------
    # 2. Analyze the investigated wallet
    # ---------------------------------------------------------------
    analysis = analyze_wallet(
        transactions,
        address,
    )

    signals = calculate_risk_signals(
        transactions,
        address,
    )

    fund_flow = analyze_fund_flow(
        transactions,
        address,
    )

    fund_flow_paths = build_fund_flow_paths(
        transactions,
        address,
        max_hops=2,
    )

    evidence = generate_evidence(
        transactions,
        address,
        signals,
    )

    # ---------------------------------------------------------------
    # 3. Controlled network expansion
    # ---------------------------------------------------------------
    try:
        expansion = expand_investigation(
            wallet_address=address,
            max_depth=2,
            max_targets_per_wallet=5,
            max_pages_per_wallet=2,
            page_size=100,
        )
    except (ConnectionError, TimeoutError, RuntimeError, ValueError) as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Investigation expansion failed: {exc}",
        ) from exc

    # ---------------------------------------------------------------
    # 4. Attribute discovered wallets
    #
    # Attribution currently uses the entity registry directly.
    # Detailed behavioral evidence for expanded wallets will be
    # connected in the expansion layer.
    # ---------------------------------------------------------------
    attributions = []

    for node in expansion["nodes"]:
        wallet = node["address"]

        wallet_attribution = calculate_attribution(
            wallet_address=wallet,
            evidence=evidence if wallet.lower() == address.lower() else [],
        )

        attributions.append(
            {
                "wallet_address": wallet,
                "depth": node["depth"],
                "attribution": wallet_attribution,
            }
        )

    # ---------------------------------------------------------------
    # 5. Return structured investigation result
    # ---------------------------------------------------------------
    return {
        "investigation": {
            "wallet_address": address,
            "network": "ethereum",
            "transaction_count": len(transactions),
        },
        "analysis": analysis,
        "risk_signals": signals,
        "fund_flow": fund_flow,
        "fund_flow_paths": fund_flow_paths,
        "evidence": evidence,
        "graph": expansion,
        "attribution": attributions,
    }