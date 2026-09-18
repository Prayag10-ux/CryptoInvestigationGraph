"use client";
import SiteHeader from "../components/SiteHeader";
import { useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronDown,
    CircleAlert,
    Clipboard,
    Download,
    ExternalLink,
    FileCheck2,
    FileText,
    GitBranch,
    Hash,
    ShieldCheck,
    Wallet,
    X,
    Zap,
} from "lucide-react";

/* ================================================================
   TYPES
================================================================ */

type EvidenceItem = {
    id: string;
    number: string;
    type: "TRANSACTION" | "RELATIONSHIP" | "BEHAVIOUR";
    title: string;
    timestamp: string;
    from: string;
    to: string;
    amount: string;
    block: string;
    hash: string;
    relevance: string;
    status: "VERIFIED" | "REVIEW";
};

/* ================================================================
   CASE DATA
================================================================ */

const evidenceItems: EvidenceItem[] = [
    {
        id: "TX-001",
        number: "01",
        type: "TRANSACTION",
        title: "OUTBOUND TRANSFER",
        timestamp: "09:14:21 UTC",
        from: "0x71...8F2",
        to: "0x29...A91",
        amount: "4.82 ETH",
        block: "19,842,113",
        hash: "0x8f21...91ac",
        relevance:
            "Initial movement originating from the primary subject address.",
        status: "VERIFIED",
    },
    {
        id: "TX-002",
        number: "02",
        type: "TRANSACTION",
        title: "FORWARD TRANSFER",
        timestamp: "09:25:46 UTC",
        from: "0x29...A91",
        to: "0xC12...8D4",
        amount: "4.80 ETH",
        block: "19,842,167",
        hash: "0x31ac...7e20",
        relevance:
            "Funds moved onward approximately 11 minutes after the initial transfer.",
        status: "VERIFIED",
    },
    {
        id: "TX-003",
        number: "03",
        type: "TRANSACTION",
        title: "FORWARD MOVEMENT",
        timestamp: "09:41:02 UTC",
        from: "0xC12...8D4",
        to: "0x91...77A",
        amount: "4.75 ETH",
        block: "19,842,254",
        hash: "0xa712...42ef",
        relevance:
            "Continued movement through an intermediary address within the trace.",
        status: "VERIFIED",
    },
    {
        id: "TX-004",
        number: "04",
        type: "TRANSACTION",
        title: "EXCHANGE INTERACTION",
        timestamp: "10:03:18 UTC",
        from: "0x91...77A",
        to: "0xA1...D84",
        amount: "4.71 ETH",
        block: "19,842,391",
        hash: "0x4d90...b721",
        relevance:
            "Observed movement terminating at an identified exchange address.",
        status: "VERIFIED",
    },
];

/* ================================================================
   PAGE
================================================================ */

