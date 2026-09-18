"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    GitBranch,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader";
type CaseMatch = {
    id: string;
    title: string;
    date: string;
    status: "HIGH" | "MEDIUM";
    victim: string;
    sharedEntity: string;
    entityType: string;
    relationship: string;
    evidence: string;
    confidence: string;
    transactions: string;
    amount: string;
};

const caseMatches: CaseMatch[] = [
    {
        id: "CG-014",
        title: "Shared intermediary wallet",
        date: "2026-09-08",
        status: "HIGH",
        victim: "Reported crypto fraud",
        sharedEntity: "0xC12...8D4",
        entityType: "INTERMEDIARY",
        relationship:
            "Observed intermediary address appears in the transaction path of both cases.",
        evidence:
            "7 matching transactions across the documented investigation windows.",
        confidence: "HIGH",
        transactions: "07",
        amount: "18.42 ETH",
    },
    {
        id: "CG-027",
        title: "Shared destination address",
        date: "2026-09-03",
        status: "MEDIUM",
        victim: "Reported crypto fraud",
        sharedEntity: "0x91...77A",
        entityType: "DESTINATION",
        relationship:
            "Both case records contain observed movement toward the same destination address.",
        evidence:
            "4 matching transactions identified across the two case records.",
        confidence: "MEDIUM",
        transactions: "04",
        amount: "9.18 ETH",
    },
    {
        id: "CG-031",
        title: "Common exchange interaction",
        date: "2026-08-29",
        status: "MEDIUM",
        victim: "Reported crypto fraud",
        sharedEntity: "0xA1...D84",
        entityType: "EXCHANGE",
        relationship:
            "Both investigations contain observed interaction with the same exchange address.",
        evidence:
            "3 transaction records terminate at the identified exchange address.",
        confidence: "MEDIUM",
        transactions: "03",
        amount: "12.06 ETH",
    },
];

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
                CASE INTELLIGENCE
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

