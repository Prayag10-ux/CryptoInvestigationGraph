import pytest

from backend.cases.case_store import (
    clear_cases,
    create_case,
    get_all_cases,
    get_case,
)
from backend.cases.correlation_engine import find_related_cases


WALLET_VICTIM_A = "0x1111111111111111111111111111111111111111"
WALLET_VICTIM_B = "0x2222222222222222222222222222222222222222"
WALLET_SHARED_INTERMEDIARY = "0x3333333333333333333333333333333333333333"
WALLET_UNRELATED = "0x4444444444444444444444444444444444444444"


@pytest.fixture(autouse=True)
def _reset_case_store():
    """Ensure the process-global case store starts empty for each test."""
    clear_cases()
    yield
    clear_cases()


def test_create_case_stores_normalized_wallet_addresses():
    case = create_case(
        case_id="CASE-A",
        wallet_address=WALLET_VICTIM_A,
        related_wallets=[
            WALLET_VICTIM_A,
            WALLET_SHARED_INTERMEDIARY.upper(),
        ],
    )

    assert case["case_id"] == "CASE-A"
    assert case["wallet_address"] == WALLET_VICTIM_A.lower()
    assert WALLET_SHARED_INTERMEDIARY.lower() in case["wallet_addresses"]

    stored = get_case("CASE-A")
    assert stored == case


def test_get_all_cases_returns_every_stored_case():
    create_case("CASE-A", WALLET_VICTIM_A, [WALLET_VICTIM_A])
    create_case("CASE-B", WALLET_VICTIM_B, [WALLET_VICTIM_B])

    all_cases = get_all_cases()

    assert len(all_cases) == 2
    assert {c["case_id"] for c in all_cases} == {"CASE-A", "CASE-B"}


def test_find_related_cases_detects_shared_wallet():
    create_case(
        case_id="CASE-A",
        wallet_address=WALLET_VICTIM_A,
        related_wallets=[WALLET_VICTIM_A, WALLET_SHARED_INTERMEDIARY],
    )

    related = find_related_cases(
        case_id="CASE-B",
        wallet_addresses={WALLET_VICTIM_B, WALLET_SHARED_INTERMEDIARY},
    )

    assert len(related) == 1
    assert related[0]["case_id"] == "CASE-A"
    assert related[0]["shared_wallets"] == [
        WALLET_SHARED_INTERMEDIARY.lower()
    ]

    # The finding must not assert shared ownership or a shared actor.
    assert "does not establish" in related[0]["interpretation_note"]


def test_find_related_cases_returns_empty_when_no_overlap():
    create_case(
        case_id="CASE-A",
        wallet_address=WALLET_VICTIM_A,
        related_wallets=[WALLET_VICTIM_A],
    )

    related = find_related_cases(
        case_id="CASE-B",
        wallet_addresses={WALLET_UNRELATED},
    )

    assert related == []


def test_find_related_cases_excludes_the_case_itself():
    create_case(
        case_id="CASE-A",
        wallet_address=WALLET_VICTIM_A,
        related_wallets=[WALLET_VICTIM_A, WALLET_SHARED_INTERMEDIARY],
    )

    # Re-investigating the same case id should not "connect" to itself.
    related = find_related_cases(
        case_id="CASE-A",
        wallet_addresses={WALLET_VICTIM_A, WALLET_SHARED_INTERMEDIARY},
    )

    assert related == []


def test_find_related_cases_is_case_insensitive():
    create_case(
        case_id="CASE-A",
        wallet_address=WALLET_VICTIM_A,
        related_wallets=[WALLET_VICTIM_A, WALLET_SHARED_INTERMEDIARY],
    )

    related = find_related_cases(
        case_id="CASE-B",
        wallet_addresses={WALLET_SHARED_INTERMEDIARY.upper()},
    )

    assert len(related) == 1
    assert related[0]["shared_wallets"] == [
        WALLET_SHARED_INTERMEDIARY.lower()
    ]


def test_find_related_cases_detects_multiple_shared_wallets():
    create_case(
        case_id="CASE-A",
        wallet_address=WALLET_VICTIM_A,
        related_wallets=[
            WALLET_VICTIM_A,
            WALLET_SHARED_INTERMEDIARY,
            WALLET_UNRELATED,
        ],
    )

    related = find_related_cases(
        case_id="CASE-B",
        wallet_addresses={WALLET_SHARED_INTERMEDIARY, WALLET_UNRELATED},
    )

    assert len(related) == 1
    assert related[0]["shared_wallets"] == sorted(
        [WALLET_SHARED_INTERMEDIARY.lower(), WALLET_UNRELATED.lower()]
    )
