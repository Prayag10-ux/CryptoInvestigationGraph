from backend.models.transaction import Transaction


def select_expansion_targets(
    transactions: list[Transaction],
    wallet_address: str,
    min_value_wei: int = 0,
    min_transactions: int = 1,
    max_targets: int = 10,
) -> list[dict]:
    """
    Select important counterparties for further investigation.

    Only successful transactions with actual ETH movement are considered.

    Targets are ranked using:
    1. Total ETH transferred
    2. Number of transactions

    This prevents blindly expanding every wallet encountered.
    """

    if min_value_wei < 0:
        raise ValueError("min_value_wei cannot be negative.")

    if min_transactions < 1:
        raise ValueError("min_transactions must be at least 1.")

    if max_targets < 1:
        raise ValueError("max_targets must be at least 1.")

    wallet = wallet_address.lower()

    counterparties: dict[str, dict] = {}

    for tx in transactions:
        if tx.is_error or tx.value_wei <= 0:
            continue

        sender = tx.from_address.lower()
        receiver = (tx.to_address or "").lower()

        if not receiver:
            continue

        # If the investigated wallet sent funds,
        # the receiver becomes an expansion candidate.
        if sender == wallet:
            target = receiver
            direction = "outbound"

        # If funds came into the investigated wallet,
        # the sender becomes an expansion candidate.
        elif receiver == wallet:
            target = sender
            direction = "inbound"

        else:
            continue

        if target == wallet:
            continue

        if target not in counterparties:
            counterparties[target] = {
                "address": target,
                "transaction_count": 0,
                "total_value_wei": 0,
                "directions": set(),
            }

        counterparties[target]["transaction_count"] += 1
        counterparties[target]["total_value_wei"] += tx.value_wei
        counterparties[target]["directions"].add(direction)

    candidates = []

    for data in counterparties.values():
        if data["transaction_count"] < min_transactions:
            continue

        if data["total_value_wei"] < min_value_wei:
            continue

        candidates.append(
            {
                "address": data["address"],
                "transaction_count": data["transaction_count"],
                "total_value_wei": data["total_value_wei"],
                "total_value_eth": (
                    data["total_value_wei"] / 10**18
                ),
                "directions": sorted(data["directions"]),
            }
        )

    candidates.sort(
        key=lambda item: (
            item["total_value_wei"],
            item["transaction_count"],
        ),
        reverse=True,
    )

    return candidates[:max_targets]