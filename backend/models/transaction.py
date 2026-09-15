from datetime import datetime

from pydantic import BaseModel, Field


class Transaction(BaseModel):
    hash: str
    block_number: int
    timestamp: datetime

    from_address: str
    to_address: str | None = None

    # Store blockchain value in Wei to avoid floating-point precision loss.
    value_wei: int = Field(ge=0)

    gas_used: int = Field(ge=0)
    gas_price_wei: int = Field(ge=0)

    method_id: str | None = None
    function_name: str | None = None

    is_error: bool

    @property
    def value_eth(self) -> float:
        """Return transaction value in ETH for display purposes."""
        return self.value_wei / 10**18
