from datetime import datetime, timezone

from backend.models.transaction import Transaction


def make_transaction(
    tx_hash: str,
    sender: str,
    receiver: str,
    value_eth: float,
    block_number: int,
) -> Transaction:
    return Transaction(
        hash=tx_hash,
        block_number=block_number,
        timestamp=datetime.fromtimestamp(
            1_700_000_000 + block_number,
            tz=timezone.utc,
        ),
        from_address=sender,
        to_address=receiver,
        value_wei=int(value_eth * 10**18),
        gas_used=21_000,
        gas_price_wei=1_000_000_000,
        method_id=None,
        function_name=None,
        is_error=False,
    )


VICTIM_A = "0x1111111111111111111111111111111111111111"
VICTIM_B = "0x2222222222222222222222222222222222222222"

SUSPECT = "0x3333333333333333333333333333333333333333"

INTERMEDIATE_A = "0x4444444444444444444444444444444444444444"
INTERMEDIATE_B = "0x5555555555555555555555555555555555555555"

EXCHANGE = "0x6666666666666666666666666666666666666666"


SUSPECT_TRANSACTIONS = [
    # Two different sources send funds to the suspect wallet.
    make_transaction(
        "0xsuspect01",
        VICTIM_A,
        SUSPECT,
        4.0,
        100,
    ),
    make_transaction(
        "0xsuspect02",
        VICTIM_B,
        SUSPECT,
        3.0,
        101,
    ),

    # Suspect forwards funds to two different intermediate wallets.
    make_transaction(
        "0xsuspect03",
        SUSPECT,
        INTERMEDIATE_A,
        5.0,
        102,
    ),
    make_transaction(
        "0xsuspect04",
        SUSPECT,
        INTERMEDIATE_B,
        1.5,
        103,
    ),
]


INTERMEDIATE_A_TRANSACTIONS = [
    # Intermediate wallet forwards funds toward an exchange.
    make_transaction(
        "0xinter01",
        INTERMEDIATE_A,
        EXCHANGE,
        4.5,
        104,
    ),
]


INTERMEDIATE_B_TRANSACTIONS = [
    # Second path also reaches the same exchange.
    make_transaction(
        "0xinter02",
        INTERMEDIATE_B,
        EXCHANGE,
        1.4,
        105,
    ),
]


EXCHANGE_TRANSACTIONS = []


TRANSACTION_FIXTURES = {
    SUSPECT: SUSPECT_TRANSACTIONS,
    INTERMEDIATE_A: INTERMEDIATE_A_TRANSACTIONS,
    INTERMEDIATE_B: INTERMEDIATE_B_TRANSACTIONS,
    EXCHANGE: EXCHANGE_TRANSACTIONS,
}