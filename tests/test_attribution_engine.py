from backend.attribution.attribution_engine import calculate_attribution


def test_known_entity_gets_attribution():
    wallet = "0x6666666666666666666666666666666666666666"

    evidence = [
        {
            "code": "FAN_OUT_PATTERN",
            "title": "High outbound counterparty diversity",
            "severity": "medium",
            "finding": "The wallet interacted with many destinations.",
            "why_it_matters": "This may indicate fund distribution.",
        }
    ]

    result = calculate_attribution(
        wallet,
        evidence,
    )

    assert result["attributed"] is True
    assert result["entity_name"] == "Example Exchange"
    assert result["entity_type"] == "centralized_exchange"

    assert 0.90 <= result["confidence"] <= 0.99

    assert len(result["supporting_evidence"]) >= 2
    assert len(result["alternative_hypotheses"]) >= 1


def test_unknown_wallet_has_no_attribution():
    wallet = "0x7777777777777777777777777777777777777777"

    result = calculate_attribution(
        wallet,
        [],
    )

    assert result["attributed"] is False
    assert result["entity_name"] is None
    assert result["entity_type"] is None
    assert result["confidence"] == 0.0

    assert len(result["supporting_evidence"]) == 0
    assert len(result["alternative_hypotheses"]) >= 1


def test_confidence_is_capped():
    wallet = "0x6666666666666666666666666666666666666666"

    evidence = [
        {
            "code": f"SIGNAL_{index}",
            "title": "Test signal",
            "severity": "medium",
            "finding": "Test finding.",
            "why_it_matters": "Test explanation.",
        }
        for index in range(20)
    ]

    result = calculate_attribution(
        wallet,
        evidence,
    )

    assert result["confidence"] <= 0.99
    