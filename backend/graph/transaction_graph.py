import networkx as nx

from backend.models.transaction import Transaction


def build_transaction_graph(
    transactions: list[Transaction],
    investigated_address: str,
) -> nx.MultiDiGraph:
    """
    Build a transaction-level directed graph.

    Nodes represent wallet addresses.
    Each edge represents one individual blockchain transaction.

    MultiDiGraph is used because two wallets can have many
    separate transactions between them.
    """

    graph = nx.MultiDiGraph()

    graph.add_node(
        investigated_address,
        node_type="investigated_wallet",
    )

    for tx in transactions:
        sender = tx.from_address
        receiver = tx.to_address

        # Contract creation transactions may have no receiver.
        if not receiver:
            continue

        graph.add_node(
            sender,
            node_type=(
                "investigated_wallet"
                if sender.lower() == investigated_address.lower()
                else "wallet"
            ),
        )

        graph.add_node(
            receiver,
            node_type=(
                "investigated_wallet"
                if receiver.lower() == investigated_address.lower()
                else "wallet"
            ),
        )

        graph.add_edge(
            sender,
            receiver,
            key=tx.hash,
            transaction_hash=tx.hash,
            value_wei=tx.value_wei,
            value_eth=tx.value_eth,
            timestamp=tx.timestamp,
            block_number=tx.block_number,
            gas_used=tx.gas_used,
            gas_price_wei=tx.gas_price_wei,
            method_id=tx.method_id,
            function_name=tx.function_name,
            is_error=tx.is_error,
        )

    return graph