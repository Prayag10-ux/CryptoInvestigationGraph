import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.analysis.expansion_engine import expand_investigation
from backend.analysis.fund_flow import analyze_fund_flow
from backend.analysis.fund_flow_traversal import build_fund_flow_paths
from backend.analysis.risk_signals import calculate_risk_signals
from backend.analysis.timeline import build_investigation_timeline
from backend.analysis.wallet_analysis import analyze_wallet
from backend.attribution.attribution_engine import calculate_attribution
from backend.blockchain.fetcher import fetch_wallet_transactions
from backend.blockchain.validator import is_valid_ethereum_address
from backend.cases.case_store import create_case, get_case
from backend.cases.correlation_engine import find_related_cases
from backend.evidence.evidence_engine import generate_evidence
from backend.reports.report_builder import build_investigator_report


router = APIRouter()


class InvestigationRequest(BaseModel):
    wallet_address: str

    # Optional caller-supplied case reference (e.g. an NCRP complaint
    # number). If omitted, a case id is generated so the investigation
    # can still be recorded and correlated against future cases.
    case_id: str | None = None

    # Optional context about the underlying complaint (e.g. a
    # complainant reference, filing date). Stored as-is and included
    # in the investigator report; this system has no access to a
    # real complaint-intake system, so nothing here is validated.
    complaint_metadata: dict | None = None


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
            root_transactions=transactions,
        )
    except (ConnectionError, TimeoutError, RuntimeError, ValueError) as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Investigation expansion failed: {exc}",
        ) from exc

    # ---------------------------------------------------------------
    # 4. Attribute discovered wallets
    #
    # Every discovered wallet gets its own behavioral evidence,
    # computed from the transactions already fetched for it during
    # expansion (no duplicate fetching). Attribution combines, per
    # wallet: a direct registry match, behavioral corroboration, and
    # an indirect association when the wallet has a direct edge to a
    # known entity but no registry entry of its own.
    # ---------------------------------------------------------------
    wallet_transactions = expansion.pop("wallet_transactions", {})

    attributions = []

    for node in expansion["nodes"]:
        wallet = node["address"]

        if wallet.lower() == address.lower():
            wallet_evidence = evidence
        else:
            node_transactions = wallet_transactions.get(wallet, [])

            node_signals = calculate_risk_signals(
                node_transactions,
                wallet,
            )

            wallet_evidence = generate_evidence(
                node_transactions,
                wallet,
                node_signals,
            )

        wallet_attribution = calculate_attribution(
            wallet_address=wallet,
            evidence=wallet_evidence,
            edges=expansion["edges"],
        )

        attributions.append(
            {
                "wallet_address": wallet,
                "depth": node["depth"],
                "attribution": wallet_attribution,
            }
        )

    # ---------------------------------------------------------------
    # 5. Build a chronological timeline and the investigator report
    #
    # The timeline reorganizes already-observed transactions (across
    # every wallet touched during expansion) into time order. The
    # report assembles everything produced so far into one
    # investigator-facing object; it computes no new conclusions.
    # ---------------------------------------------------------------
    timeline = build_investigation_timeline(
        wallet_transactions={address: transactions, **wallet_transactions},
        attributions=attributions,
    )

    # ---------------------------------------------------------------
    # 6. Record this investigation as a case and check for
    #    connections to previously investigated cases.
    #
    # A shared wallet across cases is a potential financial
    # touchpoint, not evidence that the cases share an actor. See
    # correlation_engine for the exact language used.
    # ---------------------------------------------------------------
    case_id = request.case_id or f"CASE-{uuid.uuid4().hex[:8]}"

    touched_wallets = [
        node["address"]
        for node in expansion["nodes"]
    ]

    related_cases = find_related_cases(
        case_id=case_id,
        wallet_addresses=set(touched_wallets),
    )

    investigator_report = build_investigator_report(
        case_id=case_id,
        wallet_address=address,
        transaction_count=len(transactions),
        analysis=analysis,
        risk_signals=signals,
        fund_flow_paths=fund_flow_paths,
        graph=expansion,
        attributions=attributions,
        evidence=evidence,
        timeline=timeline,
        related_cases=related_cases,
        complaint_metadata=request.complaint_metadata,
    )

    create_case(
        case_id=case_id,
        wallet_address=address,
        related_wallets=touched_wallets,
        complaint_metadata=request.complaint_metadata,
        report=investigator_report,
    )

    # ---------------------------------------------------------------
    # 7. Return structured investigation result
    # ---------------------------------------------------------------
    return {
        "investigation": {
            "case_id": case_id,
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
        "related_cases": related_cases,
        "timeline": timeline,
        "investigator_report": investigator_report,
    }


@router.get("/cases/{case_id}")
def get_case_by_id(case_id: str):
    """
    Retrieve a previously recorded case, including its stored
    investigator report, by case id.

    This only returns cases that were created by a prior /investigate
    call in this process's lifetime -- the case store is in-memory,
    not durable storage. See case_store for the MVP limitations of
    this approach.
    """
    case = get_case(case_id)

    if case is None:
        raise HTTPException(
            status_code=404,
            detail=f"No case found with id '{case_id}'.",
        )

    return case
