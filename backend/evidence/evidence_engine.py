from backend.models.transaction import Transaction


def _wallet_transactions(
    transactions: list[Transaction],
    wallet_address: str,
) -> list[Transaction]:
    wallet = wallet_address.lower()

    return [
        tx
        for tx in transactions
        if tx.from_address.lower() == wallet
        or (tx.to_address or "").lower() == wallet
    ]


def _build_provenance(
    transactions: list[Transaction],
    wallet_address: str,
) -> dict:
    relevant_transactions = _wallet_transactions(
        transactions,
        wallet_address,
    )

    return {
        "source_type": "blockchain_transactions",
        "wallet_address": wallet_address,
        "transaction_count": len(relevant_transactions),
        "transaction_hashes": [
            tx.hash for tx in relevant_transactions
        ],
    }


def generate_evidence(
    transactions: list[Transaction],
    wallet_address: str,
    signals: dict,
) -> list[dict]:
    """
    Convert behavioral signals into explainable evidence items.

    Evidence is investigative context, not proof of criminal activity.

    Each evidence item includes provenance so investigators can
    trace the finding back to the observed blockchain transactions.
    """
    evidence = []

    provenance = _build_provenance(
        transactions,
        wallet_address,
    )

    if signals["fan_in"]:
        evidence.append(
            {
                "code": "FAN_IN_PATTERN",
                "title": "High inbound counterparty diversity",
                "severity": "medium",
                "finding": (
                    f"{signals['inbound_unique_counterparties']} unique "
                    "wallets sent transactions to the investigated address."
                ),
                "why_it_matters": (
                    "A large number of distinct inbound sources can indicate "
                    "a collection or aggregation pattern that warrants review."
                ),
                "provenance": provenance,
            }
        )

    if signals["fan_out"]:
        evidence.append(
            {
                "code": "FAN_OUT_PATTERN",
                "title": "High outbound counterparty diversity",
                "severity": "medium",
                "finding": (
                    f"{signals['outbound_unique_counterparties']} unique "
                    "wallets received transactions from the investigated address."
                ),
                "why_it_matters": (
                    "A large number of outbound destinations can indicate "
                    "distribution or fund-dispersal behavior."
                ),
                "provenance": provenance,
            }
        )

    if signals["high_failure_ratio"]:
        evidence.append(
            {
                "code": "HIGH_FAILURE_RATIO",
                "title": "Elevated failed transaction ratio",
                "severity": "low",
                "finding": (
                    f"{signals['failure_ratio']:.1%} of observed "
                    "transactions failed."
                ),
                "why_it_matters": (
                    "Repeated failed transactions can provide behavioral "
                    "context and may warrant examination."
                ),
                "provenance": provenance,
            }
        )

    if signals["high_inbound_concentration"]:
        evidence.append(
            {
                "code": "INBOUND_CONCENTRATION",
                "title": "High inbound transaction concentration",
                "severity": "low",
                "finding": (
                    "The largest inbound counterparty accounts for "
                    f"{signals['inbound_concentration']:.1%} of inbound "
                    "transactions."
                ),
                "why_it_matters": (
                    "Heavy dependence on one source can help investigators "
                    "understand the wallet's transaction relationships."
                ),
                "provenance": provenance,
            }
        )

    if not evidence:
        evidence.append(
            {
                "code": "NO_STRONG_BEHAVIORAL_SIGNAL",
                "title": "No strong behavioral signal detected",
                "severity": "info",
                "finding": (
                    "The observed transaction history did not trigger the "
                    "current behavioral indicators."
                ),
                "why_it_matters": (
                    "Absence of a signal does not establish that a wallet "
                    "is legitimate or free from risk."
                ),
                "provenance": provenance,
            }
        )

    return evidence