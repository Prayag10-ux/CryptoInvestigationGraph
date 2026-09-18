# CryptoInvestigationGraph API

SIH 2026 — SIH26183

## Overview

This document describes the current backend API contract used by the CryptoInvestigationGraph MVP.

The backend is Ethereum/EVM-first and provides:

* wallet investigation
* behavioral risk signals
* transaction graph expansion
* fund-flow analysis
* evidence and provenance
* potential entity attribution
* timeline generation
* cross-case correlation
* investigator report generation
* case retrieval

The API is intended for investigator decision support. Automated findings are investigative indicators and potential associations, not proof of criminal activity or ownership.

---

## Base Endpoint

When running the backend locally:

```text
http://127.0.0.1:8000
```

FastAPI's automatically generated API documentation is available at:

```text
/docs
```

---

# 1. Investigate a Wallet

## Endpoint

```http
POST /investigate
```

Investigates an Ethereum wallet and selectively expands into related wallets.

---

## Request Body

```json
{
  "wallet_address": "0x...",
  "case_id": "CASE-001",
  "complaint_metadata": {
    "reference": "optional complaint reference",
    "filing_date": "optional"
  }
}
```

### Fields

| Field                | Type           | Required | Description                                       |
| -------------------- | -------------- | -------: | ------------------------------------------------- |
| `wallet_address`     | string         |      Yes | Ethereum wallet address to investigate            |
| `case_id`            | string or null |       No | Caller-supplied case reference                    |
| `complaint_metadata` | object or null |       No | Optional complaint context supplied by the caller |

If `case_id` is omitted, the backend generates a placeholder-style case ID.

`complaint_metadata` is stored as supplied. The backend does not claim access to an external complaint-intake system.

---

## Validation

### Invalid Ethereum address

Response:

```http
400 Bad Request
```

```json
{
  "detail": "Invalid Ethereum wallet address."
}
```

### Zero address

Response:

```http
400 Bad Request
```

```json
{
  "detail": "Zero address cannot be investigated."
}
```

### Blockchain retrieval failure

Response:

```http
502 Bad Gateway
```

The exact error message is returned in the `detail` field.

---

# 2. Investigation Response

A successful investigation returns:

```json
{
  "investigation": {},
  "analysis": {},
  "risk_signals": {},
  "fund_flow": {},
  "fund_flow_paths": [],
  "evidence": [],
  "graph": {},
  "attribution": [],
  "related_cases": [],
  "timeline": {},
  "investigator_report": {}
}
```

The response is intentionally additive and designed to support the frontend investigation dashboard.

---

## `investigation`

Contains the basic investigation metadata.

Current fields:

```json
{
  "case_id": "CASE-001",
  "wallet_address": "0x...",
  "network": "ethereum",
  "transaction_count": 123
}
```

---

## `analysis`

Contains the result of the wallet analysis engine.

The exact fields are defined by:

```text
backend/analysis/wallet_analysis.py
```

Frontend code should treat this object according to the current backend implementation rather than assuming undocumented fields.

---

## `risk_signals`

Contains deterministic behavioral indicators.

Current fields include:

```json
{
  "fan_in": false,
  "fan_out": false,
  "high_failure_ratio": false,
  "high_inbound_concentration": false,
  "rapid_movement": false,
  "dormant_to_active": false,
  "inbound_unique_counterparties": 0,
  "outbound_unique_counterparties": 0,
  "failure_ratio": 0.0,
  "inbound_concentration": 0.0
}
```

These are investigative indicators.

They must not be presented as proof of fraud, laundering, or criminal activity.

---

## `fund_flow`

Contains the aggregate result produced by the fund-flow analysis engine.

Source:

```text
backend/analysis/fund_flow.py
```

---

## `fund_flow_paths`

Contains bounded fund-flow traversal results.

Source:

```text
backend/analysis/fund_flow_traversal.py
```

Paths should be presented as observed transaction relationships and should retain the uncertainty of any inferred interpretation.

---

# 3. Evidence

The `evidence` field is an array of explainable investigative findings.

Example structure:

```json
{
  "code": "FAN_OUT_PATTERN",
  "title": "High outbound counterparty diversity",
  "severity": "medium",
  "finding": "12 unique wallets received transactions from the investigated address.",
  "why_it_matters": "A large number of outbound destinations can indicate distribution or fund-dispersal behavior.",
  "provenance": {
    "source_type": "blockchain_transactions",
    "wallet_address": "0x...",
    "transaction_count": 25,
    "transaction_hashes": [
      "0x..."
    ]
  }
}
```

### Evidence fields

| Field            | Description                               |
| ---------------- | ----------------------------------------- |
| `code`           | Stable identifier for the finding         |
| `title`          | Human-readable finding title              |
| `severity`       | Current severity classification           |
| `finding`        | Observed behavioral finding               |
| `why_it_matters` | Investigative interpretation              |
| `provenance`     | Source information supporting the finding |

