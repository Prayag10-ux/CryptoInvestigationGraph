from backend.attribution.entity_registry import get_entity, is_known_entity


# A single qualifying behavioral evidence item nudges confidence by
# this much. Deliberately small and additive -- this is explainable
# arithmetic, not a trained model, and must never be presented as one.
BEHAVIORAL_CONFIDENCE_INCREMENT = 0.01

# Confidence is always capped below 1.0. Nothing in this system can
# ever claim certainty.
MAX_CONFIDENCE = 0.99

# Baseline confidence for an indirect association: this wallet has no
# registry match itself, but has a direct transactional edge to a
# wallet that does. Deliberately much lower than a direct match, since
# a single transaction with a known entity's wallet is weak evidence
# about the wallet on the other end of that transaction.
INDIRECT_ASSOCIATION_CONFIDENCE = 0.35

# The evidence_engine code representing "no strong behavioral signal
# detected." Absence of a signal is not corroboration and must never
# increase confidence.
NO_SIGNAL_CODE = "NO_STRONG_BEHAVIORAL_SIGNAL"


def _behavioral_supporting_evidence(evidence: list[dict]) -> list[dict]:
    """
    Convert qualifying behavioral evidence items into attribution
    supporting-evidence entries.

    Items representing the absence of a signal are excluded: absence
    of a signal is not corroboration for an association.
    """
    items = []

    for item in evidence:
        if item.get("code") == NO_SIGNAL_CODE:
            continue

        items.append(
            {
                "type": "behavioral_corroboration",
                "description": (
                    f"Behavioral indicator "
                    f"'{item.get('title', item.get('code'))}' was "
                    "observed for this wallet and is consistent with "
                    "the candidate association."
                ),
                "source": "behavioral_evidence_engine",
                "weight": BEHAVIORAL_CONFIDENCE_INCREMENT,
            }
        )

    return items


def _find_indirect_entity(
    wallet_address: str,
    edges: list[dict],
):
    """
    Look for a direct transactional edge between this wallet and a
    wallet that IS a known entity.

    Returns (entity, direction_description) if found, else None.

    This only checks a single hop. It is a weak, explicitly-labeled
    signal, not a claim about this wallet's identity.
    """
    wallet = wallet_address.lower()

    for edge in edges:
        frm = (edge.get("from") or "").lower()
        to = (edge.get("to") or "").lower()

        if frm == wallet and is_known_entity(to):
            return get_entity(to), "an outbound transaction to"

        if to == wallet and is_known_entity(frm):
            return get_entity(frm), "an inbound transaction from"

    return None


def calculate_attribution(
    wallet_address: str,
    evidence: list[dict],
    edges: list[dict] | None = None,
) -> dict:
    """
    Calculate an explainable attribution assessment.

    This does NOT prove ownership. The result represents the strength
    of available evidence supporting a potential association with a
    known entity, combining up to three sources:

      1. A direct known-address registry match for this wallet, if
         one exists. This is the strongest signal.
      2. Behavioral evidence corroboration (fan-in, fan-out, etc.).
         This nudges confidence when a direct or indirect match
         already exists, but never creates a candidate by itself --
         behavioral patterns alone are not identity evidence.
      3. An indirect association: this wallet has no registry match
         itself, but has a direct transactional edge to a wallet that
         does. Given at a deliberately lower confidence than a direct
         match.

    edges, when provided, should be the "edges" list from the
    investigation's expansion graph (each item with "from"/"to"
    wallet addresses). If omitted, only direct registry matches are
    considered.
    """
    entity = get_entity(wallet_address)
    behavioral_items = _behavioral_supporting_evidence(evidence)

    if entity:
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
        ] + behavioral_items

        confidence = min(
            entity["source_reliability"]
            + BEHAVIORAL_CONFIDENCE_INCREMENT * len(behavioral_items),
            MAX_CONFIDENCE,
        )

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

    indirect = _find_indirect_entity(wallet_address, edges or [])

    if indirect:
        connected_entity, direction = indirect

        supporting_evidence = [
            {
                "type": "indirect_transactional_link",
                "description": (
                    f"This wallet has {direction} a wallet known to "
                    f"be associated with "
                    f"{connected_entity['entity_name']}. This is an "
                    "indirect signal about a counterparty, not a "
                    "match on this wallet itself."
                ),
                "source": "derived_from_expansion_graph",
                "weight": INDIRECT_ASSOCIATION_CONFIDENCE,
            }
        ] + behavioral_items

        confidence = min(
            INDIRECT_ASSOCIATION_CONFIDENCE
            + BEHAVIORAL_CONFIDENCE_INCREMENT * len(behavioral_items),
            MAX_CONFIDENCE,
        )

        return {
            "wallet_address": wallet_address,
            "has_candidate": True,
            "entity_name": connected_entity["entity_name"],
            "entity_type": connected_entity["entity_type"],
            "confidence": round(confidence, 2),
            "supporting_evidence": supporting_evidence,
            "contradicting_evidence": [],
            "alternative_hypotheses": [
                {
                    "type": "unrelated_intermediary",
                    "description": (
                        "This wallet may simply be an unrelated "
                        "counterparty of the connected entity, with "
                        "no meaningful relationship beyond a single "
                        "transaction. Human verification is required."
                    ),
                },
                {
                    "type": "shared_or_reused_address",
                    "description": (
                        "The connected known-entity address may have "
                        "been reused, transferred, or incorrectly "
                        "labeled."
                    ),
                },
            ],
        }

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
