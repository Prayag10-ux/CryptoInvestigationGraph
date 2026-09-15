from collections import defaultdict

from backend.models.transaction import Transaction


def analyze_fund_flow(
    transactions: list[Transaction],
    wallet_address: str,
) -> dict:
    """
    Analyze direct fund movement involving the investigated wallet.

    Relationships are separated by actual ETH value movement.
    Contract interactions with zero ETH value are still retained
    as transaction relationships but are not treated as fund transfers.

    Monetary values are calculated in Wei.
    """

    wallet = wallet_address.lower()

    inbound_by_wallet: dict[str, int] = defaultdict(int)
    outbound_by_wallet: dict[str, int] = defaultdict(int)

    inbound_transactions: dict[str, int] = defaultdict(int)
    outbound_transactions: dict[str, int] = defaultdict(int)

    inbound_value_transfers: dict[str, int] = defaultdict(int)
    outbound_value_transfers: dict[str, int] = defaultdict(int)

    for tx in transactions:
        sender = tx.from_address.lower()
        receiver = (tx.to_address or "").lower()

        if tx.is_error:
            continue

        # Funds entering the investigated wallet.
        if receiver == wallet:
            inbound_by_wallet[sender] += tx.value_wei
            inbound_transactions[sender] += 1

            if tx.value_wei > 0:
                inbound_value_transfers[sender] += 1

        # Transactions leaving the investigated wallet.
        if sender == wallet and receiver:
            outbound_by_wallet[receiver] += tx.value_wei
            outbound_transactions[receiver] += 1

            if tx.value_wei > 0:
                outbound_value_transfers[receiver] += 1

    def build_relationships(
        amounts: dict[str, int],
        counts: dict[str, int],
        value_transfer_counts: dict[str, int],
    ) -> list[dict]:
        relationships = []

        for address, amount_wei in amounts.items():
            relationships.append(
                {
                    "address": address,
                    "transaction_count": counts[address],
                    "value_transfer_count": value_transfer_counts[address],
                    "total_value_wei": amount_wei,
                    "total_value_eth": amount_wei / 10**18,
                    "relationship_type": (
                        "value_transfer"
                        if amount_wei > 0
                        else "contract_interaction"
                    ),
                }
            )

        relationships.sort(
            key=lambda item: item["total_value_wei"],
            reverse=True,
        )

        return relationships

    inbound = build_relationships(
        inbound_by_wallet,
        inbound_transactions,
        inbound_value_transfers,
    )

    outbound = build_relationships(
        outbound_by_wallet,
        outbound_transactions,
        outbound_value_transfers,
    )

    return {
        "wallet_address": wallet_address,
        "inbound_relationships": inbound,
        "outbound_relationships": outbound,
        "inbound_counterparty_count": len(inbound),
        "outbound_counterparty_count": len(outbound),
        "inbound_value_transfer_count": sum(
            inbound_value_transfers.values()
        ),
        "outbound_value_transfer_count": sum(
            outbound_value_transfers.values()
        ),
    }