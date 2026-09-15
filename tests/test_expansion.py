from datetime import datetime, timezone

from backend.analysis.expansion import select_expansion_targets
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


def test_selects_high_value_counterparty():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"
    wallet_b = "0x3333333333333333333333333333333333333333"

    transactions = [
        make_transaction(
            "0xaaa",
            suspect,
            wallet_a,
            10.0,
        ),
        make_transaction(
            "0xbbb",
            suspect,
            wallet_b,
            2.0,
        ),
    ]

    targets = select_expansion_targets(
        transactions,
        suspect,
    )

    assert len(targets) == 2
    assert targets[0]["address"] == wallet_a
    assert targets[0]["total_value_eth"] == 10.0


def test_ignores_zero_value_transactions():
    suspect = "0x1111111111111111111111111111111111111111"
    wallet_a = "0x2222222222222222222222222222222222222222"

    transactions = [
        make_transaction(
            "0xaaa",
            suspect,
            wallet_a,
            0.0,
        ),
    ]

    targets = select_expansion_targets(
        transactions,
        suspect,
    )

    assert targets == []


def test_respects_max_targets():
    suspect = "0x1111111111111111111111111111111111111111"

    transactions = []

    for index in range(5):
        receiver = (
            "0x"
            + str(index + 2).zfill(40)
        )

        transactions.append(
            make_transaction(
                f"0x{index}",
                suspect,
                receiver,
                float(index + 1),
            )
        )

    targets = select_expansion_targets(
        transactions,
        suspect,
        max_targets=3,
    )

    assert len(targets) == 3

    assert targets[0]["total_value_eth"] == 5.0
    assert targets[1]["total_value_eth"] == 4.0
    assert targets[2]["total_value_eth"] == 3.0