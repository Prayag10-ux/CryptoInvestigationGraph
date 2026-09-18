"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import SiteHeader from "../components/SiteHeader";
export default function ActionPage() {
    const [saved, setSaved] = useState(false);
    const [exported, setExported] = useState(false);

    const [form, setForm] = useState({
        to: "Relevant Exchange / Compliance Team",
        caseReference: "CG-001",
        subjectWallet: "0x71...8F2",
        destination: "0xA1...D84",
        subject:
            "Request for Preservation & Review of Identified Cryptocurrency Assets",
        officer: "",
        date: "",
        notes: "",
    });

    useEffect(() => {
        const savedDraft = localStorage.getItem("cryptoGraphActionDraft");

        if (savedDraft) {
            try {
                setForm(JSON.parse(savedDraft));
            } catch {
                localStorage.removeItem("cryptoGraphActionDraft");
            }
        }
    }, []);

    const updateField = (
        field: keyof typeof form,
        value: string,
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSave = () => {
        localStorage.setItem(
            "cryptoGraphActionDraft",
            JSON.stringify(form),
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleExport = () => {
        setExported(true);
        setTimeout(() => setExported(false), 2500);
    };

    return (
        <main className="min-h-screen bg-[#EFE9E1] text-[#322D29]">

            {/* ============================================================
                NAVIGATION
            ============================================================ */}

           <SiteHeader activePage="action" />

            {/* ============================================================
                CASE HEADER
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 pt-32">
                <div className="mx-auto max-w-[1600px] px-6 pb-10 lg:px-10">

                    <div className="mb-4 flex items-center gap-3">
                        <a
                            href="/evidence"
                            className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-[#322D29]/35 transition hover:text-[#72383D]"
                        >
                            ← BACK TO EVIDENCE
                        </a>

                        <span className="h-px w-8 bg-[#72383D]" />
                    </div>

                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

                        <div>
                            <div className="flex flex-wrap items-center gap-4">
                                <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#72383D]">
                                    CASE / CG-001
                                </p>

                                <span className="rounded-full border border-[#72383D]/25 bg-[#72383D]/5 px-3 py-1.5 font-mono text-[8px] font-bold tracking-[0.12em] text-[#72383D]">
                                    ACTION DRAFT
                                </span>
                            </div>

                            <h1 className="mt-4 text-5xl font-medium tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Legal action
                                <span className="text-[#72383D]">
                                    {" "}
                                    workspace.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#322D29]/50">
                                Convert the verified investigation trail into
                                an officer-reviewable legal requisition draft.
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
                                value="DRAFT"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                WORKSPACE
            ============================================================ */}

            <section className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10">

                {/* CASE & SUBJECT */}

                <section className="mb-6 border border-[#322D29]/15 bg-[#D9D9D9]/35">

                    <SectionHeader
                        number="01"
                        title="CASE & SUBJECT"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-4">

                        <DataBlock
                            label="CASE ID"
                            value="CG-001"
                            mono
                        />

                        <DataBlock
                            label="SUBJECT WALLET"
                            value="0x71...8F2"
                            mono
                        />

                        <DataBlock
                            label="NETWORK"
                            value="ETHEREUM MAINNET"
                            mono
                        />

                        <DataBlock
                            label="INVESTIGATION PERIOD"
                            value="09:14 — 10:03 UTC"
                            mono
                        />

                    </div>
                </section>

                {/* DESTINATION */}

                <section className="mb-6 border border-[#322D29]/15 bg-[#D9D9D9]/35">

                    <SectionHeader
                        number="02"
                        title="DESTINATION EXCHANGE"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3">

                        <DataBlock
                            label="DESTINATION"
                            value="0xA1...D84"
                            mono
                        />

                        <DataBlock
                            label="ATTRIBUTION"
                            value="EXCHANGE INTERACTION"
                        />

                        <DataBlock
                            label="CONFIDENCE"
                            value="EVIDENCE-BACKED"
                        />

                    </div>
                </section>

                {/* TRACE SUMMARY */}

                <section className="mb-6 border border-[#322D29]/15 bg-[#D9D9D9]/35">

                    <SectionHeader
                        number="03"
                        title="TRACE SUMMARY"
                    />

                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                            <TraceCard
                                label="INITIAL TRANSFER"
                                value="4.82 ETH"
                                detail="09:14:21 UTC"
                            />

                            <TraceCard
                                label="INTERMEDIATE PATH"
                                value="3 WALLETS"
                                detail="OBSERVED MOVEMENT"
                            />

                            <TraceCard
                                label="FINAL DESTINATION"
                                value="0xA1...D84"
                                detail="EXCHANGE INTERACTION"
                                mono
                            />

                            <TraceCard
                                label="TRACE INTERVAL"
                                value="49 MIN"
                                detail="09:14 — 10:03 UTC"
                            />

                        </div>

                        <div className="mt-7 border-t border-[#322D29]/10 pt-5">

                            <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-[#322D29]/30">
                                OBSERVED TRANSACTION PATH
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-2">

                                <PathNode value="0x71...8F2" />

                                <PathArrow />

                                <PathNode value="0x29...A91" />

                                <PathArrow />

                                <PathNode value="0xC12...8D4" />

                                <PathArrow />

                                <PathNode value="0x91...77A" />

                                <PathArrow />

                                <PathNode
                                    value="0xA1...D84"
                                    active
                                />

                            </div>
                        </div>
                    </div>
                </section>

                {/* GROUNDS */}

                <section className="mb-6 border border-[#322D29]/15 bg-[#D9D9D9]/35">

                    <SectionHeader
                        number="04"
                        title="GROUNDS FOR ACTION"
                    />

                    <div className="grid grid-cols-1 gap-px bg-[#322D29]/10 md:grid-cols-2">

                        <Finding
                            title="FORWARD MOVEMENT"
                            description="Funds were observed moving through successive counterparties."
                        />

                        <Finding
                            title="RAPID TRANSFERS"
                            description="Multiple transfers occurred within the traced investigation interval."
                        />

                        <Finding
                            title="BEHAVIOURAL INDICATORS"
                            description="Observed transaction behaviour contributed to the investigation findings."
                        />

                        <Finding
                            title="EXCHANGE INTERACTION"
                            description="The traced path terminates at an identified exchange interaction."
                        />

                    </div>
                </section>

                {/* REQUISITION */}

                <section className="mb-6 border border-[#322D29]/15 bg-[#D9D9D9]/35">

                    <SectionHeader
                        number="05"
                        title="REQUISITION DRAFT"
                    />

                    <div className="p-6 lg:p-8">

                        <div className="border border-[#322D29]/15 bg-[#EFE9E1]">

                            <div className="border-b border-[#322D29]/10 p-7">

                                <div className="flex items-start justify-between gap-8">

                                    <div>
                                        <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-[#72383D]">
                                            INVESTIGATION DOCUMENT
                                        </p>

                                        <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                                            Request for Preservation & Review
                                        </h2>
                                    </div>

                                    <p className="font-mono text-[8px] tracking-[0.12em] text-[#322D29]/35">
                                        REF / CG-001
                                    </p>

                                </div>
                            </div>

                            <div className="p-7">

                                <div className="space-y-6 text-sm leading-7">

                                    <EditableDraftLine
                                        label="TO"
                                        value={form.to}
                                        onChange={(value) =>
                                            updateField("to", value)
                                        }
                                    />

                                    <EditableDraftLine
                                        label="CASE REFERENCE"
                                        value={form.caseReference}
                                        onChange={(value) =>
                                            updateField("caseReference", value)
                                        }
                                        mono
                                    />

                                    <EditableDraftLine
                                        label="SUBJECT WALLET"
                                        value={form.subjectWallet}
                                        onChange={(value) =>
                                            updateField("subjectWallet", value)
                                        }
                                        mono
                                    />

                                    <EditableDraftLine
                                        label="DESTINATION"
                                        value={form.destination}
                                        onChange={(value) =>
                                            updateField("destination", value)
                                        }
                                        mono
                                    />

                                    <EditableDraftLine
                                        label="SUBJECT"
                                        value={form.subject}
                                        onChange={(value) =>
                                            updateField("subject", value)
                                        }
                                    />

                                    <div className="border-t border-[#322D29]/10 pt-6">

                                        <p>
                                            Based on the transaction trail and
                                            evidence collected during the
                                            investigation, this draft requests
                                            preservation and appropriate review
                                            of relevant cryptocurrency assets
                                            and associated transaction records
                                            connected to the identified wallet
                                            path.
                                        </p>

                                        <p className="mt-5">
                                            The investigation identified a
                                            transaction sequence beginning with
                                            the subject wallet and progressing
                                            through intermediate counterparties
                                            before reaching the observed
                                            exchange destination.
                                        </p>

                                        <p className="mt-5">
                                            Supporting transaction evidence and
                                            investigation findings are attached
                                            to the case record for review.
                                        </p>

                                    </div>

                                    <div className="border-t border-[#322D29]/10 pt-6">
                                        <label className="grid grid-cols-1 gap-2 md:grid-cols-[130px_1fr] md:gap-5">
                                            <span className="font-mono text-[7px] font-bold tracking-[0.14em] text-[#72383D]">
                                                ADDITIONAL NOTES
                                            </span>

                                            <textarea
                                                value={form.notes}
                                                onChange={(event) =>
                                                    updateField(
                                                        "notes",
                                                        event.target.value,
                                                    )
                                                }
                                                rows={4}
                                                placeholder="Add investigator notes or specific instructions..."
                                                className="w-full resize-y border border-[#322D29]/15 bg-white/30 px-3 py-2 text-sm outline-none transition focus:border-[#72383D]"
                                            />
                                        </label>
                                    </div>

                                    <div className="border-t border-[#322D29]/10 pt-6 text-[#322D29]/45">

                                        <p>
                                            This document is a draft prepared
                                            for investigator review. Any
                                            freeze, restriction, preservation
                                            request, or other legal action
                                            remains subject to the appropriate
                                            officer and applicable legal
                                            process.
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-12 grid grid-cols-1 gap-10 border-t border-[#322D29]/10 pt-8 md:grid-cols-2">

                                    <div>
                                        <label className="mb-3 block font-mono text-[7px] font-bold tracking-[0.14em] text-[#322D29]/30">
                                            INVESTIGATING OFFICER
                                        </label>

                                        <input
                                            type="text"
                                            value={form.officer}
                                            onChange={(event) =>
                                                updateField(
                                                    "officer",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Officer name"
                                            className="w-full border-b border-[#322D29]/30 bg-transparent px-0 py-2 text-sm outline-none placeholder:text-[#322D29]/25 focus:border-[#72383D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-3 block font-mono text-[7px] font-bold tracking-[0.14em] text-[#322D29]/30">
                                            DATE
                                        </label>

                                        <input
                                            type="date"
                                            value={form.date}
                                            onChange={(event) =>
                                                updateField(
                                                    "date",
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full border-b border-[#322D29]/30 bg-transparent px-0 py-2 text-sm outline-none focus:border-[#72383D]"
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* OFFICER REVIEW */}

                <section className="border border-[#72383D]/30 bg-[#D9D9D9]/35">

                    <SectionHeader
                        number="06"
                        title="OFFICER REVIEW"
                    />

                    <div className="flex flex-col gap-7 p-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-[#72383D]" />

                                <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-[#72383D]">
                                    DRAFT — REQUIRES OFFICER REVIEW
                                </p>

                            </div>

                            <p className="mt-3 max-w-xl text-[10px] leading-5 text-[#322D29]/40">
                                Review the requisition and supporting evidence
                                before taking any legal or operational action.
                            </p>

                        </div>

                        <div className="flex flex-wrap gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = "/evidence";
                                }}
                                className="border border-[#322D29]/20 px-5 py-3 text-[8px] font-bold tracking-[0.13em] text-[#322D29]/55 transition hover:border-[#72383D] hover:text-[#72383D]"
                            >
                                ← BACK TO EVIDENCE
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-[#322D29] px-5 py-3 text-[8px] font-bold tracking-[0.13em] text-[#EFE9E1] transition hover:bg-[#72383D]"
                            >
                                {saved ? "✓ DRAFT SAVED" : "SAVE DRAFT"}
                            </button>

                            <button
                                type="button"
                                onClick={handleExport}
                                className="bg-[#72383D] px-5 py-3 text-[8px] font-bold tracking-[0.13em] text-[#EFE9E1] transition hover:opacity-90"
                            >
                                {exported
                                    ? "✓ EXPORT READY"
                                    : "EXPORT DOCUMENT →"}
                            </button>

                        </div>
                    </div>
                </section>

            </section>

            {/* FOOTER */}

            <footer className="border-t border-[#322D29]/15 bg-[#322D29] text-[#EFE9E1]">

                <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-3 px-6 py-8 text-[8px] uppercase tracking-[0.15em] text-[#EFE9E1]/35 lg:flex-row lg:px-10">

                    <span>
                        CRYPTOGRAPH / FINANCIAL INVESTIGATION
                    </span>

                    <span>
                        TRACE → EVIDENCE → ACTION
                    </span>

                </div>

            </footer>
        </main>
    );
}

/* ========================================================================== */
/* COMPONENTS                                                                */
/* ========================================================================== */

function SectionHeader({
    number,
    title,
}: {
    number: string;
    title: string;
}) {
    return (
        <div className="flex items-center gap-4 border-b border-[#322D29]/10 px-5 py-4">

            <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-[#72383D]">
                {number}
            </span>

            <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                {title}
            </p>

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
            <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-[#322D29]/30">
                {label}
            </p>

            <p className="mt-2 font-mono text-[10px] font-bold tracking-[0.05em]">
                {value}
            </p>
        </div>
    );
}

function DataBlock({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="border-b border-[#322D29]/10 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">

            <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-[#322D29]/30">
                {label}
            </p>

            <p
                className={`mt-3 ${
                    mono
                        ? "font-mono text-[10px] font-medium tracking-[0.03em]"
                        : "text-[11px] font-medium"
                }`}
            >
                {value}
            </p>

        </div>
    );
}

function TraceCard({
    label,
    value,
    detail,
    mono = false,
}: {
    label: string;
    value: string;
    detail: string;
    mono?: boolean;
}) {
    return (
        <div className="border border-[#322D29]/10 bg-[#EFE9E1] p-5">

            <p className="font-mono text-[7px] font-bold tracking-[0.14em] text-[#322D29]/30">
                {label}
            </p>

            <p
                className={`mt-3 ${
                    mono
                        ? "font-mono text-[10px] font-medium"
                        : "text-lg font-medium tracking-[-0.02em]"
                }`}
            >
                {value}
            </p>

            <p className="mt-2 font-mono text-[7px] tracking-[0.08em] text-[#322D29]/35">
                {detail}
            </p>

        </div>
    );
}

function PathNode({
    value,
    active = false,
}: {
    value: string;
    active?: boolean;
}) {
    return (
        <span
            className={`border px-3 py-2 font-mono text-[8px] ${
                active
                    ? "border-[#72383D] bg-[#72383D] text-[#EFE9E1]"
                    : "border-[#322D29]/15 bg-[#EFE9E1] text-[#322D29]/60"
            }`}
        >
            {value}
        </span>
    );
}

function PathArrow() {
    return (
        <span className="font-mono text-[9px] text-[#AC9C8D]">
            →
        </span>
    );
}

function Finding({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="bg-[#EFE9E1] p-6">

            <div className="flex items-start gap-3">

                <span className="mt-1 text-[8px] text-[#72383D]">
                    ◆
                </span>

                <div>

                    <p className="font-mono text-[8px] font-bold tracking-[0.14em]">
                        {title}
                    </p>

                    <p className="mt-3 text-[10px] leading-5 text-[#322D29]/45">
                        {description}
                    </p>

                </div>

            </div>
        </div>
    );
}

function EditableDraftLine({
    label,
    value,
    onChange,
    mono = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    mono?: boolean;
}) {
    return (
        <label className="grid grid-cols-1 gap-2 md:grid-cols-[130px_1fr] md:gap-5">
            <span className="font-mono text-[7px] font-bold tracking-[0.14em] text-[#72383D]">
                {label}
            </span>

            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`w-full border-b border-[#322D29]/20 bg-transparent px-0 py-1 outline-none focus:border-[#72383D] ${
                    mono ? "font-mono" : ""
                }`}
            />
        </label>
    );
}
