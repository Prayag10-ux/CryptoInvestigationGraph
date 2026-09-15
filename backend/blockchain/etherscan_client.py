import os

import requests
from dotenv import load_dotenv

load_dotenv()


class EtherscanClient:
    BASE_URL = "https://api.etherscan.io/v2/api"
    CHAIN_ID = 1  # Ethereum Mainnet

    def __init__(self):
        self.api_key = os.getenv("ETHERSCAN_API_KEY")

        if not self.api_key:
            raise ValueError("ETHERSCAN_API_KEY is not configured.")

    def get_transactions(
        self,
        address: str,
        page: int = 1,
        offset: int = 100,
    ) -> dict:
        """Fetch normal Ethereum transactions for a wallet."""

        params = {
            "chainid": self.CHAIN_ID,
            "module": "account",
            "action": "txlist",
            "address": address,
            "page": page,
            "offset": offset,
            "sort": "asc",
            "apikey": self.api_key,
        }

        response = requests.get(
            self.BASE_URL,
            params=params,
            timeout=30,
        )

        response.raise_for_status()

        return response.json()