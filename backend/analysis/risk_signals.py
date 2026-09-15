from collections import Counter

from backend.models.transaction import Transaction


def calculate_risk_signals(
    transactions: list[Transaction],
    wallet_address: str,
) -> dict:
    """
    Calculate deterministic behavioral signals.

    These are investigative indicators, NOT proof of fraud.
    """

    wallet = wallet_address.lower()

    inbound = [
        tx for tx in transactions
        if (tx.to_address or "").lower() == wallet
    ]

    outbound = [
        tx for tx in transactions
        if tx.from_address.lower() == wallet
    ]

    inbound_counterparties = Counter(
        tx.from_address.lower()
        for tx in inbound
    )

    outbound_counterparties = Counter(
        (tx.to_address or "").lower()
        for tx in outbound
        if tx.to_address
    )

    inbound_unique = len(inbound_counterparties)
    outbound_unique = len(outbound_counterparties)

    total_transactions = len(transactions)
    failed_transactions = sum(tx.is_error for tx in transactions)

    failure_ratio = (
        failed_transactions / total_transactions
        if total_transactions
        else 0.0
    )

    # Share of inbound transactions belonging to the
    # single most frequent sender.
    top_inbound_count = (
        inbound_counterparties.most_common(1)[0][1]
        if inbound_counterparties
        else 0
    )

    inbound_concentration = (
        top_inbound_count / len(inbound)
        if inbound
        else 0.0
    )

    # Simple investigative indicators.
    fan_in = inbound_unique >= 10
    fan_out = outbound_unique >= 10
    high_failure_ratio = failure_ratio >= 0.10
    high_inbound_concentration = inbound_concentration >= 0.50

    return {
        "fan_in": fan_in,
        "fan_out": fan_out,
        "high_failure_ratio": high_failure_ratio,
        "high_inbound_concentration": high_inbound_concentration,

        "inbound_unique_counterparties": inbound_unique,
        "outbound_unique_counterparties": outbound_unique,

        "failure_ratio": round(failure_ratio, 4),
        "inbound_concentration": round(inbound_concentration, 4),
    }