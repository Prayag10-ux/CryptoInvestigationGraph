from datetime import datetime, timezone

from backend.analysis.fund_flow_traversal import build_fund_flow_paths
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


def test_build_two_hop_fund_flow():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"
    wallet_b = "0x3333333333333333333333333333333333333333"

    transactions = [
        make_transaction(
            "0xaaa",
            suspect,
            wallet_a,
            5.0,
        ),
        make_transaction(
            "0xbbb",
            wallet_a,
            wallet_b,
            2.0,
        ),
    ]

    paths = build_fund_flow_paths(
        transactions,
        suspect,
        max_hops=2,
    )

    assert len(paths) == 2

    one_hop = [
        path
        for path in paths
        if path["hop_count"] == 1
    ]

    two_hop = [
        path
        for path in paths
        if path["hop_count"] == 2
    ]

    assert len(one_hop) == 1
    assert len(two_hop) == 1

    assert one_hop[0]["final_wallet"] == wallet_a
    assert two_hop[0]["final_wallet"] == wallet_b

    assert two_hop[0]["wallets"] == [
        suspect,
        wallet_a,
        wallet_b,
    ]

    assert two_hop[0]["total_value_eth"] == 2.0


def test_failed_transactions_are_ignored():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"

    failed_transaction = make_transaction(
        "0xfailed",
        suspect,
        wallet_a,
        10.0,
    )

    failed_transaction.is_error = True

    paths = build_fund_flow_paths(
        [failed_transaction],
        suspect,
    )

    assert paths == []


def test_zero_value_transactions_are_ignored():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"

    transaction = make_transaction(
        "0xzero",
        suspect,
        wallet_a,
        0.0,
    )

    paths = build_fund_flow_paths(
        [transaction],
        suspect,
    )

    assert paths == []