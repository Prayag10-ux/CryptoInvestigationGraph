from datetime import datetime, timezone
from unittest.mock import patch

from backend.analysis.expansion_engine import expand_investigation
from backend.models.transaction import Transaction


def make_transaction(
    tx_hash: str,
    sender: str,
    receiver: str,
    value_eth: float,
) -> Transaction:
    return Transaction(
        hash=tx_hash,
        block_number=100,
        timestamp=datetime.now(timezone.utc),
        from_address=sender,
        to_address=receiver,
        value_wei=int(value_eth * 10**18),
        gas_used=21000,
        gas_price_wei=1_000_000_000,
        method_id=None,
        function_name=None,
        is_error=False,
    )


def test_expands_to_second_level():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"
    wallet_b = "0x3333333333333333333333333333333333333333"

    suspect_transactions = [
        make_transaction(
            "0xaaa",
            suspect,
            wallet_a,
            10.0,
        ),
    ]

    wallet_a_transactions = [
        make_transaction(
            "0xbbb",
            wallet_a,
            wallet_b,
            5.0,
        ),
    ]

    def fake_fetch(
        address: str,
        max_pages: int,
        page_size: int,
    ):
        if address == suspect:
            return suspect_transactions

        if address == wallet_a:
            return wallet_a_transactions

        return []

    with patch(
        "backend.analysis.expansion_engine.fetch_wallet_transactions",
        side_effect=fake_fetch,
    ):
        result = expand_investigation(
            suspect,
            max_depth=2,
            max_targets_per_wallet=5,
        )

    assert result["root_wallet"] == suspect
    assert result["visited_wallet_count"] == 3

    addresses = {
        node["address"]
        for node in result["nodes"]
    }

    assert suspect in addresses
    assert wallet_a in addresses
    assert wallet_b in addresses


def test_does_not_expand_beyond_max_depth():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"
    wallet_b = "0x3333333333333333333333333333333333333333"

    suspect_transactions = [
        make_transaction(
            "0xaaa",
            suspect,
            wallet_a,
            10.0,
        ),
    ]

    wallet_a_transactions = [
        make_transaction(
            "0xbbb",
            wallet_a,
            wallet_b,
            5.0,
        ),
    ]

    def fake_fetch(
        address: str,
        max_pages: int,
        page_size: int,
    ):
        if address == suspect:
            return suspect_transactions

        if address == wallet_a:
            return wallet_a_transactions

        return []

    with patch(
        "backend.analysis.expansion_engine.fetch_wallet_transactions",
        side_effect=fake_fetch,
    ):
        result = expand_investigation(
            suspect,
            max_depth=1,
        )

    addresses = {
        node["address"]
        for node in result["nodes"]
    }

    assert suspect in addresses
    assert wallet_a in addresses
    assert wallet_b not in addresses


def test_does_not_visit_same_wallet_twice():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"
    wallet_b = "0x3333333333333333333333333333333333333333"

    suspect_transactions = [
        make_transaction(
            "0xaaa",
            suspect,
            wallet_a,
            10.0,
        ),
        make_transaction(
            "0xaab",
            suspect,
            wallet_b,
            8.0,
        ),
    ]

    wallet_a_transactions = [
        make_transaction(
            "0xbbb",
            wallet_a,
            wallet_b,
            5.0,
        ),
    ]

    wallet_b_transactions = []

    fetch_counts = {}

    def fake_fetch(
        address: str,
        max_pages: int,
        page_size: int,
    ):
        fetch_counts[address] = fetch_counts.get(address, 0) + 1

        if address == suspect:
            return suspect_transactions

        if address == wallet_a:
            return wallet_a_transactions

        if address == wallet_b:
            return wallet_b_transactions

        return []

    with patch(
        "backend.analysis.expansion_engine.fetch_wallet_transactions",
        side_effect=fake_fetch,
    ):
        result = expand_investigation(
            suspect,
            max_depth=2,
        )

    assert result["visited_wallet_count"] == 3
    assert fetch_counts[wallet_b] == 1