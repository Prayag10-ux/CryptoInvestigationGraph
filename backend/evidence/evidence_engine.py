from backend.models.transaction import Transaction


def generate_evidence(
    transactions: list[Transaction],
    wallet_address: str,
    signals: dict,
) -> list[dict]:
    """
    Convert behavioral signals into explainable evidence items.

    Evidence is investigative context, not proof of criminal activity.
    """

    evidence = []

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
            }
        )

    return evidence