export default function EvidencePage() {
    const [selectedEvidence, setSelectedEvidence] =
        useState<EvidenceItem | null>(null);

    const [copied, setCopied] = useState<string | null>(null);

    const [packageGenerated, setPackageGenerated] =
        useState(false);

    const [activeSection, setActiveSection] =
        useState("ALL");

    const filteredEvidence = useMemo(() => {
        if (activeSection === "ALL") return evidenceItems;

        return evidenceItems.filter(
            (item) => item.type === activeSection,
        );
    }, [activeSection]);

    function copyValue(value: string) {
        navigator.clipboard?.writeText(value);

        setCopied(value);

        window.setTimeout(() => {
            setCopied(null);
        }, 1600);
    }

    function generatePackage() {
        setPackageGenerated(true);

        window.setTimeout(() => {
            setPackageGenerated(false);
        }, 3000);
    }

    return (
        <main className="min-h-screen bg-[#EFE9E1] text-[#322D29]">
            {/* ============================================================
                NAVIGATION
            ============================================================ */}

            <SiteHeader activePage="evidence" />

            {/* ============================================================
                CASE HEADER
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 pt-32">
                <div className="mx-auto max-w-[1600px] px-6 pb-12 lg:px-10">
                    <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <a
                                    href="/investigation"
                                    className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[#322D29]/35 transition hover:text-[#72383D]"
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                    BACK TO INVESTIGATION
                                </a>

                                <span className="h-px w-8 bg-[#72383D]" />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <p className="font-mono text-[12px] font-bold tracking-[0.15em] text-[#72383D]">
                                    CASE / CG-001
                                </p>

                                <span className="rounded-full border border-[#72383D]/25 bg-[#72383D]/5 px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] text-[#72383D]">
                                    EVIDENCE ACTIVE
                                </span>
                            </div>

                            <h1 className="mt-4 max-w-3xl text-5xl font-medium tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Evidence
                                <span className="text-[#72383D]">
                                    {" "}
                                    workspace.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-7 text-[#322D29]/45">
                                Convert observed blockchain activity into
                                structured, traceable evidence for the
                                investigation record.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4 lg:pb-1">
                            <CaseStat
                                label="NETWORK"
                                value="ETHEREUM"
                            />

                            <CaseStat
                                label="EVIDENCE"
                                value="08 ITEMS"
                            />

                            <CaseStat
                                label="TRANSACTIONS"
                                value="04"
                            />

                            <CaseStat
                                label="STATUS"
                                value="ACTIVE"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                CASE SUMMARY
            ============================================================ */}

            <section className="mx-auto max-w-[1600px] px-6 py-8 lg:px-10">
                <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                    <div className="border border-[#322D29]/15 bg-[#D9D9D9]/35">
                        <div className="flex items-center justify-between border-b border-[#322D29]/10 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <FileCheck2 className="h-4 w-4 text-[#72383D]" />

                                <p className="font-mono text-[11px] font-bold tracking-[0.15em]">
                                    CASE SUMMARY
                                </p>
                            </div>

                            <span className="font-mono text-[9px] tracking-[0.12em] text-[#322D29]/30">
                                CG-001
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2">
                            <SummaryCell
                                label="SUBJECT ADDRESS"
                                value="0x71...8F2"
                                copyable
                                onCopy={() =>
                                    copyValue("0x71...8F2")
                                }
                                copied={
                                    copied === "0x71...8F2"
                                }
                            />

                            <SummaryCell
                                label="INVESTIGATION PERIOD"
                                value="09:14 — 10:03 UTC"
                            />

                            <SummaryCell
                                label="NETWORK"
                                value="ETHEREUM MAINNET"
                            />

                            <SummaryCell
                                label="OBSERVED VOLUME"
                                value="42.81 ETH"
                            />
                        </div>
                    </div>

                    <div className="border border-[#72383D]/20 bg-[#72383D]/[0.035]">
                        <div className="border-b border-[#72383D]/10 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-4 w-4 text-[#72383D]" />

                                <p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#72383D]">
                                    EVIDENCE INTEGRITY
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="font-mono text-3xl font-medium tracking-[-0.05em]">
                                        100%
                                    </p>

                                    <p className="mt-2 text-[11px] text-[#322D29]/40">
                                        OBSERVED ITEMS VERIFIED
                                    </p>
                                </div>

                                <Check className="h-7 w-7 text-[#72383D]" />
                            </div>

                            <div className="mt-6 h-1.5 overflow-hidden bg-[#322D29]/10">
                                <div className="h-full w-full bg-[#72383D]" />
                            </div>

                            <p className="mt-4 font-mono text-[9px] leading-5 tracking-[0.08em] text-[#322D29]/35">
                                Evidence is linked to observable
                                transaction activity within the
                                current case.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                TRANSACTION PROVENANCE
            ============================================================ */}

            <section className="border-t border-[#322D29]/15">
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[11px] text-[#72383D]">
                                01 / TRANSACTION PROVENANCE
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Every movement leaves a record.
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-7 text-[#322D29]/45">
                                Individual transactions are preserved
                                as evidence with their timestamps,
                                counterparties, block references and
                                investigative relevance.
                            </p>

                            <div className="mt-8 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center border border-[#72383D]/20 bg-[#72383D]/5">
                                    <Hash className="h-4 w-4 text-[#72383D]" />
                                </div>

                                <div>
                                    <p className="text-[9px] font-bold tracking-[0.13em]">
                                        BLOCKCHAIN NATIVE
                                    </p>

                                    <p className="mt-1 font-mono text-[9px] text-[#322D29]/35">
                                        SOURCE DATA / ETHEREUM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                {[
                                    "ALL",
                                    "TRANSACTION",
                                    "RELATIONSHIP",
                                    "BEHAVIOUR",
                                ].map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() =>
                                            setActiveSection(
                                                filter,
                                            )
                                        }
                                        className={`px-3 py-2 font-mono text-[9px] font-bold tracking-[0.12em] transition ${activeSection ===
                                                filter
                                                ? "bg-[#322D29] text-[#EFE9E1]"
                                                : "border border-[#322D29]/10 text-[#322D29]/40 hover:border-[#72383D]/25 hover:text-[#72383D]"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-[#322D29]/15">
                                {filteredEvidence.map(
                                    (item) => (
                                        <EvidenceRow
                                            key={item.id}
                                            item={item}
                                            onOpen={() =>
                                                setSelectedEvidence(
                                                    item,
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                RELATIONSHIP PATH
            ============================================================ */}

            <section className="border-t border-[#EFE9E1]/10 bg-[#322D29] text-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[11px] text-[#AC9C8D]">
                                02 / RELATIONSHIP PATH
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Preserve the route.
                            </h2>

                            <p className="mt-7 max-w-md text-sm leading-7 text-[#EFE9E1]/40">
                                The evidentiary path records how funds
                                moved between addresses and where the
                                observed trail ultimately led.
                            </p>
                        </div>

                        <div className="border-t border-[#EFE9E1]/15">
                            <RelationshipStep
                                number="01"
                                label="SUBJECT"
                                address="0x71...8F2"
                                detail="PRIMARY ADDRESS"
                                first
                            />

                            <RelationshipStep
                                number="02"
                                label="INTERMEDIARY"
                                address="0x29...A91"
                                detail="DIRECT COUNTERPARTY"
                            />

                            <RelationshipStep
                                number="03"
                                label="FLAGGED ADDRESS"
                                address="0xC12...8D4"
                                detail="SUSPICIOUS RELATIONSHIP"
                                flagged
                            />

                            <RelationshipStep
                                number="04"
                                label="EXCHANGE"
                                address="0xA1...D84"
                                detail="EXCHANGE INTERACTION"
                                last
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                BEHAVIOURAL EVIDENCE
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[11px] text-[#72383D]">
                                03 / BEHAVIOURAL EVIDENCE
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Patterns become evidence.
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-7 text-[#322D29]/45">
                                Observed behaviours are documented
                                separately from individual transactions
                                so investigators can connect activity
                                with broader patterns.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <BehaviourCard
                                icon={<CircleAlert />}
                                number="01"
                                title="COUNTERPARTY DIVERSITY"
                                value="17"
                                description="Unique inbound wallets observed across the analyzed period."
                            />

                            <BehaviourCard
                                icon={<Wallet />}
                                number="02"
                                title="INBOUND CONCENTRATION"
                                value="61.4%"
                                description="Largest observed counterparty share of inbound volume."
                            />

                            <BehaviourCard
                                icon={<GitBranch />}
                                number="03"
                                title="FORWARD MOVEMENT"
                                value="DETECTED"
                                description="Funds continue through multiple addresses within short intervals."
                            />

                            <BehaviourCard
                                icon={<Zap />}
                                number="04"
                                title="TRACE INTERVAL"
                                value="11 MIN"
                                description="Observed interval between the first and second transfer."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                EVIDENCE NOTES
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 bg-[#D9D9D9]/35">
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[11px] text-[#72383D]">
                                04 / CASE NOTES
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Context for the record.
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-7 text-[#322D29]/45">
                                Supporting notes provide investigators
                                with a concise explanation of why the
                                collected evidence matters.
                            </p>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#EFE9E1]/60">
                            <div className="flex items-center justify-between border-b border-[#322D29]/10 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-[#72383D]" />

                                    <p className="font-mono text-[11px] font-bold tracking-[0.15em]">
                                        INVESTIGATOR NOTE
                                    </p>
                                </div>

                                <span className="font-mono text-[9px] text-[#322D29]/30">
                                    NOTE / 001
                                </span>
                            </div>

                            <div className="p-6">
                                <p className="text-sm leading-7 text-[#322D29]/65">
                                    The analyzed transaction sequence
                                    shows movement from the primary
                                    subject address through intermediary
                                    addresses before interacting with an
                                    identified exchange address.
                                </p>

                                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                                    <NoteFact
                                        label="DIRECT TRANSFERS"
                                        value="04"
                                    />

                                    <NoteFact
                                        label="OBSERVED HOPS"
                                        value="02"
                                    />

                                    <NoteFact
                                        label="FINAL DESTINATION"
                                        value="EXCHANGE"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                EVIDENCE PACKAGE
            ============================================================ */}

            <section className="bg-[#EFE9E1]">
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="border border-[#72383D]/25 bg-[#72383D]/[0.035]">
                        <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center bg-[#72383D] text-[#EFE9E1]">
                                        <FileCheck2 className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="font-mono text-[9px] font-bold tracking-[0.15em] text-[#72383D]">
                                            05 / EVIDENCE PACKAGE
                                        </p>

                                        <p className="mt-1 font-mono text-[9px] tracking-[0.1em] text-[#322D29]/35">
                                            CASE / CG-001
                                        </p>
                                    </div>
                                </div>

                                <h2 className="mt-7 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">
                                    Ready to document the case.
                                </h2>

                                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#322D29]/45">
                                    Package the currently collected
                                    transaction provenance, relationship
                                    path and behavioural indicators into
                                    the case record.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                <button
                                    type="button"
                                    onClick={generatePackage}
                                    className="group flex min-w-[190px] items-center justify-center gap-3 bg-[#72383D] px-6 py-4 text-[9px] font-bold tracking-[0.14em] text-[#EFE9E1] shadow-[0_10px_25px_rgba(114,56,61,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#322D29]"
                                >
                                    {packageGenerated ? (
                                        <>
                                            <Check className="h-3.5 w-3.5" />
                                            PACKAGE READY
                                        </>
                                    ) : (
                                        <>
                                            GENERATE PACKAGE
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="flex min-w-[190px] items-center justify-center gap-3 border border-[#322D29]/15 bg-[#EFE9E1] px-6 py-4 text-[9px] font-bold tracking-[0.14em] text-[#322D29]/55 transition hover:border-[#72383D]/25 hover:text-[#72383D]"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    EXPORT EVIDENCE
                                </button>
                            </div>
                        </div>

                        <div className="grid border-t border-[#72383D]/10 sm:grid-cols-3">
                            <PackageItem
                                icon={<FileText />}
                                label="TRANSACTIONS"
                                value="04 RECORDS"
                            />

                            <PackageItem
                                icon={<GitBranch />}
                                label="RELATIONSHIP"
                                value="01 PATH"
                            />

                            <PackageItem
                                icon={<CircleAlert />}
                                label="BEHAVIOUR"
                                value="04 INDICATORS"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <footer className="bg-[#292522] text-[#EFE9E1]">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-6 py-9 text-[9px] font-semibold tracking-[0.17em] text-[#EFE9E1]/35 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                    <span>
                        CRYPTOGRAPH / EVIDENCE WORKSPACE
                    </span>

                    <span>
                        ETHEREUM / CASE CG-001
                    </span>

                    <span>
                        OBSERVE · TRACE · DOCUMENT
                    </span>
                </div>
            </footer>

            {/* ============================================================
                EVIDENCE DETAIL MODAL
            ============================================================ */}

            {selectedEvidence && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#322D29]/45 p-5 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-[720px] overflow-auto border border-[#322D29]/15 bg-[#EFE9E1] shadow-[0_30px_100px_rgba(30,25,22,0.30)]">
                        <div className="flex items-center justify-between border-b border-[#322D29]/10 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[9px] font-bold text-[#72383D]">
                                    EVIDENCE /{" "}
                                    {selectedEvidence.id}
                                </span>

                                <span className="rounded-full border border-[#72383D]/20 bg-[#72383D]/5 px-2 py-1 font-mono text-[9px] font-bold tracking-[0.1em] text-[#72383D]">
                                    {
                                        selectedEvidence.status
                                    }
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedEvidence(null)
                                }
                                className="text-[#322D29]/30 transition hover:text-[#72383D]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start justify-between gap-5">
                                <div>
                                    <p className="font-mono text-[9px] tracking-[0.14em] text-[#322D29]/35">
                                        {
                                            selectedEvidence.timestamp
                                        }
                                    </p>

                                    <h3 className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                                        {
                                            selectedEvidence.title
                                        }
                                    </h3>
                                </div>

                                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#72383D]/20 bg-[#72383D]/5">
                                    <Hash className="h-4 w-4 text-[#72383D]" />
                                </span>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <DetailBox
                                    label="FROM"
                                    value={
                                        selectedEvidence.from
                                    }
                                    onCopy={() =>
                                        copyValue(
                                            selectedEvidence.from,
                                        )
                                    }
                                    copied={
                                        copied ===
                                        selectedEvidence.from
                                    }
                                />

                                <DetailBox
                                    label="TO"
                                    value={
                                        selectedEvidence.to
                                    }
                                    onCopy={() =>
                                        copyValue(
                                            selectedEvidence.to,
                                        )
                                    }
                                    copied={
                                        copied ===
                                        selectedEvidence.to
                                    }
                                />

                                <DetailBox
                                    label="AMOUNT"
                                    value={
                                        selectedEvidence.amount
                                    }
                                />

                                <DetailBox
                                    label="BLOCK"
                                    value={
                                        selectedEvidence.block
                                    }
                                />
                            </div>

                            <div className="mt-3 border border-[#322D29]/10 bg-[#D9D9D9]/25 p-4">
                                <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#322D29]/30">
                                    TRANSACTION HASH
                                </p>

                                <div className="mt-3 flex items-center justify-between gap-4">
                                    <p className="font-mono text-[12px]">
                                        {
                                            selectedEvidence.hash
                                        }
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyValue(
                                                selectedEvidence.hash,
                                            )
                                        }
                                        className="flex items-center gap-2 text-[9px] font-bold tracking-[0.1em] text-[#72383D]"
                                    >
                                        {copied ===
                                            selectedEvidence.hash ? (
                                            <Check className="h-3 w-3" />
                                        ) : (
                                            <Clipboard className="h-3 w-3" />
                                        )}

                                        {copied ===
                                            selectedEvidence.hash
                                            ? "COPIED"
                                            : "COPY"}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 border border-[#322D29]/10 p-5">
                                <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#322D29]/30">
                                    EVIDENCE RELEVANCE
                                </p>

                                <p className="mt-3 text-[11px] leading-6 text-[#322D29]/55">
                                    {
                                        selectedEvidence.relevance
                                    }
                                </p>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] text-[#322D29]/35">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#72383D]" />
                                    SOURCE VERIFIED
                                </span>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 border border-[#322D29]/10 px-4 py-3 text-[9px] font-bold tracking-[0.12em] text-[#322D29]/45 transition hover:border-[#72383D]/25 hover:text-[#72383D]"
                                >
                                    VIEW ON EXPLORER
                                    <ExternalLink className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                GLOBAL PAGE STYLES
            ============================================================ */}

            <style jsx global>{`
                ::selection {
                    background: #72383d;
                    color: #efe9e1;
                }

                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </main>
    );
}

/* ================================================================
   CASE STAT
================================================================ */

function CaseStat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="font-mono text-[9px] font-bold tracking-[0.15em] text-[#322D29]/30">
                {label}
            </p>

            <p className="mt-2 font-mono text-[12px] font-bold tracking-[0.05em]">
                {value}
            </p>
        </div>
    );
}

/* ================================================================
   SUMMARY CELL
================================================================ */

function SummaryCell({
    label,
    value,
    copyable = false,
    onCopy,
    copied = false,
}: {
    label: string;
    value: string;
    copyable?: boolean;
    onCopy?: () => void;
    copied?: boolean;
}) {
    return (
        <div className="border-b border-[#322D29]/10 p-6 last:border-b-0 md:[&:nth-child(odd)]:border-r">
            <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#322D29]/30">
                {label}
            </p>

            <div className="mt-3 flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] font-bold">
                    {value}
                </p>

                {copyable && (
                    <button
                        type="button"
                        onClick={onCopy}
                        className="text-[#322D29]/25 transition hover:text-[#72383D]"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-[#72383D]" />
                        ) : (
                            <Clipboard className="h-3.5 w-3.5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ================================================================
   EVIDENCE ROW
================================================================ */

function EvidenceRow({
    item,
    onOpen,
}: {
    item: EvidenceItem;
    onOpen: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="group grid w-full gap-5 border-b border-[#322D29]/10 py-7 text-left transition hover:bg-[#EFE9E1]/60 sm:grid-cols-[55px_150px_1fr_120px] sm:items-center"
        >
            <span className="font-mono text-[9px] text-[#72383D]">
                {item.number}
            </span>

            <div>
                <p className="text-[9px] font-bold tracking-[0.12em]">
                    {item.title}
                </p>

                <p className="mt-2 font-mono text-[9px] text-[#322D29]/30">
                    {item.timestamp}
                </p>
            </div>

            <div className="font-mono text-[9px] leading-6">
                <p className="text-[#322D29]/55">
                    {item.from}
                </p>

                <p className="text-[#72383D]">↓</p>

                <p className="text-[#322D29]/55">
                    {item.to}
                </p>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                    <p className="font-mono text-[12px] font-bold">
                        {item.amount}
                    </p>

                    <p className="mt-2 text-[9px] font-bold tracking-[0.12em] text-[#72383D]">
                        {item.status}
                    </p>
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-[#322D29]/20 transition group-hover:translate-x-1 group-hover:text-[#72383D]" />
            </div>
        </button>
    );
}

/* ================================================================
   RELATIONSHIP STEP
================================================================ */

function RelationshipStep({
    number,
    label,
    address,
    detail,
    flagged = false,
    first = false,
    last = false,
}: {
    number: string;
    label: string;
    address: string;
    detail: string;
    flagged?: boolean;
    first?: boolean;
    last?: boolean;
}) {
    return (
        <div className="relative flex gap-6 border-b border-[#EFE9E1]/10 py-7 last:border-b-0">
            <div className="relative flex w-8 shrink-0 justify-center">
                {!last && (
                    <span className="absolute left-1/2 top-8 h-[calc(100%+1px)] w-px -translate-x-1/2 bg-[#EFE9E1]/15" />
                )}

                <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border ${flagged
                            ? "border-[#72383D] bg-[#72383D]"
                            : first
                                ? "border-[#AC9C8D] bg-[#EFE9E1] text-[#322D29]"
                                : "border-[#EFE9E1]/20 bg-[#322D29]"
                        }`}
                >
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${flagged
                                ? "bg-[#EFE9E1]"
                                : first
                                    ? "bg-[#72383D]"
                                    : "bg-[#AC9C8D]"
                            }`}
                    />
                </span>
            </div>

            <div className="flex flex-1 items-center justify-between gap-5">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={`text-[11px] font-bold tracking-[0.14em] ${flagged
                                    ? "text-[#AC9C8D]"
                                    : "text-[#EFE9E1]/70"
                                }`}
                        >
                            {label}
                        </span>

                        <span className="font-mono text-[9px] text-[#EFE9E1]/25">
                            {number}
                        </span>
                    </div>

                    <p className="mt-2 font-mono text-[11px] text-[#EFE9E1]/65">
                        {address}
                    </p>

                    <p className="mt-1 text-[9px] tracking-[0.1em] text-[#EFE9E1]/25">
                        {detail}
                    </p>
                </div>

                {!last && (
                    <ArrowRight className="hidden h-4 w-4 text-[#EFE9E1]/15 sm:block" />
                )}
            </div>
        </div>
    );
}

/* ================================================================
   BEHAVIOUR CARD
================================================================ */

function BehaviourCard({
    icon,
    number,
    title,
    value,
    description,
}: {
    icon: React.ReactNode;
    number: string;
    title: string;
    value: string;
    description: string;
}) {
    return (
        <div className="border border-[#322D29]/15 bg-[#D9D9D9]/25 p-6 transition-all duration-300 hover:border-[#72383D]/25 hover:bg-[#EFE9E1]">
            <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center border border-[#72383D]/15 bg-[#72383D]/5 text-[#72383D]">
                    <span className="h-4 w-4">
                        {icon}
                    </span>
                </span>

                <span className="font-mono text-[9px] text-[#72383D]">
                    {number}
                </span>
            </div>

            <div className="mt-7 flex items-end justify-between gap-4">
                <p className="max-w-[170px] text-[11px] font-bold leading-4 tracking-[0.12em]">
                    {title}
                </p>

                <p className="font-mono text-lg font-bold text-[#72383D]">
                    {value}
                </p>
            </div>

            <p className="mt-4 text-[11px] leading-5 text-[#322D29]/40">
                {description}
            </p>
        </div>
    );
}

/* ================================================================
   NOTE FACT
================================================================ */

function NoteFact({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="border border-[#322D29]/10 bg-[#EFE9E1]/60 p-4">
            <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#322D29]/30">
                {label}
            </p>

            <p className="mt-2 font-mono text-[12px] font-bold">
                {value}
            </p>
        </div>
    );
}

/* ================================================================
   PACKAGE ITEM
================================================================ */

function PackageItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-4 border-b border-[#72383D]/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <span className="text-[#72383D]">
                <span className="block h-4 w-4">
                    {icon}
                </span>
            </span>

            <div>
                <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#322D29]/30">
                    {label}
                </p>

                <p className="mt-1 font-mono text-[9px] font-bold">
                    {value}
                </p>
            </div>
        </div>
    );
}

/* ================================================================
   DETAIL BOX
================================================================ */

function DetailBox({
    label,
    value,
    onCopy,
    copied = false,
}: {
    label: string;
    value: string;
    onCopy?: () => void;
    copied?: boolean;
}) {
    return (
        <div className="border border-[#322D29]/10 bg-[#D9D9D9]/25 p-4">
            <p className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#322D29]/30">
                {label}
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[11px]">
                    {value}
                </p>

                {onCopy && (
                    <button
                        type="button"
                        onClick={onCopy}
                        className="shrink-0 text-[#322D29]/25 transition hover:text-[#72383D]"
                    >
                        {copied ? (
                            <Check className="h-3 w-3 text-[#72383D]" />
                        ) : (
                            <Clipboard className="h-3 w-3" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}