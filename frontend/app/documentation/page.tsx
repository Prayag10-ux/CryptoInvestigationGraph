"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ClipboardCheck,
    Download,
    FileText,
    Lock,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
function SectionHeader({
    number,
    title,
}: {
    number: string;
    title: string;
}) {
    return (
        <div className="flex items-center justify-between border-b border-[#322D29]/15 px-5 py-4">
            <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#72383D]">
                    {number}
                </span>

                <span className="font-mono text-[10px] font-bold tracking-[0.15em]">
                    {title}
                </span>
            </div>

            <span className="font-mono text-[9px] tracking-[0.14em] text-[#322D29]/30">
                CASE RECORD
            </span>
        </div>
    );
}

function CaseStat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#322D29]/35">
                {label}
            </p>

            <p className="mt-2 font-mono text-sm font-bold tracking-[-0.02em]">
                {value}
            </p>
        </div>
    );
}

function StatusMark({
    children,
    active = true,
}: {
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.12em] ${
                active
                    ? "text-[#72383D]"
                    : "text-[#322D29]/35"
            }`}
        >
            <span
                className={`flex h-5 w-5 items-center justify-center border ${
                    active
                        ? "border-[#72383D]/30 bg-[#72383D]/8"
                        : "border-[#322D29]/15"
                }`}
            >
                {active && <Check size={11} strokeWidth={2.5} />}
            </span>

            {children}
        </div>
    );
}

export default function DocumentationPage() {
    const [generated, setGenerated] = useState(false);
    const [exported, setExported] = useState(false);
    const [caseStatus, setCaseStatus] = useState<
        "DOCUMENTED" | "CLOSED"
    >("DOCUMENTED");

    const handleGenerate = () => {
        setGenerated(true);

        setTimeout(() => {
            setGenerated(false);
        }, 3000);
    };

    const handleExport = () => {
        const record = {
            caseReference: "CG-001",
            subjectWallet: "0x71...8F2",
            network: "Ethereum Mainnet",
            investigationPeriod: "09:14 — 10:03 UTC",
            observedVolume: "42.81 ETH",
            evidenceItems: 4,
            evidenceStatus: "100% observed items verified",
            crossCaseMatches: 3,
            legalAction: "Officer review required",
            finalStatus: caseStatus,
            exportedAt: new Date().toISOString(),
        };

        const blob = new Blob(
            [JSON.stringify(record, null, 2)],
            {
                type: "application/json",
            }
        );

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = "CG-001-case-record.json";
        anchor.click();

        URL.revokeObjectURL(url);

        setExported(true);

        setTimeout(() => {
            setExported(false);
        }, 3000);
    };

    return (
        <main className="min-h-screen bg-[#EFE9E1] text-[#322D29]">
            {/* ============================================================
                HEADER
            ============================================================ */}

            <SiteHeader activePage="documentation" />

            {/* ============================================================
                CASE HEADER
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 pt-32">
                <div className="mx-auto max-w-[1600px] px-6 pb-10 lg:px-10">
                    <div className="mb-4 flex items-center gap-3">
                        <Link
                            href="/action"
                            className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-[#322D29]/35 transition hover:text-[#72383D]"
                        >
                            <ArrowLeft size={11} />
                            BACK TO LEGAL ACTION
                        </Link>

                        <span className="h-px w-8 bg-[#72383D]" />
                    </div>

                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <div className="flex flex-wrap items-center gap-4">
                                <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#72383D]">
                                    CASE / CG-001
                                </p>

                                <span className="rounded-full border border-[#72383D]/25 bg-[#72383D]/5 px-3 py-1.5 font-mono text-[8px] font-bold tracking-[0.12em] text-[#72383D]">
                                    CASE RECORD
                                </span>
                            </div>

                            <h1 className="mt-4 text-5xl font-medium tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Case
                                <span className="text-[#72383D]">
                                    {" "}
                                    documentation.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#322D29]/50">
                                Consolidate the verified investigation
                                trail into a structured case record for
                                investigator review, documentation and
                                closure.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-3">
                            <CaseStat
                                label="CASE"
                                value="CG-001"
                            />

                            <CaseStat
                                label="NETWORK"
                                value="ETHEREUM"
                            />

                            <CaseStat
                                label="STATUS"
                                value={caseStatus}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                CASE OVERVIEW
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#D9D9D9]/20">
                <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-10 lg:py-20">
                    <SectionHeader
                        number="01"
                        title="CASE OVERVIEW"
                    />

                    <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <div className="border border-[#322D29]/15 bg-[#EFE9E1] p-6">
                            <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#322D29]/40">
                                SUBJECT WALLET
                            </p>

                            <p className="mt-4 font-mono text-sm font-bold">
                                0x71...8F2
                            </p>

                            <p className="mt-2 font-mono text-[9px] text-[#322D29]/35">
                                PRIMARY SUBJECT
                            </p>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#EFE9E1] p-6">
                            <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#322D29]/40">
                                INVESTIGATION PERIOD
                            </p>

                            <p className="mt-4 font-mono text-sm font-bold">
                                09:14 — 10:03 UTC
                            </p>

                            <p className="mt-2 font-mono text-[9px] text-[#322D29]/35">
                                OBSERVED WINDOW
                            </p>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#EFE9E1] p-6">
                            <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#322D29]/40">
                                OBSERVED VOLUME
                            </p>

                            <p className="mt-4 text-2xl font-medium tracking-[-0.04em]">
                                42.81 ETH
                            </p>

                            <p className="mt-2 font-mono text-[9px] text-[#322D29]/35">
                                TRACE RECORD
                            </p>
                        </div>

                        <div className="border border-[#72383D]/20 bg-[#72383D]/5 p-6">
                            <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#72383D]">
                                EVIDENCE
                            </p>

                            <p className="mt-4 text-2xl font-medium tracking-[-0.04em]">
                                04
                            </p>

                            <p className="mt-2 font-mono text-[9px] text-[#72383D]/55">
                                VERIFIED ITEMS
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                TRACE RECORD
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <SectionHeader
                        number="02"
                        title="TRACE RECORD"
                    />

                    <div className="mt-8 border border-[#322D29]/15">
                        <div className="grid grid-cols-1 md:grid-cols-4">
                            <div className="border-b border-[#322D29]/10 p-6 md:border-b-0 md:border-r">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                    ORIGIN
                                </p>

                                <p className="mt-4 font-mono text-sm font-bold">
                                    0x71...8F2
                                </p>
                            </div>

                            <div className="border-b border-[#322D29]/10 p-6 md:border-b-0 md:border-r">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                    INTERMEDIARY
                                </p>

                                <p className="mt-4 font-mono text-sm font-bold">
                                    0xC12...8D4
                                </p>
                            </div>

                            <div className="border-b border-[#322D29]/10 p-6 md:border-b-0 md:border-r">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                    DESTINATION
                                </p>

                                <p className="mt-4 font-mono text-sm font-bold">
                                    0xA1...D84
                                </p>
                            </div>

                            <div className="p-6">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                    TRACE STATUS
                                </p>

                                <p className="mt-4 font-mono text-sm font-bold text-[#72383D]">
                                    COMPLETE
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
                        <div className="border border-[#322D29]/15 p-5">
                            <p className="font-mono text-[9px] tracking-[0.1em] text-[#322D29]/35">
                                SUBJECT
                            </p>

                            <p className="mt-3 font-mono text-xs">
                                0x71...8F2
                            </p>
                        </div>

                        <ArrowRight
                            size={15}
                            className="hidden text-[#72383D] md:block"
                        />

                        <div className="border border-[#72383D]/25 bg-[#72383D]/5 p-5">
                            <p className="font-mono text-[9px] tracking-[0.1em] text-[#72383D]/55">
                                SHARED INTERMEDIARY
                            </p>

                            <p className="mt-3 font-mono text-xs">
                                0xC12...8D4
                            </p>
                        </div>

                        <ArrowRight
                            size={15}
                            className="hidden text-[#72383D] md:block"
                        />

                        <div className="border border-[#322D29]/15 p-5">
                            <p className="font-mono text-[9px] tracking-[0.1em] text-[#322D29]/35">
                                EXCHANGE
                            </p>

                            <p className="mt-3 font-mono text-xs">
                                0xA1...D84
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                EVIDENCE
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#D9D9D9]/20">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <SectionHeader
                        number="03"
                        title="KEY EVIDENCE"
                    />

                    <div className="mt-8 grid gap-3 md:grid-cols-2">
                        {[
                            [
                                "TX-001",
                                "OUTBOUND TRANSFER",
                                "09:14:21 UTC",
                                "4.82 ETH",
                                "0x71...8F2 → 0x29...A91",
                            ],
                            [
                                "TX-002",
                                "FORWARD TRANSFER",
                                "09:25:46 UTC",
                                "4.80 ETH",
                                "0x29...A91 → 0xC12...8D4",
                            ],
                            [
                                "TX-003",
                                "FORWARD MOVEMENT",
                                "09:41:02 UTC",
                                "4.75 ETH",
                                "0xC12...8D4 → 0x91...77A",
                            ],
                            [
                                "TX-004",
                                "EXCHANGE INTERACTION",
                                "10:03:18 UTC",
                                "4.71 ETH",
                                "0x91...77A → 0xA1...D84",
                            ],
                        ].map((item) => (
                            <div
                                key={item[0]}
                                className="border border-[#322D29]/15 bg-[#EFE9E1] p-6"
                            >
                                <div className="flex items-start justify-between gap-5">
                                    <div>
                                        <p className="font-mono text-[10px] font-bold tracking-[0.13em] text-[#72383D]">
                                            {item[0]}
                                        </p>

                                        <h3 className="mt-2 text-lg font-medium tracking-[-0.03em]">
                                            {item[1]}
                                        </h3>
                                    </div>

                                    <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-[#72383D]">
                                        VERIFIED
                                    </span>
                                </div>

                                <div className="mt-6 grid gap-3 border-t border-[#322D29]/10 pt-5 sm:grid-cols-2">
                                    <div>
                                        <p className="font-mono text-[9px] text-[#322D29]/35">
                                            TIMESTAMP
                                        </p>

                                        <p className="mt-2 font-mono text-xs">
                                            {item[2]}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-mono text-[9px] text-[#322D29]/35">
                                            AMOUNT
                                        </p>

                                        <p className="mt-2 font-mono text-xs">
                                            {item[3]}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-5 font-mono text-[9px] tracking-[0.07em] text-[#322D29]/45">
                                    {item[4]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                FINDINGS
            ============================================================ */}

            <section className="border-b border-[#EFE9E1]/10 bg-[#292522] text-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[9px] tracking-[0.14em] text-[#EFE9E1]/40">
                                04 / BEHAVIOURAL FINDINGS
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Patterns remain part of the record.
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-7 text-[#EFE9E1]/40">
                                Behavioural indicators are documented
                                alongside individual transactions to
                                preserve the broader investigative context.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="border border-[#EFE9E1]/10 p-6">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#EFE9E1]/35">
                                    COUNTERPARTY DIVERSITY
                                </p>

                                <p className="mt-4 text-3xl font-medium">
                                    17
                                </p>
                            </div>

                            <div className="border border-[#EFE9E1]/10 p-6">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#EFE9E1]/35">
                                    INBOUND CONCENTRATION
                                </p>

                                <p className="mt-4 text-3xl font-medium">
                                    61.4%
                                </p>
                            </div>

                            <div className="border border-[#EFE9E1]/10 p-6">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#EFE9E1]/35">
                                    FORWARD MOVEMENT
                                </p>

                                <p className="mt-4 font-mono text-sm font-bold text-[#EFE9E1]">
                                    DETECTED
                                </p>
                            </div>

                            <div className="border border-[#EFE9E1]/10 p-6">
                                <p className="font-mono text-[9px] tracking-[0.12em] text-[#EFE9E1]/35">
                                    TRACE INTERVAL
                                </p>

                                <p className="mt-4 text-3xl font-medium">
                                    11 MIN
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                CROSS CASE
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <SectionHeader
                        number="05"
                        title="CROSS-CASE INTELLIGENCE"
                    />

                    <div className="mt-8 border border-[#72383D]/20 bg-[#72383D]/5 p-7">
                        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                            <div>
                                <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#72383D]">
                                    03 LINKED CASES
                                </p>

                                <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em]">
                                    Shared entities documented.
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#322D29]/55">
                                    Three case relationships are included
                                    in the current record for investigator
                                    review.
                                </p>
                            </div>

                            <Link
                                href="/cross-case"
                                className="inline-flex items-center justify-center gap-2 border border-[#322D29]/20 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.12em] transition hover:border-[#72383D] hover:text-[#72383D]"
                            >
                                REVIEW CROSS-CASE
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                LEGAL ACTION
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#D9D9D9]/20">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <SectionHeader
                        number="06"
                        title="LEGAL ACTION STATUS"
                    />

                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                        <div className="border border-[#322D29]/15 bg-[#EFE9E1] p-7">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#72383D]/25 bg-[#72383D]/7 text-[#72383D]">
                                    <FileText size={17} />
                                </div>

                                <div>
                                    <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#72383D]">
                                        REQUISITION DRAFT
                                    </p>

                                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                                        Preservation & Review Request
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#322D29]/55">
                                        The legal-action draft prepared
                                        from the investigation remains
                                        subject to officer and applicable
                                        legal review.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 grid gap-5 border-t border-[#322D29]/10 pt-6 md:grid-cols-2">
                                <StatusMark>
                                    INVESTIGATION EVIDENCE ATTACHED
                                </StatusMark>

                                <StatusMark>
                                    DESTINATION IDENTIFIED
                                </StatusMark>

                                <StatusMark>
                                    TRACE PROVENANCE AVAILABLE
                                </StatusMark>

                                <StatusMark>
                                    OFFICER REVIEW REQUIRED
                                </StatusMark>
                            </div>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#EFE9E1] p-7">
                            <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                ACTION STATUS
                            </p>

                            <p className="mt-4 text-3xl font-medium tracking-[-0.05em]">
                                REVIEW
                            </p>

                            <p className="mt-3 text-sm leading-7 text-[#322D29]/50">
                                Prepared for investigator review. Not a
                                filed legal document.
                            </p>

                            <Link
                                href="/action"
                                className="mt-6 inline-flex items-center gap-2 border border-[#322D29]/20 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.12em] transition hover:border-[#72383D] hover:text-[#72383D]"
                            >
                                OPEN ACTION
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                INVESTIGATOR REVIEW
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <SectionHeader
                        number="07"
                        title="INVESTIGATOR REVIEW"
                    />

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                        <div className="border border-[#322D29]/15 p-7">
                            <div className="flex items-center gap-3">
                                <ClipboardCheck
                                    size={18}
                                    className="text-[#72383D]"
                                />

                                <p className="font-mono text-[10px] font-bold tracking-[0.14em]">
                                    DOCUMENTATION CHECKLIST
                                </p>
                            </div>

                            <div className="mt-7 space-y-5">
                                <StatusMark>
                                    CASE DETAILS VERIFIED
                                </StatusMark>

                                <StatusMark>
                                    TRACE RECORD DOCUMENTED
                                </StatusMark>

                                <StatusMark>
                                    EVIDENCE INTEGRITY CONFIRMED
                                </StatusMark>

                                <StatusMark>
                                    CROSS-CASE MATCHES REVIEWED
                                </StatusMark>

                                <StatusMark>
                                    LEGAL ACTION STATUS RECORDED
                                </StatusMark>
                            </div>
                        </div>

                        <div className="border border-[#322D29]/15 p-7">
                            <div className="flex items-center gap-3">
                                <ShieldCheck
                                    size={18}
                                    className="text-[#72383D]"
                                />

                                <p className="font-mono text-[10px] font-bold tracking-[0.14em]">
                                    INVESTIGATOR NOTE
                                </p>
                            </div>

                            <p className="mt-6 text-sm leading-7 text-[#322D29]/60">
                                Investigation findings, transaction
                                provenance and cross-case relationships
                                are consolidated in this record. Exchange
                                attribution and linked-case relationships
                                remain subject to independent investigator
                                verification before external action.
                            </p>

                            <div className="mt-7 grid gap-6 border-t border-[#322D29]/10 pt-6 md:grid-cols-2">
                                <div>
                                    <p className="mb-8 font-mono text-[9px] font-bold tracking-[0.12em] text-[#322D29]/30">
                                        INVESTIGATING OFFICER
                                    </p>

                                    <div className="border-b border-[#322D29]/25" />
                                </div>

                                <div>
                                    <p className="mb-8 font-mono text-[9px] font-bold tracking-[0.12em] text-[#322D29]/30">
                                        DATE
                                    </p>

                                    <div className="border-b border-[#322D29]/25" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                CASE STATUS
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#D9D9D9]/20">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <SectionHeader
                        number="08"
                        title="CASE STATUS"
                    />

                    <div className="mt-8 border border-[#72383D]/25 bg-[#72383D]/5 p-7">
                        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#72383D]/25 bg-[#EFE9E1] text-[#72383D]">
                                    <Lock size={18} />
                                </div>

                                <div>
                                    <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#72383D]">
                                        FINAL RECORD STATE
                                    </p>

                                    <h2 className="mt-2 text-3xl font-medium tracking-[-0.05em]">
                                        {caseStatus === "CLOSED"
                                            ? "Case Closed"
                                            : "Ready for Closure"}
                                    </h2>

                                    <p className="mt-2 max-w-xl text-sm leading-7 text-[#322D29]/55">
                                        {caseStatus === "CLOSED"
                                            ? "The case record has been marked closed in this investigator interface."
                                            : "All documented investigation components are assembled and available for final officer review."}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setCaseStatus((current) =>
                                        current === "DOCUMENTED"
                                            ? "CLOSED"
                                            : "DOCUMENTED"
                                    )
                                }
                                className="border border-[#72383D]/30 bg-[#EFE9E1] px-6 py-4 font-mono text-[10px] font-bold tracking-[0.13em] text-[#72383D] transition hover:bg-[#72383D]/8"
                            >
                                {caseStatus === "CLOSED"
                                    ? "REOPEN FOR REVIEW"
                                    : "MARK CASE CLOSED"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                ACTION BAR
            ============================================================ */}

            <section className="bg-[#292522] p-6 text-[#EFE9E1] lg:p-8">
                <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-7 lg:flex-row lg:items-center">
                    <div>
                        <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#EFE9E1]/45">
                            CASE RECORD / CG-001
                        </p>

                        <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                            Investigation record ready for documentation.
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-7 text-[#EFE9E1]/45">
                            Generate the report view or export the
                            currently documented case record.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={handleGenerate}
                            className="inline-flex items-center justify-center gap-2 border border-[#EFE9E1]/25 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.12em] transition hover:border-[#EFE9E1]/60"
                        >
                            <FileText size={14} />

                            {generated
                                ? "REPORT GENERATED"
                                : "GENERATE REPORT"}
                        </button>

                        <button
                            onClick={handleExport}
                            className="inline-flex items-center justify-center gap-2 bg-[#EFE9E1] px-5 py-3 font-mono text-[10px] font-bold tracking-[0.12em] text-[#292522] transition-opacity hover:opacity-85"
                        >
                            <Download size={14} />

                            {exported
                                ? "EXPORTED"
                                : "EXPORT CASE RECORD"}
                        </button>
                    </div>
                </div>
            </section>

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <footer className="bg-[#EFE9E1]">
                <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-5 px-6 py-7 md:flex-row md:items-center lg:px-10">
                    <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                        TRACE → EVIDENCE → CROSS-CASE → ACTION → DOCUMENTATION
                    </p>

                    <div className="flex items-center gap-5">
                        <Link
                            href="/action"
                            className="inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.12em] text-[#322D29]/50 transition hover:text-[#72383D]"
                        >
                            <ArrowLeft size={12} />
                            LEGAL ACTION
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.12em] text-[#322D29]/50 transition hover:text-[#72383D]"
                        >
                            PORTAL HOME
                            <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}