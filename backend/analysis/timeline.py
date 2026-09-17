from backend.models.transaction import Transaction


def build_investigation_timeline(
    wallet_transactions: dict[str, list[Transaction]],
    attributions: list[dict],
) -> list[dict]:
    """
    Build a chronological timeline of every transaction observed
    during this investigation, across the investigated wallet and
    every wallet discovered during expansion.

    This reorganizes already-observed transaction facts (timestamp,
    hash, value, counterparties) into time order. It does not infer
    anything new. Where a transaction's destination wallet has a
    candidate entity association (from attribution), that association
    is attached to the event as context -- it is not a claim that
    this specific transaction is proven to reach that entity, since
    a wallet's association is assessed independently of any single
    transaction.

    Failed transactions are excluded, matching the convention used
    elsewhere in fund-flow analysis (failed transactions moved no
    funds).
    """
    attribution_by_wallet = {
        item["wallet_address"].lower(): item["attribution"]
        for item in attributions
    }

    seen_hashes = set()
    events = []

    for wallet_txs in wallet_transactions.values():
        for tx in wallet_txs:
            if tx.hash in seen_hashes:
                continue
            seen_hashes.add(tx.hash)

            if tx.is_error:
                continue

            destination = (tx.to_address or "").lower()
            candidate = attribution_by_wallet.get(destination)

            event = {
                "transaction_hash": tx.hash,
                "timestamp": tx.timestamp.isoformat(),
                "block_number": tx.block_number,
                "from_wallet": tx.from_address,
                "to_wallet": tx.to_address,
                "value_eth": tx.value_eth,
            }

            if candidate and candidate.get("has_candidate"):
                event["destination_candidate_entity"] = candidate["entity_name"]
                event["destination_candidate_confidence"] = candidate["confidence"]

            events.append(event)

    events.sort(key=lambda item: item["timestamp"])

    for index, event in enumerate(events, start=1):
        event["sequence"] = index

    return events
