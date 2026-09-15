import re


ETHEREUM_ADDRESS_PATTERN = re.compile(r"^0x[a-fA-F0-9]{40}$")


def is_valid_ethereum_address(address: str) -> bool:
    """Return True if the address has valid Ethereum address format."""
    return bool(ETHEREUM_ADDRESS_PATTERN.fullmatch(address))