import requests

from backend.blockchain.etherscan_client import EtherscanClient
from backend.blockchain.normalizer import normalize_transaction
from backend.blockchain.validator import is_valid_ethereum_address
from backend.models.transaction import Transaction


MAX_PAGE_SIZE = 1000


def fetch_wallet_transactions(
    address: str,
    max_pages: int = 5,
    page_size: int = 100,
) -> list[Transaction]:
    """
    Fetch and normalize Ethereum transactions for a wallet.

    max_pages prevents accidentally requesting an unbounded
    number of transactions during an investigation.

    page_size is capped to the provider's supported maximum.
    """

    if not is_valid_ethereum_address(address):
        raise ValueError("Invalid Ethereum wallet address.")

    if max_pages < 1:
        raise ValueError("max_pages must be at least 1.")

    if page_size < 1:
        raise ValueError("page_size must be at least 1.")

    page_size = min(page_size, MAX_PAGE_SIZE)

    client = EtherscanClient()
    transactions: list[Transaction] = []

    for page in range(1, max_pages + 1):
        try:
            response = client.get_transactions(
                address=address,
                page=page,
                offset=page_size,
            )
        except requests.RequestException as exc:
            raise ConnectionError(
                f"Unable to reach blockchain data provider: {exc}"
            ) from exc

        if not isinstance(response, dict):
            raise RuntimeError(
                "Blockchain data provider returned an invalid response."
            )

        status = response.get("status")
        message = response.get("message")
        result = response.get("result")

        # Etherscan can return "No transactions found"
        # as a normal empty result.
        if result == "No transactions found":
            break

        if status != "1":
            raise RuntimeError(
                f"Etherscan API error: "
                f"address={address}, "
                f"page={page}, "
                f"offset={page_size}, "
                f"status={status}, "
                f"message={message}, "
                f"result={result}"
            )
            

        if not isinstance(result, list):
            raise RuntimeError(
                "Blockchain data provider returned an invalid transaction list."
            )

        if not result:
            break

        try:
            normalized = [
                normalize_transaction(raw)
                for raw in result
            ]
        except (TypeError, ValueError, KeyError) as exc:
            raise RuntimeError(
                f"Failed to normalize blockchain transaction data: {exc}"
            ) from exc

        transactions.extend(normalized)

        if len(result) < page_size:
            break

    return transactions
