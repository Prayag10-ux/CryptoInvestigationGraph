from collections import defaultdict

from backend.models.transaction import Transaction


def analyze_wallet(
    transactions: list[Transaction],
    wallet_address: str,
) -> dict:
    """
    Calculate deterministic wallet-level investigation metrics.

    Monetary calculations are performed in Wei to avoid
    floating-point precision loss.
    """

    wallet = wallet_address.lower()

    inbound = []
    outbound = []

    counterparties_in = set()
    counterparties_out = set()

    total_in_wei = 0
    total_out_wei = 0

    successful_transactions = 0
    failed_transactions = 0

    for tx in transactions:
        sender = tx.from_address.lower()
        receiver = (tx.to_address or "").lower()

        if tx.is_error:
            failed_transactions += 1
        else:
            successful_transactions += 1

        if receiver == wallet:
            inbound.append(tx)
            counterparties_in.add(sender)
            total_in_wei += tx.value_wei

        if sender == wallet:
            outbound.append(tx)
            if receiver:
                counterparties_out.add(receiver)
            total_out_wei += tx.value_wei

    # Count transactions by counterparty.
    incoming_frequency = defaultdict(int)
    outgoing_frequency = defaultdict(int)

    for tx in inbound:
        incoming_frequency[tx.from_address.lower()] += 1

    for tx in outbound:
        if tx.to_address:
            outgoing_frequency[tx.to_address.lower()] += 1

    net_flow_wei = total_in_wei - total_out_wei

    return {
        "wallet_address": wallet_address,
        "transaction_count": len(transactions),
        "successful_transactions": successful_transactions,
        "failed_transactions": failed_transactions,

        "inbound_transaction_count": len(inbound),
        "outbound_transaction_count": len(outbound),

        "unique_inbound_counterparties": len(counterparties_in),
        "unique_outbound_counterparties": len(counterparties_out),

        # Keep exact blockchain values internally.
        "total_inbound_wei": total_in_wei,
        "total_outbound_wei": total_out_wei,
        "net_flow_wei": net_flow_wei,

        # ETH values are for human-readable output.
        "total_inbound_eth": total_in_wei / 10**18,
        "total_outbound_eth": total_out_wei / 10**18,
        "net_flow_eth": net_flow_wei / 10**18,

        "top_inbound_counterparties": sorted(
            incoming_frequency.items(),
            key=lambda item: item[1],
            reverse=True,
        )[:10],

        "top_outbound_counterparties": sorted(
            outgoing_frequency.items(),
            key=lambda item: item[1],
            reverse=True,
        )[:10],
    }
