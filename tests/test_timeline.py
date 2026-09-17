from datetime import datetime, timedelta, timezone

from backend.analysis.timeline import build_investigation_timeline
from backend.models.transaction import Transaction


def make_transaction(
    tx_hash: str,
    from_address: str,
    to_address: str,
    value_eth: float,
    timestamp: datetime,
    is_error: bool = False,
) -> Transaction:
    return Transaction(
        hash=tx_hash,
        block_number=1,
        timestamp=timestamp,
        from_address=from_address,
        to_address=to_address,
        value_wei=int(value_eth * 10**18),
        gas_used=21000,
        gas_price_wei=1_000_000_000,
        is_error=is_error,
    )


VICTIM = "0x1111111111111111111111111111111111111111"
INTERMEDIARY = "0x2222222222222222222222222222222222222222"
EXCHANGE = "0x6666666666666666666666666666666666666666"

BASE_TIME = datetime(2026, 1, 1, tzinfo=timezone.utc)


def test_timeline_is_sorted_chronologically():
    later_tx = make_transaction(
        "0xb1", INTERMEDIARY, EXCHANGE, 4.0, BASE_TIME + timedelta(hours=2)
    )
    earlier_tx = make_transaction(
        "0xa1", VICTIM, INTERMEDIARY, 5.0, BASE_TIME
    )

    wallet_transactions = {
        VICTIM: [earlier_tx],
        INTERMEDIARY: [later_tx],
    }

    timeline = build_investigation_timeline(wallet_transactions, attributions=[])

    assert [event["transaction_hash"] for event in timeline] == ["0xa1", "0xb1"]
    assert timeline[0]["sequence"] == 1
    assert timeline[1]["sequence"] == 2


def test_timeline_deduplicates_shared_transactions():
    tx = make_transaction("0xa1", VICTIM, INTERMEDIARY, 5.0, BASE_TIME)

    # The same real transaction would appear in both wallets' fetched
    # histories (sender's outbound list and receiver's inbound list).
    wallet_transactions = {
        VICTIM: [tx],
        INTERMEDIARY: [tx],
    }

    timeline = build_investigation_timeline(wallet_transactions, attributions=[])

    assert len(timeline) == 1


def test_timeline_excludes_failed_transactions():
    failed_tx = make_transaction(
        "0xa1", VICTIM, INTERMEDIARY, 5.0, BASE_TIME, is_error=True
    )

    timeline = build_investigation_timeline(
        {VICTIM: [failed_tx]},
        attributions=[],
    )

    assert timeline == []


def test_timeline_annotates_candidate_entity_destination():
    tx = make_transaction("0xb1", INTERMEDIARY, EXCHANGE, 4.0, BASE_TIME)

    attributions = [
        {
            "wallet_address": EXCHANGE,
            "depth": 1,
            "attribution": {
                "has_candidate": True,
                "entity_name": "Example Exchange",
                "confidence": 0.9,
            },
        }
    ]

    timeline = build_investigation_timeline(
        {INTERMEDIARY: [tx]},
        attributions=attributions,
    )

    assert timeline[0]["destination_candidate_entity"] == "Example Exchange"
    assert timeline[0]["destination_candidate_confidence"] == 0.9


def test_timeline_does_not_annotate_non_candidate_destination():
    tx = make_transaction("0xa1", VICTIM, INTERMEDIARY, 5.0, BASE_TIME)

    attributions = [
        {
            "wallet_address": INTERMEDIARY,
            "depth": 1,
            "attribution": {
                "has_candidate": False,
                "entity_name": None,
                "confidence": 0.0,
            },
        }
    ]

    timeline = build_investigation_timeline(
        {VICTIM: [tx]},
        attributions=attributions,
    )

    assert "destination_candidate_entity" not in timeline[0]
