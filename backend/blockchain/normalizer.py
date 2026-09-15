from datetime import datetime, timezone

from backend.models.transaction import Transaction


def normalize_transaction(raw: dict) -> Transaction:
    """Convert a raw Etherscan transaction into our internal model."""

    required_fields = [
        "hash",
        "blockNumber",
        "timeStamp",
        "from",
        "value",
        "gasUsed",
        "gasPrice",
    ]

    missing_fields = [
        field
        for field in required_fields
        if field not in raw
    ]

    if missing_fields:
        raise ValueError(
            "Transaction is missing required fields: "
            + ", ".join(missing_fields)
        )

    return Transaction(
        hash=raw["hash"],
        block_number=int(raw["blockNumber"]),
        timestamp=datetime.fromtimestamp(
            int(raw["timeStamp"]),
            tz=timezone.utc,
        ),
        from_address=raw["from"],
        to_address=raw.get("to") or None,
        value_wei=int(raw["value"]),
        gas_used=int(raw["gasUsed"]),
        gas_price_wei=int(raw["gasPrice"]),
        method_id=raw.get("methodId") or None,
        function_name=raw.get("functionName") or None,
        is_error=raw.get("isError") == "1",
    )
