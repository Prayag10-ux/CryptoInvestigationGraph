from datetime import datetime, timezone


def build_investigator_report(
    case_id: str,
    wallet_address: str,
    transaction_count: int,
    analysis: dict,
    risk_signals: dict,
    fund_flow_paths: list[dict],
    graph: dict,
    attributions: list[dict],
    evidence: list[dict],
    timeline: list[dict],
    related_cases: list[dict],
    complaint_metadata: dict | None = None,
) -> dict:
    """
    Assemble a single investigator-facing report.

    This combines outputs already produced elsewhere in the
    investigation pipeline into one structured object. It does not
    compute any new conclusions -- every field here is either a
    direct pass-through or a straightforward summary (counts,
    groupings) of results already produced by other modules.

    The report keeps observed facts (transaction data, evidence
    provenance) and investigative conclusions (attribution,
    confidence) clearly separated, and is intended to support human
    investigator review -- not as an automated determination of
    wrongdoing.
    """
    candidate_entities = [
        item
        for item in attributions
        if item["attribution"].get("has_candidate")
    ]

    return {
        "report_generated_at": datetime.now(timezone.utc).isoformat(),
        "case_id": case_id,
        "complaint_metadata": complaint_metadata,
        "investigated_wallet": wallet_address,
        "network": "ethereum",
        "transaction_summary": {
            "total_transactions": transaction_count,
            "successful_transactions": analysis["successful_transactions"],
            "failed_transactions": analysis["failed_transactions"],
            "total_inbound_eth": analysis["total_inbound_eth"],
            "total_outbound_eth": analysis["total_outbound_eth"],
            "net_flow_eth": analysis["net_flow_eth"],
        },
        "risk_signals": risk_signals,
        "fund_flow_path_count": len(fund_flow_paths),
        "graph_summary": {
            "visited_wallet_count": graph["visited_wallet_count"],
            "max_depth": graph["max_depth"],
            "node_count": len(graph["nodes"]),
            "edge_count": len(graph["edges"]),
        },
        "candidate_entities": [
            {
                "wallet_address": item["wallet_address"],
                "depth": item["depth"],
                "entity_name": item["attribution"]["entity_name"],
                "entity_type": item["attribution"]["entity_type"],
                "confidence": item["attribution"]["confidence"],
                "supporting_evidence": item["attribution"][
                    "supporting_evidence"
                ],
                "contradicting_evidence": item["attribution"][
                    "contradicting_evidence"
                ],
                "alternative_hypotheses": item["attribution"][
                    "alternative_hypotheses"
                ],
            }
            for item in candidate_entities
        ],
        "investigated_wallet_evidence": evidence,
        "timeline": timeline,
        "related_cases": related_cases,
        "disclaimer": (
            "This report presents investigative indicators and "
            "candidate entity associations derived from public "
            "blockchain data. It does not constitute proof of "
            "ownership, fraud, or money laundering. All findings "
            "require human investigator verification before use in "
            "any legal or enforcement action."
        ),
    }
