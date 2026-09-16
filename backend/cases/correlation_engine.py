"""
Cross-case correlation engine.

Detects when two independently investigated cases share wallet
infrastructure — for example, both routing funds through the same
intermediary or destination wallet.

This module identifies a shared financial touchpoint only. It does
NOT identify shared actors, common ownership, or a shared criminal
group. That interpretation requires human investigator judgment, and
every finding this module produces says so explicitly.
"""

from backend.cases.case_store import get_all_cases


def find_related_cases(
    case_id: str,
    wallet_addresses: set[str],
) -> list[dict]:
    """
    Find previously recorded cases that share at least one wallet
    address with the given set.

    case_id:
        The id of the case currently being investigated. Used only to
        avoid matching a case against itself (e.g. if the same case
        is investigated more than once).

    wallet_addresses:
        Every wallet address touched by the current investigation
        (the investigated wallet plus everything discovered during
        expansion).

    Returns a list of potential connections. Each item names the
    related case, the specific shared wallet(s), and an explicit
    interpretation note describing what the finding does and does not
    establish.
    """
    normalized = {addr.lower() for addr in wallet_addresses}

    related = []

    for case in get_all_cases():
        if case["case_id"] == case_id:
            continue

        shared = normalized & case["wallet_addresses"]

        if not shared:
            continue

        related.append(
            {
                "case_id": case["case_id"],
                "wallet_address": case["wallet_address"],
                "shared_wallets": sorted(shared),
                "finding": (
                    f"Potential connection detected: this investigation "
                    f"shares {len(shared)} wallet(s) with case "
                    f"'{case['case_id']}'."
                ),
                "interpretation_note": (
                    "A shared wallet indicates a common financial "
                    "touchpoint between cases. It does not establish "
                    "that the same individual, group, or entity is "
                    "responsible for both cases, nor that the cases "
                    "are otherwise related. Human verification is "
                    "required."
                ),
            }
        )

    return related
