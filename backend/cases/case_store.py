"""
Lightweight in-memory case store.

Stores completed investigations so that future investigations can be
checked for shared wallet infrastructure (cross-case correlation).

This is intentionally simple: an in-process dictionary, not a database.
It exists to demonstrate the CaseGraph concept for the MVP and is not
the final persistence architecture. A real deployment would replace
this with durable storage without changing the function signatures
below.
"""

from datetime import datetime, timezone


_CASES: dict[str, dict] = {}


def create_case(
    case_id: str,
    wallet_address: str,
    related_wallets: list[str],
) -> dict:
    """
    Record a completed investigation as a case.

    related_wallets should include the investigated wallet itself plus
    every wallet discovered during expansion, so future correlation
    checks can detect shared infrastructure between independently
    filed cases.

    Recording a case does not assert any conclusion about the wallets
    it contains; it simply preserves what a single investigation
    touched so that overlaps with other investigations can be found
    later.
    """
    case = {
        "case_id": case_id,
        "wallet_address": wallet_address.lower(),
        "wallet_addresses": {addr.lower() for addr in related_wallets},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    _CASES[case_id] = case

    return case


def get_case(case_id: str) -> dict | None:
    """Return a stored case by id, if one exists."""

    return _CASES.get(case_id)


def get_all_cases() -> list[dict]:
    """Return every stored case."""

    return list(_CASES.values())


def clear_cases() -> None:
    """
    Remove all stored cases.

    Primarily used for test isolation between test runs, since the
    store is process-global.
    """

    _CASES.clear()
