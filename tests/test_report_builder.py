from backend.reports.report_builder import build_investigator_report


def make_analysis():
    return {
        "successful_transactions": 4,
        "failed_transactions": 1,
        "total_inbound_eth": 5.0,
        "total_outbound_eth": 4.8,
        "net_flow_eth": 0.2,
    }


def make_graph():
    return {
        "visited_wallet_count": 3,
        "max_depth": 2,
        "nodes": [{"address": "0x1"}, {"address": "0x2"}, {"address": "0x3"}],
        "edges": [{"from": "0x1", "to": "0x2"}, {"from": "0x2", "to": "0x3"}],
    }


def make_attributions():
    return [
        {
            "wallet_address": "0x1",
            "depth": 0,
            "attribution": {
                "has_candidate": False,
                "entity_name": None,
                "entity_type": None,
                "confidence": 0.0,
                "supporting_evidence": [],
                "contradicting_evidence": [],
                "alternative_hypotheses": [{"type": "unknown_entity"}],
            },
        },
        {
            "wallet_address": "0x3",
            "depth": 2,
            "attribution": {
                "has_candidate": True,
                "entity_name": "Example Exchange",
                "entity_type": "centralized_exchange",
                "confidence": 0.9,
                "supporting_evidence": [{"type": "known_address_match"}],
                "contradicting_evidence": [],
                "alternative_hypotheses": [{"type": "shared_or_reused_address"}],
            },
        },
    ]


def test_report_includes_case_and_wallet_identifiers():
    report = build_investigator_report(
        case_id="CASE-1",
        wallet_address="0x1",
        transaction_count=5,
        analysis=make_analysis(),
        risk_signals={},
        fund_flow_paths=[],
        graph=make_graph(),
        attributions=make_attributions(),
        evidence=[],
        timeline=[],
        related_cases=[],
    )

    assert report["case_id"] == "CASE-1"
    assert report["investigated_wallet"] == "0x1"
    assert "report_generated_at" in report


def test_report_transaction_summary_matches_analysis():
    report = build_investigator_report(
        case_id="CASE-1",
        wallet_address="0x1",
        transaction_count=5,
        analysis=make_analysis(),
        risk_signals={},
        fund_flow_paths=[],
        graph=make_graph(),
        attributions=make_attributions(),
        evidence=[],
        timeline=[],
        related_cases=[],
    )

    assert report["transaction_summary"]["total_transactions"] == 5
    assert report["transaction_summary"]["successful_transactions"] == 4
    assert report["transaction_summary"]["net_flow_eth"] == 0.2


def test_report_only_includes_wallets_with_a_candidate():
    report = build_investigator_report(
        case_id="CASE-1",
        wallet_address="0x1",
        transaction_count=5,
        analysis=make_analysis(),
        risk_signals={},
        fund_flow_paths=[],
        graph=make_graph(),
        attributions=make_attributions(),
        evidence=[],
        timeline=[],
        related_cases=[],
    )

    assert len(report["candidate_entities"]) == 1
    assert report["candidate_entities"][0]["wallet_address"] == "0x3"
    assert report["candidate_entities"][0]["entity_name"] == "Example Exchange"


def test_report_graph_summary_matches_graph():
    report = build_investigator_report(
        case_id="CASE-1",
        wallet_address="0x1",
        transaction_count=5,
        analysis=make_analysis(),
        risk_signals={},
        fund_flow_paths=[],
        graph=make_graph(),
        attributions=make_attributions(),
        evidence=[],
        timeline=[],
        related_cases=[],
    )

    assert report["graph_summary"]["node_count"] == 3
    assert report["graph_summary"]["edge_count"] == 2
    assert report["graph_summary"]["visited_wallet_count"] == 3


def test_report_includes_complaint_metadata_when_provided():
    report = build_investigator_report(
        case_id="CASE-1",
        wallet_address="0x1",
        transaction_count=5,
        analysis=make_analysis(),
        risk_signals={},
        fund_flow_paths=[],
        graph=make_graph(),
        attributions=make_attributions(),
        evidence=[],
        timeline=[],
        related_cases=[],
        complaint_metadata={"complainant_reference": "NCRP-1234"},
    )

    assert report["complaint_metadata"] == {"complainant_reference": "NCRP-1234"}


def test_report_complaint_metadata_defaults_to_none():
    report = build_investigator_report(
        case_id="CASE-1",
        wallet_address="0x1",
        transaction_count=5,
        analysis=make_analysis(),
        risk_signals={},
        fund_flow_paths=[],
        graph=make_graph(),
        attributions=make_attributions(),
        evidence=[],
        timeline=[],
        related_cases=[],
    )

    assert report["complaint_metadata"] is None


def test_report_includes_investigative_disclaimer():
    report = build_investigator_report(
        case_id="CASE-1",
        wallet_address="0x1",
        transaction_count=5,
        analysis=make_analysis(),
        risk_signals={},
        fund_flow_paths=[],
        graph=make_graph(),
        attributions=make_attributions(),
        evidence=[],
        timeline=[],
        related_cases=[],
    )

    assert "does not constitute proof" in report["disclaimer"]
