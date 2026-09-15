from collections import deque

from backend.models.transaction import Transaction


def build_fund_flow_paths(
    transactions: list[Transaction],
    wallet_address: str,
    max_hops: int = 2,
    min_value_wei: int = 0,
) -> list[dict]:
    """
    Build direct fund-flow paths from the investigated wallet.

    This version operates only on transactions already available
    in memory. It does not perform additional blockchain API calls.

    Only successful transactions with actual ETH value movement
    are considered.

    Example:

        investigated_wallet
              ↓
          wallet_A
              ↓
          wallet_B

    This represents a 2-hop path.
    """

    if max_hops < 1:
        raise ValueError("max_hops must be at least 1.")

    if min_value_wei < 0:
        raise ValueError("min_value_wei cannot be negative.")

    wallet = wallet_address.lower()

    # Build adjacency list from successful ETH transfers.
    adjacency: dict[str, list[dict]] = {}

    for tx in transactions:
        if tx.is_error:
            continue

        if tx.value_wei < min_value_wei:
            continue

        sender = tx.from_address.lower()
        receiver = (tx.to_address or "").lower()

        if not receiver or tx.value_wei == 0:
            continue

        adjacency.setdefault(sender, []).append(
            {
                "to": receiver,
                "transaction_hash": tx.hash,
                "value_wei": tx.value_wei,
                "value_eth": tx.value_eth,
                "timestamp": tx.timestamp,
                "block_number": tx.block_number,
            }
        )

    paths = []

    # Queue entries:
    # (current_wallet, path_nodes, path_edges)
    queue = deque(
        [
            (
                wallet,
                [wallet],
                [],
            )
        ]
    )

    while queue:
        current, nodes, edges = queue.popleft()

        current_hops = len(edges)

        if current_hops >= max_hops:
            continue

        for transfer in adjacency.get(current, []):
            next_wallet = transfer["to"]

            # Prevent cycles such as:
            # A → B → A
            if next_wallet in nodes:
                continue

            new_nodes = nodes + [next_wallet]
            new_edges = edges + [transfer]

            paths.append(
                {
                    "hop_count": current_hops + 1,
                    "wallets": new_nodes,
                    "transactions": new_edges,
                    "final_wallet": next_wallet,
                    "total_value_wei": transfer["value_wei"],
                    "total_value_eth": transfer["value_eth"],
                }
            )

            queue.append(
                (
                    next_wallet,
                    new_nodes,
                    new_edges,
                )
            )

    return paths