export default function CrossCasePage() {
    const [selectedId, setSelectedId] = useState("CG-014");

    const selectedCase = useMemo(
        () =>
            caseMatches.find(
                (item) => item.id === selectedId
            ) ?? caseMatches[0],
        [selectedId]
    );

    return (
        <main className="min-h-screen bg-[#EFE9E1] text-[#322D29]">
            {/* ============================================================
                HEADER
            ============================================================ */}

            <SiteHeader activePage="cross-case" />

            {/* ============================================================
                CASE HEADER
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 pt-32">
                <div className="mx-auto max-w-[1600px] px-6 pb-10 lg:px-10">
                    <div className="mb-4 flex items-center gap-3">
                        <Link
                            href="/investigation"
                            className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-[#322D29]/35 transition hover:text-[#72383D]"
                        >
                            <ArrowLeft size={11} />
                            BACK TO INVESTIGATION
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
                                    INTELLIGENCE REVIEW
                                </span>
                            </div>

                            <h1 className="mt-4 text-5xl font-medium tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Cross-case
                                <span className="text-[#72383D]">
                                    {" "}
                                    intelligence.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#322D29]/50">
                                Compare the current investigation against
                                documented case records to identify shared
                                wallets, destinations and exchange
                                interactions for investigator review.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-3">
                            <CaseStat
                                label="CASE"
                                value="CG-001"
                            />

                            <CaseStat
                                label="MATCHES"
                                value="03"
                            />

                            <CaseStat
                                label="STATUS"
                                value="REVIEW"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                OVERVIEW
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#D9D9D9]/20">
                <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-10 lg:py-20">
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="border border-[#322D29]/15 bg-[#EFE9E1] p-6">
                            <div className="flex items-center gap-3">
                                <Wallet
                                    size={17}
                                    className="text-[#72383D]"
                                />

                                <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#322D29]/45">
                                    CURRENT SUBJECT
                                </p>
                            </div>

                            <p className="mt-5 font-mono text-lg font-bold">
                                0x71...8F2
                            </p>

                            <p className="mt-2 font-mono text-[9px] tracking-[0.1em] text-[#322D29]/35">
                                PRIMARY INVESTIGATION WALLET
                            </p>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#EFE9E1] p-6">
                            <div className="flex items-center gap-3">
                                <GitBranch
                                    size={17}
                                    className="text-[#72383D]"
                                />

                                <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#322D29]/45">
                                    OBSERVED VOLUME
                                </p>
                            </div>

                            <p className="mt-5 text-3xl font-medium tracking-[-0.05em]">
                                42.81 ETH
                            </p>

                            <p className="mt-2 font-mono text-[9px] tracking-[0.1em] text-[#322D29]/35">
                                DOCUMENTED TRACE ACTIVITY
                            </p>
                        </div>

                        <div className="border border-[#72383D]/20 bg-[#72383D]/5 p-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheck
                                    size={17}
                                    className="text-[#72383D]"
                                />

                                <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#72383D]">
                                    LINKED CASES
                                </p>
                            </div>

                            <p className="mt-5 text-3xl font-medium tracking-[-0.05em]">
                                03
                            </p>

                            <p className="mt-2 font-mono text-[9px] tracking-[0.1em] text-[#72383D]/55">
                                MATCHES REQUIRE REVIEW
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                CASE MATCHES
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <SectionHeader
                        number="01"
                        title="MATCHED CASES"
                    />

                    <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
                        <div className="space-y-2">
                            {caseMatches.map((item) => {
                                const selected =
                                    item.id === selectedId;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            setSelectedId(item.id)
                                        }
                                        className={`w-full border p-5 text-left transition ${
                                            selected
                                                ? "border-[#72383D]/35 bg-[#72383D]/5"
                                                : "border-[#322D29]/10 bg-[#D9D9D9]/15 hover:border-[#322D29]/25"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-mono text-[10px] font-bold tracking-[0.13em] text-[#72383D]">
                                                    {item.id}
                                                </p>

                                                <h3 className="mt-2 text-lg font-medium tracking-[-0.03em]">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-[#72383D]">
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between border-t border-[#322D29]/10 pt-4">
                                            <span className="font-mono text-[9px] tracking-[0.08em] text-[#322D29]/40">
                                                {item.date}
                                            </span>

                                            <span className="font-mono text-[9px] tracking-[0.08em] text-[#322D29]/40">
                                                {item.transactions} TX
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#D9D9D9]/20">
                            <div className="border-b border-[#322D29]/10 p-7">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                    <div>
                                        <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#72383D]">
                                            SELECTED CASE /{" "}
                                            {selectedCase.id}
                                        </p>

                                        <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                                            {selectedCase.title}
                                        </h2>
                                    </div>

                                    <span className="border border-[#72383D]/25 bg-[#72383D]/5 px-3 py-2 font-mono text-[9px] font-bold tracking-[0.1em] text-[#72383D]">
                                        {selectedCase.confidence} MATCH
                                    </span>
                                </div>
                            </div>

                            <div className="p-7">
                                <div className="grid gap-0 sm:grid-cols-2">
                                    <div className="border-b border-[#322D29]/10 pb-5 sm:border-r sm:pr-6">
                                        <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                            SHARED ENTITY
                                        </p>

                                        <p className="mt-3 font-mono text-sm font-bold">
                                            {selectedCase.sharedEntity}
                                        </p>

                                        <p className="mt-1 font-mono text-[9px] text-[#322D29]/35">
                                            {selectedCase.entityType}
                                        </p>
                                    </div>

                                    <div className="border-b border-[#322D29]/10 pb-5 pt-5 sm:pl-6 sm:pt-0">
                                        <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                            OBSERVED AMOUNT
                                        </p>

                                        <p className="mt-3 font-mono text-sm font-bold">
                                            {selectedCase.amount}
                                        </p>

                                        <p className="mt-1 font-mono text-[9px] text-[#322D29]/35">
                                            MATCHED TRANSACTION VOLUME
                                        </p>
                                    </div>

                                    <div className="border-b border-[#322D29]/10 py-5 sm:border-r sm:pr-6">
                                        <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                            TRANSACTIONS
                                        </p>

                                        <p className="mt-3 font-mono text-sm font-bold">
                                            {selectedCase.transactions}
                                        </p>
                                    </div>

                                    <div className="border-b border-[#322D29]/10 py-5 sm:pl-6">
                                        <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                            CASE DATE
                                        </p>

                                        <p className="mt-3 font-mono text-sm font-bold">
                                            {selectedCase.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-7 border border-[#322D29]/10 bg-[#EFE9E1] p-6">
                                    <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#72383D]">
                                        RELATIONSHIP
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-[#322D29]/60">
                                        {selectedCase.relationship}
                                    </p>
                                </div>

                                <div className="mt-3 border border-[#322D29]/10 bg-[#EFE9E1] p-6">
                                    <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#72383D]">
                                        EVIDENCE
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-[#322D29]/60">
                                        {selectedCase.evidence}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                RELATIONSHIP PATH
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#292522] text-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[9px] tracking-[0.14em] text-[#EFE9E1]/40">
                                02 / RELATIONSHIP PATH
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Shared entities connect the record.
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-7 text-[#EFE9E1]/40">
                                Cross-case matches show where documented
                                transaction paths intersect. They provide
                                investigative leads rather than independent
                                proof of ownership or attribution.
                            </p>
                        </div>

                        <div className="border border-[#EFE9E1]/10">
                            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
                                <div className="p-6">
                                    <p className="font-mono text-[9px] tracking-[0.12em] text-[#EFE9E1]/35">
                                        CURRENT CASE
                                    </p>

                                    <p className="mt-3 font-mono text-sm font-bold">
                                        0x71...8F2
                                    </p>
                                </div>

                                <ArrowRight
                                    size={15}
                                    className="text-[#72383D]"
                                />

                                <div className="border-x border-[#EFE9E1]/10 bg-[#72383D]/10 p-6">
                                    <p className="font-mono text-[9px] tracking-[0.12em] text-[#72383D]">
                                        SHARED ENTITY
                                    </p>

                                    <p className="mt-3 font-mono text-sm font-bold">
                                        {selectedCase.sharedEntity}
                                    </p>
                                </div>

                                <ArrowRight
                                    size={15}
                                    className="text-[#72383D]"
                                />

                                <div className="p-6">
                                    <p className="font-mono text-[9px] tracking-[0.12em] text-[#EFE9E1]/35">
                                        MATCHED CASE
                                    </p>

                                    <p className="mt-3 font-mono text-sm font-bold">
                                        {selectedCase.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                REVIEW
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-24">
                    <div className="border border-[#72383D]/20 bg-[#72383D]/5 p-7 lg:p-9">
                        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#72383D]/25 bg-[#EFE9E1] text-[#72383D]">
                                    <Check size={17} />
                                </div>

                                <div>
                                    <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#72383D]">
                                        INVESTIGATOR REVIEW
                                    </p>

                                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                                        Matches documented for review.
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#322D29]/55">
                                        Shared addresses and transaction
                                        relationships are surfaced as
                                        intelligence leads. They do not,
                                        by themselves, establish ownership,
                                        identity or criminal attribution.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/evidence"
                                    className="inline-flex items-center justify-center gap-2 border border-[#322D29]/20 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.12em] transition hover:border-[#72383D] hover:text-[#72383D]"
                                >
                                    VIEW EVIDENCE
                                    <ArrowRight size={13} />
                                </Link>

                                <Link
                                    href="/action"
                                    className="inline-flex items-center justify-center gap-2 bg-[#292522] px-5 py-3 font-mono text-[10px] font-bold tracking-[0.12em] text-[#EFE9E1] transition-opacity hover:opacity-85"
                                >
                                    LEGAL ACTION
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <footer className="bg-[#EFE9E1]">
                <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-5 px-6 py-7 md:flex-row md:items-center lg:px-10">
                    <p className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                        TRACE → EVIDENCE → CROSS-CASE → ACTION
                    </p>

                    <Link
                        href="/documentation"
                        className="inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.12em] text-[#322D29]/50 transition hover:text-[#72383D]"
                    >
                        DOCUMENTATION
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </footer>
        </main>
    );
}