"""
Known blockchain entity registry.

This registry stores publicly known or manually verified
addresses that can be used as attribution signals.

An address match is evidence of association, not proof
of ownership or criminal activity.
"""


KNOWN_ENTITIES = {
    "0x6666666666666666666666666666666666666666": {
        "entity_name": "Example Exchange",
        "entity_type": "centralized_exchange",
        "label_source": "demo_registry",
        "source_reliability": 0.90,
    },
    "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb": {
        "entity_name": "Example Exchange B",
        "entity_type": "centralized_exchange",
        "label_source": "demo_registry",
        "source_reliability": 0.90,
    },
}


def get_entity(address: str) -> dict | None:
    """
    Return the known entity associated with an address,
    if one exists.
    """

    return KNOWN_ENTITIES.get(address.lower())


def is_known_entity(address: str) -> bool:
    """Return True when the address exists in the registry."""

    return address.lower() in KNOWN_ENTITIES