Evidence provenance is intended to allow the frontend to trace findings back to observed blockchain transactions.

---

# 4. Investigation Graph

The `graph` field contains the controlled wallet expansion result.

Current public graph structure includes:

```json
{
  "root_wallet": "0x...",
  "max_depth": 2,
  "max_wallets": 25,
  "visited_wallet_count": 3,
  "nodes": [],
  "edges": []
}
```

## Nodes

Example:

```json
{
  "address": "0x...",
  "depth": 0,
  "node_type": "investigated_wallet",
  "transaction_count": 120
}
```

Related wallets use:

```json
{
  "node_type": "related_wallet"
}
```

The frontend should visually distinguish the investigated/root wallet from related wallets.

## Edges

Edges represent the selected transaction relationship between wallets.

They can contain:

```json
{
  "from": "0x...",
  "to": "0x...",
  "depth": 1,
  "transaction_count": 4,
  "total_value_wei": 1000000000000000000,
  "total_value_eth": 1.0,
  "directions": []
}
```

Graph expansion is deliberately bounded by depth, wallet count, target count, and pagination limits.

---

# 5. Attribution

`attribution` contains an attribution assessment for each wallet reached during investigation.

Each item contains:

```json
{
  "wallet_address": "0x...",
  "depth": 0,
  "attribution": {
    "wallet_address": "0x...",
    "has_candidate": true,
    "entity_name": "Example Exchange",
    "entity_type": "centralized_exchange",
    "confidence": 0.9,
    "supporting_evidence": [],
    "contradicting_evidence": [],
    "alternative_hypotheses": []
  }
}
```

## Important terminology

The frontend must use language such as:

```text
Potential Entity Association
Candidate Entity
Confidence
Supporting Evidence
Contradicting Evidence
Alternative Hypotheses
```

It must NOT state:

```text
Wallet Owner
Confirmed Exchange
Confirmed Criminal Wallet
Proof of Ownership
```

A candidate association is an investigative assessment and requires human verification.

---

# 6. Timeline

The `timeline` field contains a chronological representation of observed transactions across wallets touched during the investigation.

The timeline is built from transaction data already obtained by the investigation pipeline.

Events preserve transaction-level information such as:

* timestamp
* block number
* transaction hash
* value
* relevant destination/candidate context where available

The backend does not invent complaint events or blockchain facts.

---

# 7. Cross-Case Correlation

The `related_cases` field contains potential connections with previously investigated cases.

A connection may occur when separate investigations share a wallet or other financial touchpoint.

Example conceptual output:

```json
{
  "case_id": "CASE-002",
  "shared_wallets": [
    "0x..."
  ],
  "finding": "Potential connection detected because both investigations interact with the same wallet.",
  "interpretation_note": "This does not establish that the same individual, group, or entity is responsible for both cases. Human verification is required."
}
```

A shared wallet is a potential financial connection, not proof of a shared actor.

---

# 8. Investigator Report

The `investigator_report` field is a structured summary assembled from the investigation results.

It combines information such as:

* case information
* investigated wallet
* transaction summary
* risk signals
* fund-flow path summary
* graph summary
* candidate entities
* confidence
* supporting evidence
* contradicting evidence
* alternative hypotheses
* timeline
* related cases
* provenance
* investigation metadata
* investigative disclaimer

The report is an assembly layer over observed analysis results. It does not independently invent new conclusions.

---

# 9. Retrieve a Case

## Endpoint

```http
GET /cases/{case_id}
```

Returns a previously recorded case.

Example:

```http
GET /cases/CASE-001
```

The case store is currently in-memory.

Therefore cases are available only for the lifetime of the running backend process.

---

## Unknown Case

Response:

```http
404 Not Found
```

```json
{
  "detail": "No case found with id 'CASE-001'."
}
```

---

# 10. Important MVP Limitations

The current backend intentionally does not provide:

* persistent database storage
* authentication or access control
* API rate limiting
* multi-chain investigation
* mixer/bridge tracing
* ML-based attribution
* real-time blockchain streaming
* privileged I4C/NCRP integration

The entity registry currently contains synthetic/demo entity labels.

These labels must not be represented as government intelligence or confirmed real-world ownership.

---

# 11. Investigative Safety

The backend is designed as investigator decision support.

Distinguish between:

### Observed blockchain facts

Examples:

```text
Wallet A sent funds to Wallet B.
Transaction X occurred at timestamp T.
Wallet A interacted with 14 counterparties.
```

and:

### Investigative inferences

Examples:

```text
Rapid movement detected.
Potential entity association.
Potential connection between cases.
```

Inference is not proof.

Human investigators remain responsible for verification and downstream decisions.

