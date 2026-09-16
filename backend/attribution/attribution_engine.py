from backend.attribution.entity_registry import get_entity


def calculate_attribution(
    wallet_address: str,
    evidence: list[dict],
) -> dict:
    """
    Calculate an explainable attribution assessment.

    This does NOT prove ownership.

    The result represents the strength of available evidence
    supporting a potential association with a known entity.
    """
    entity = get_entity(wallet_address)

    if not entity:
        return {
            "wallet_address": wallet_address,
            "has_candidate": False,
            "entity_name": None,
            "entity_type": None,
            "confidence": 0.0,
            "supporting_evidence": [],
            "contradicting_evidence": [],
            "alternative_hypotheses": [
                {
                    "type": "unknown_entity",
                    "description": (
                        "No known entity association was found "
                        "for this wallet."
                    ),
                }
            ],
        }

    supporting_evidence = [
        {
            "type": "known_address_match",
            "description": (
                f"The wallet matches a known address associated "
                f"with {entity['entity_name']}."
            ),
            "source": entity["label_source"],
            "weight": entity["source_reliability"],
        }
    ]

    confidence = entity["source_reliability"]

    return {
        "wallet_address": wallet_address,
        "has_candidate": True,
        "entity_name": entity["entity_name"],
        "entity_type": entity["entity_type"],
        "confidence": round(confidence, 2),
        "supporting_evidence": supporting_evidence,
        "contradicting_evidence": [],
        "alternative_hypotheses": [
            {
                "type": "shared_or_reused_address",
                "description": (
                    "The address may have been reused, transferred, "
                    "or incorrectly labeled. Human verification "
                    "is required."
                ),
            }
        ],
    }