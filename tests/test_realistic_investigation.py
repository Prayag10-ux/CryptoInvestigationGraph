from unittest.mock import patch

from backend.analysis.expansion_engine import expand_investigation
from backend.analysis.risk_signals import calculate_risk_signals
from backend.analysis.wallet_analysis import analyze_wallet
from backend.evidence.evidence_engine import generate_evidence
from tests.fixtures.investigation_transactions import (
    EXCHANGE,
    INTERMEDIATE_A,
    INTERMEDIATE_A_TRANSACTIONS,
    INTERMEDIATE_B,
    INTERMEDIATE_B_TRANSACTIONS,
    SUSPECT,
    SUSPECT_TRANSACTIONS,
)


def fake_fetch(
    address: str,
    max_pages: int,
    page_size: int,
):
    fixtures = {
        SUSPECT: SUSPECT_TRANSACTIONS,
        INTERMEDIATE_A: INTERMEDIATE_A_TRANSACTIONS,
        INTERMEDIATE_B: INTERMEDIATE_B_TRANSACTIONS,
        EXCHANGE: [],
    }

    return fixtures.get(address, [])


def test_realistic_investigation_expands_fund_flow():
    with patch(
        "backend.analysis.expansion_engine.fetch_wallet_transactions",
        side_effect=fake_fetch,
    ):
        result = expand_investigation(
            wallet_address=SUSPECT,
            max_depth=2,
            max_targets_per_wallet=5,
        )

    addresses = {
        node["address"]
        for node in result["nodes"]
    }

    assert result["root_wallet"] == SUSPECT

    assert SUSPECT in addresses
    assert INTERMEDIATE_A in addresses
    assert INTERMEDIATE_B in addresses
    assert EXCHANGE in addresses

    assert result["visited_wallet_count"] == 6

    assert len(result["edges"]) >= 5


def test_suspect_wallet_shows_multiple_inbound_sources():
    analysis = analyze_wallet(
        SUSPECT_TRANSACTIONS,
        SUSPECT,
    )

    assert analysis["inbound_transaction_count"] == 2
    assert analysis["unique_inbound_counterparties"] == 2
    assert analysis["total_inbound_eth"] == 7.0


def test_suspect_wallet_shows_outbound_distribution():
    analysis = analyze_wallet(
        SUSPECT_TRANSACTIONS,
        SUSPECT,
    )

    assert analysis["outbound_transaction_count"] == 2
    assert analysis["unique_outbound_counterparties"] == 2
    assert analysis["total_outbound_eth"] == 6.5


def test_risk_signals_detect_concentration_or_distribution():
    signals = calculate_risk_signals(
        SUSPECT_TRANSACTIONS,
        SUSPECT,
    )

    assert signals["inbound_unique_counterparties"] == 2
    assert signals["outbound_unique_counterparties"] == 2


def test_evidence_engine_returns_explainable_evidence():
    signals = calculate_risk_signals(
        SUSPECT_TRANSACTIONS,
        SUSPECT,
    )

    evidence = generate_evidence(
        SUSPECT_TRANSACTIONS,
        SUSPECT,
        signals,
    )

    assert len(evidence) >= 1

    for item in evidence:
        assert "code" in item
        assert "title" in item
        assert "severity" in item
        assert "finding" in item
        assert "why_it_matters" in item