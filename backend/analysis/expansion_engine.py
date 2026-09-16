from backend.analysis.expansion import select_expansion_targets
from backend.blockchain.fetcher import fetch_wallet_transactions


def expand_investigation(
    wallet_address: str,
    max_depth: int = 2,
    max_targets_per_wallet: int = 5,
    max_pages_per_wallet: int = 2,
    page_size: int = 100,
    max_wallets: int = 25,
) -> dict:
    """
    Perform controlled recursive investigation expansion.

    Starting from the investigated wallet, fetch transactions,
    identify important counterparties, and selectively expand
    those counterparties.

    Safety limits prevent uncontrolled API usage.

    max_depth:
        Maximum number of expansion levels.

    max_targets_per_wallet:
        Maximum counterparties selected from each wallet.

    max_pages_per_wallet:
        Maximum blockchain API pages fetched for each wallet.

    page_size:
        Number of transactions requested per API page.

    max_wallets:
        Global maximum number of unique wallets that can be
        investigated during this expansion.
    """
    if max_depth < 0:
        raise ValueError("max_depth cannot be negative.")

    if max_targets_per_wallet < 1:
        raise ValueError(
            "max_targets_per_wallet must be at least 1."
        )

    if max_pages_per_wallet < 1:
        raise ValueError(
            "max_pages_per_wallet must be at least 1."
        )

    if page_size < 1:
        raise ValueError("page_size must be at least 1.")

    if max_wallets < 1:
        raise ValueError("max_wallets must be at least 1.")

    root_wallet = wallet_address.lower()

    visited: set[str] = set()

    wallets = [
        {
            "address": root_wallet,
            "depth": 0,
        }
    ]

    nodes = []
    edges = []

    while wallets and len(visited) < max_wallets:
        current = wallets.pop(0)

        address = current["address"]
        depth = current["depth"]

        if address in visited:
            continue

        visited.add(address)

        transactions = fetch_wallet_transactions(
            address=address,
            max_pages=max_pages_per_wallet,
            page_size=page_size,
        )

        nodes.append(
            {
                "address": address,
                "depth": depth,
                "node_type": (
                    "investigated_wallet"
                    if depth == 0
                    else "related_wallet"
                ),
                "transaction_count": len(transactions),
            }
        )

        # Do not expand beyond the configured depth.
        if depth >= max_depth:
            continue

        targets = select_expansion_targets(
            transactions,
            address,
            max_targets=max_targets_per_wallet,
        )

        for target in targets:
            target_address = target["address"]

            # Do not queue a new wallet if the global wallet
            # budget has already been reached.
            if (
                target_address not in visited
                and len(visited) + len(wallets) >= max_wallets
            ):
                break

            edges.append(
                {
                    "from": address,
                    "to": target_address,
                    "depth": depth + 1,
                    "transaction_count": target["transaction_count"],
                    "total_value_wei": target["total_value_wei"],
                    "total_value_eth": target["total_value_eth"],
                    "directions": target["directions"],
                }
            )

            if target_address not in visited:
                wallets.append(
                    {
                        "address": target_address,
                        "depth": depth + 1,
                    }
                )

    return {
        "root_wallet": root_wallet,
        "max_depth": max_depth,
        "max_wallets": max_wallets,
        "visited_wallet_count": len(visited),
        "nodes": nodes,
        "edges": edges,
    }