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

    assert result["has_candidate"] is True
    assert result["entity_name"] == "Example Exchange"
    assert result["entity_type"] == "centralized_exchange"
    assert 0.90 <= result["confidence"] <= 0.99
    assert len(result["supporting_evidence"]) >= 1
    assert len(result["alternative_hypotheses"]) >= 1


def test_unknown_wallet_has_no_attribution():
    wallet = "0x7777777777777777777777777777777777777777"

    result = calculate_attribution(
        wallet,
        [],
    )

    assert result["has_candidate"] is False
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


def test_behavioral_evidence_increases_confidence_above_baseline():
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

    result = calculate_attribution(wallet, evidence)

    # A qualifying behavioral signal should nudge confidence strictly
    # above the bare registry-match baseline (0.90).
    assert result["confidence"] > 0.90

    corroboration = [
        item
        for item in result["supporting_evidence"]
        if item["type"] == "behavioral_corroboration"
    ]
    assert len(corroboration) == 1


def test_absence_of_signal_does_not_increase_confidence():
    wallet = "0x6666666666666666666666666666666666666666"

    evidence = [
        {
            "code": "NO_STRONG_BEHAVIORAL_SIGNAL",
            "title": "No strong behavioral signal detected",
            "severity": "info",
            "finding": "No indicators triggered.",
            "why_it_matters": "Absence of a signal is not proof of legitimacy.",
        }
    ]

    result = calculate_attribution(wallet, evidence)

    # "No signal" evidence must not be treated as corroboration.
    assert result["confidence"] == 0.90

    corroboration = [
        item
        for item in result["supporting_evidence"]
        if item["type"] == "behavioral_corroboration"
    ]
    assert len(corroboration) == 0


def test_wallet_with_edge_to_known_entity_gets_indirect_candidate():
    unknown_wallet = "0x8888888888888888888888888888888888888888"
    known_entity_wallet = "0x6666666666666666666666666666666666666666"

    edges = [
        {
            "from": unknown_wallet,
            "to": known_entity_wallet,
        }
    ]

    result = calculate_attribution(unknown_wallet, [], edges=edges)

    assert result["has_candidate"] is True
    assert result["entity_name"] == "Example Exchange"
    # Indirect association must be meaningfully weaker than a direct
    # registry match (0.90).
    assert result["confidence"] < 0.90
    assert result["confidence"] == 0.35

    link_evidence = [
        item
        for item in result["supporting_evidence"]
        if item["type"] == "indirect_transactional_link"
    ]
    assert len(link_evidence) == 1

    hypothesis_types = {
        h["type"] for h in result["alternative_hypotheses"]
    }
    assert "unrelated_intermediary" in hypothesis_types


def test_wallet_with_no_edge_and_no_registry_match_has_no_candidate():
    unrelated_wallet_a = "0x9999999999999999999999999999999999999999"
    unrelated_wallet_b = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

    edges = [
        {
            "from": unrelated_wallet_a,
            "to": unrelated_wallet_b,
        }
    ]

    result = calculate_attribution(
        unrelated_wallet_a,
        [],
        edges=edges,
    )

    assert result["has_candidate"] is False
    assert result["confidence"] == 0.0


def test_indirect_association_confidence_is_also_capped():
    unknown_wallet = "0x8888888888888888888888888888888888888888"
    known_entity_wallet = "0x6666666666666666666666666666666666666666"

    edges = [
        {
            "from": unknown_wallet,
            "to": known_entity_wallet,
        }
    ]

    evidence = [
        {
            "code": f"SIGNAL_{index}",
            "title": "Test signal",
            "severity": "medium",
            "finding": "Test finding.",
            "why_it_matters": "Test explanation.",
        }
        for index in range(50)
    ]

    result = calculate_attribution(unknown_wallet, evidence, edges=edges)

    assert result["confidence"] <= 0.99


def test_wallet_linked_to_two_distinct_entities_gets_contradicting_evidence():
    unknown_wallet = "0x8888888888888888888888888888888888888888"
    entity_a = "0x6666666666666666666666666666666666666666"
    entity_b = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"

    edges = [
        {"from": unknown_wallet, "to": entity_a},
        {"from": unknown_wallet, "to": entity_b},
    ]

    result = calculate_attribution(unknown_wallet, [], edges=edges)

    assert result["has_candidate"] is True
    # First edge encountered becomes the primary candidate.
    assert result["entity_name"] == "Example Exchange"

    conflicts = [
        item
        for item in result["contradicting_evidence"]
        if item["type"] == "conflicting_entity_signal"
    ]
    assert len(conflicts) == 1
    assert "Example Exchange B" in conflicts[0]["description"]


def test_direct_match_wallet_with_conflicting_edge_gets_contradicting_evidence():
    # This wallet IS a registry entity itself (Example Exchange), but
    # also has a direct edge to a DIFFERENT known entity.
    wallet = "0x6666666666666666666666666666666666666666"
    other_entity = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"

    edges = [
        {"from": wallet, "to": other_entity},
    ]

    result = calculate_attribution(wallet, [], edges=edges)

    assert result["has_candidate"] is True
    assert result["entity_name"] == "Example Exchange"

    conflicts = [
        item
        for item in result["contradicting_evidence"]
        if item["type"] == "conflicting_entity_signal"
    ]
    assert len(conflicts) == 1
    assert "Example Exchange B" in conflicts[0]["description"]


def test_single_entity_connection_has_no_contradicting_evidence():
    unknown_wallet = "0x8888888888888888888888888888888888888888"
    known_entity_wallet = "0x6666666666666666666666666666666666666666"

    edges = [
        {"from": unknown_wallet, "to": known_entity_wallet},
    ]

    result = calculate_attribution(unknown_wallet, [], edges=edges)

    assert result["contradicting_evidence"] == []


def test_repeated_edges_to_same_entity_do_not_create_a_false_conflict():
    unknown_wallet = "0x8888888888888888888888888888888888888888"
    known_entity_wallet = "0x6666666666666666666666666666666666666666"

    # Two separate transactions with the SAME entity should not be
    # treated as a conflict.
    edges = [
        {"from": unknown_wallet, "to": known_entity_wallet},
        {"from": known_entity_wallet, "to": unknown_wallet},
    ]

    result = calculate_attribution(unknown_wallet, [], edges=edges)

    assert result["contradicting_evidence"] == []