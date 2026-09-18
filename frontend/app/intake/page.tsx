"use client";

import { FormEvent, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronDown,
    CircleAlert,
    Copy,
    Fingerprint,
    Network,
    Search,
    Shield,
    Sparkles,
    Wallet,
    Zap,
} from "lucide-react";

const networks = [
    {
        name: "Ethereum",
        symbol: "ETH",
        status: "LIVE",
    },
    {
        name: "Bitcoin",
        symbol: "BTC",
        status: "SOON",
    },
    {
        name: "Polygon",
        symbol: "MATIC",
        status: "SOON",
    },
];

const depths = [
    {
        value: 1,
        title: "1 HOP",
        detail: "Direct counterparties",
    },
    {
        value: 2,
        title: "2 HOPS",
        detail: "Extended relationships",
    },
    {
        value: 3,
        title: "3 HOPS",
        detail: "Deep transaction trail",
    },
    {
        value: 4,
        title: "4+ HOPS",
        detail: "Maximum investigation depth",
    },
];

export default function IntakePage() {
    const [wallet, setWallet] = useState("");
    const [caseId, setCaseId] = useState("CG-002");
    const [network, setNetwork] = useState("Ethereum");
    const [depth, setDepth] = useState(2);
    const [mode, setMode] = useState("BEHAVIOURAL");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    function isValidWallet(value: string) {
        return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!wallet.trim()) {
            setError("Enter a wallet address to begin the investigation.");
            return;
        }

        if (!isValidWallet(wallet)) {
            setError(
                "Enter a valid Ethereum wallet address containing 42 characters.",
            );
            return;
        }

        setError("");

        /*
         * The investigation page currently uses its own demo dataset.
         * Once the backend is connected, this is where the submitted
         * case configuration will be passed into the analysis engine.
         */
        const params = new URLSearchParams({
            case: caseId,
            wallet: wallet.trim(),
            network,
            depth: String(depth),
            mode,
        });

        window.location.href = `/investigation?${params.toString()}`;
    }

    async function copyExample() {
        const example = "0x71A2B3C4D5E6F78901234567890123456789A8F2";

        try {
            await navigator.clipboard.writeText(example);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1800);
        } catch {
            setWallet(example);
        }
    }

    return (
        <main className="min-h-screen bg-[#EFE9E1] text-[#322D29]">
            {/* ============================================================
                NAVIGATION
            ============================================================ */}

            <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-[1480px] -translate-x-1/2">
                <div className="flex h-[70px] items-center justify-between rounded-[20px] border border-[#EFE9E1]/10 bg-[#292522]/95 px-5 text-[#EFE9E1] shadow-[0_16px_50px_rgba(30,25,22,0.24)] backdrop-blur-xl lg:px-7">
                    <a
                        href="/"
                        className="group flex items-center gap-3"
                    >
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-[11px] border border-[#EFE9E1]/20 bg-[#322D29] transition-all duration-300 group-hover:border-[#72383D] group-hover:bg-[#72383D]">
                            <span className="font-mono text-[10px] font-bold tracking-[-0.05em]">
                                CG
                            </span>

                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#72383D]" />
                        </div>

                        <div className="hidden leading-none sm:block">
                            <p className="text-[12px] font-bold tracking-[0.14em]">
                                CRYPTOGRAPH
                            </p>

                            <p className="mt-1 font-mono text-[7px] tracking-[0.22em] text-[#EFE9E1]/35">
                                FINANCIAL INVESTIGATION
                            </p>
                        </div>
                    </a>

                    <nav className="hidden items-center gap-1 rounded-full border border-[#EFE9E1]/10 bg-[#1F1C1A]/75 p-1 md:flex">
                        <a
                            href="/"
                            className="rounded-full px-5 py-3 text-[9px] font-bold tracking-[0.12em] text-[#EFE9E1]/45 transition hover:bg-[#EFE9E1]/10 hover:text-[#EFE9E1]"
                        >
                            HOME
                        </a>

                        <a
                            href="/intake"
                            className="rounded-full bg-[#EFE9E1] px-5 py-3 text-[9px] font-bold tracking-[0.12em] text-[#72383D] shadow-sm"
                        >
                            INVESTIGATE
                        </a>

                        <a
                            href="/#method"
                            className="rounded-full px-5 py-3 text-[9px] font-bold tracking-[0.12em] text-[#EFE9E1]/45 transition hover:bg-[#EFE9E1]/10 hover:text-[#EFE9E1]"
                        >
                            THE TRAIL
                        </a>

                        <a
                            href="/#evidence"
                            className="rounded-full px-5 py-3 text-[9px] font-bold tracking-[0.12em] text-[#EFE9E1]/45 transition hover:bg-[#EFE9E1]/10 hover:text-[#EFE9E1]"
                        >
                            EVIDENCE
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-full border border-[#EFE9E1]/10 px-4 py-2.5 sm:flex">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-[#72383D]/40" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#72383D]" />
                            </span>

                            <span className="font-mono text-[8px] tracking-[0.14em] text-[#EFE9E1]/55">
                                ETH / LIVE
                            </span>
                        </div>

                        <a
                            href="/"
                            className="flex h-10 items-center gap-2 rounded-[11px] bg-[#EFE9E1] px-4 text-[8px] font-bold tracking-[0.12em] text-[#322D29] transition hover:bg-[#72383D] hover:text-[#EFE9E1]"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            HOME
                        </a>
                    </div>
                </div>
            </header>

            {/* ============================================================
                PAGE HEADER
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 pt-32">
                <div className="mx-auto max-w-[1600px] px-6 pb-12 lg:px-10">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <a
                                    href="/"
                                    className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-[#322D29]/35 transition hover:text-[#72383D]"
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                    BACK TO OVERVIEW
                                </a>

                                <span className="h-px w-8 bg-[#72383D]" />
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#72383D]">
                                    01 / CASE INTAKE
                                </p>

                                <span className="rounded-full border border-[#322D29]/10 bg-[#D9D9D9]/40 px-3 py-1.5 font-mono text-[7px] font-bold tracking-[0.12em] text-[#322D29]/40">
                                    PRE-ANALYSIS
                                </span>
                            </div>

                            <h1 className="mt-5 max-w-4xl text-5xl font-medium tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Start an
                                <span className="text-[#72383D]">
                                    {" "}
                                    investigation.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#322D29]/45">
                                Define the subject, network and investigation
                                depth before entering the transaction
                                workspace.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 border border-[#322D29]/10 bg-[#D9D9D9]/30 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center border border-[#72383D]/20 bg-[#72383D]/5">
                                <Shield className="h-4 w-4 text-[#72383D]" />
                            </div>

                            <div>
                                <p className="font-mono text-[7px] font-bold tracking-[0.14em] text-[#322D29]/35">
                                    ANALYSIS ENVIRONMENT
                                </p>

                                <p className="mt-1 text-[9px] font-bold tracking-[0.08em]">
                                    BLOCKCHAIN INTELLIGENCE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                INTAKE WORKSPACE
            ============================================================ */}

            <section className="mx-auto max-w-[1600px] px-6 py-12 lg:px-10 lg:py-16">
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6 lg:grid-cols-[1fr_390px]"
                >
                    {/* ========================================================
                        MAIN FORM
                    ======================================================== */}

                    <div className="space-y-6">
                        {/* CASE DETAILS */}

                        <section className="border border-[#322D29]/15 bg-[#D9D9D9]/30">
                            <div className="flex items-center justify-between border-b border-[#322D29]/10 px-6 py-5">
                                <div>
                                    <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                                        CASE DETAILS
                                    </p>

                                    <p className="mt-1 text-[9px] text-[#322D29]/35">
                                        Identify the investigation.
                                    </p>
                                </div>

                                <Fingerprint className="h-4 w-4 text-[#72383D]" />
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-[1fr_220px]">
                                <div>
                                    <label className="font-mono text-[8px] font-bold tracking-[0.14em] text-[#322D29]/45">
                                        CASE ID
                                    </label>

                                    <div className="mt-3 flex items-center border-b border-[#322D29]/20 pb-3 focus-within:border-[#72383D]">
                                        <span className="mr-2 font-mono text-[10px] text-[#322D29]/30">
                                            CASE /
                                        </span>

                                        <input
                                            value={caseId}
                                            onChange={(event) =>
                                                setCaseId(
                                                    event.target.value
                                                        .toUpperCase()
                                                        .replace(
                                                            /[^A-Z0-9-]/g,
                                                            "",
                                                        ),
                                                )
                                            }
                                            className="w-full bg-transparent font-mono text-[11px] font-bold tracking-[0.08em] outline-none"
                                            placeholder="CG-002"
                                        />
                                    </div>
                                </div>

                                <div className="border border-[#322D29]/10 bg-[#EFE9E1]/45 p-4">
                                    <p className="font-mono text-[6px] font-bold tracking-[0.14em] text-[#322D29]/30">
                                        SESSION TYPE
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#72383D]" />

                                        <span className="font-mono text-[9px] font-bold tracking-[0.08em]">
                                            NEW CASE
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SUBJECT */}

                        <section className="border border-[#322D29]/15 bg-[#D9D9D9]/30">
                            <div className="border-b border-[#322D29]/10 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                                            CASE SUBJECT
                                        </p>

                                        <p className="mt-1 text-[9px] text-[#322D29]/35">
                                            Enter the blockchain address to
                                            investigate.
                                        </p>
                                    </div>

                                    <Wallet className="h-4 w-4 text-[#72383D]" />
                                </div>
                            </div>

                            <div className="p-6">
                                <label className="font-mono text-[8px] font-bold tracking-[0.14em] text-[#322D29]/45">
                                    SUSPECT WALLET ADDRESS
                                </label>

                                <div
                                    className={`mt-3 flex items-center border bg-[#EFE9E1]/55 px-4 py-4 transition ${error
                                            ? "border-[#72383D]"
                                            : "border-[#322D29]/10 focus-within:border-[#72383D]"
                                        }`}
                                >
                                    <Search className="mr-3 h-4 w-4 shrink-0 text-[#322D29]/30" />

                                    <input
                                        value={wallet}
                                        onChange={(event) => {
                                            setWallet(event.target.value);
                                            setError("");
                                        }}
                                        placeholder="0x..."
                                        spellCheck={false}
                                        autoComplete="off"
                                        className="w-full bg-transparent font-mono text-[12px] tracking-[0.03em] outline-none placeholder:text-[#322D29]/20"
                                    />

                                    {wallet && isValidWallet(wallet) && (
                                        <Check className="h-4 w-4 shrink-0 text-[#72383D]" />
                                    )}
                                </div>

                                {error ? (
                                    <div className="mt-3 flex items-start gap-2 text-[#72383D]">
                                        <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                                        <p className="font-mono text-[8px] leading-5">
                                            {error}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                        <p className="font-mono text-[7px] leading-5 tracking-[0.05em] text-[#322D29]/30">
                                            ETHEREUM ADDRESS / 42 CHARACTERS /
                                            0x PREFIX
                                        </p>

                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const example =
                                                    "0x71A2B3C4D5E6F78901234567890123456789A8F2";

                                                try {
                                                    await navigator.clipboard.writeText(
                                                        example,
                                                    );

                                                    setWallet(example);
                                                    setCopied(true);

                                                    window.setTimeout(() => {
                                                        setCopied(false);
                                                    }, 1800);
                                                } catch {
                                                    setWallet(example);
                                                }
                                            }}
                                            className="flex items-center gap-2 self-start font-mono text-[7px] font-bold tracking-[0.1em] text-[#72383D] transition hover:text-[#322D29]"
                                        >
                                            <Copy className="h-3 w-3" />

                                            {copied
                                                ? "COPIED EXAMPLE"
                                                : "USE EXAMPLE"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* NETWORK */}

                        <section className="border border-[#322D29]/15 bg-[#D9D9D9]/30">
                            <div className="border-b border-[#322D29]/10 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                                            NETWORK
                                        </p>

                                        <p className="mt-1 text-[9px] text-[#322D29]/35">
                                            Select the blockchain network.
                                        </p>
                                    </div>

                                    <Network className="h-4 w-4 text-[#72383D]" />
                                </div>
                            </div>

                            <div className="grid gap-3 p-6 md:grid-cols-3">
                                {networks.map((item) => {
                                    const active =
                                        network === item.name;
                                    const disabled =
                                        item.status !== "LIVE";

                                    return (
                                        <button
                                            key={item.name}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() =>
                                                setNetwork(item.name)
                                            }
                                            className={`relative border p-5 text-left transition-all ${active
                                                    ? "border-[#72383D] bg-[#72383D]/5 shadow-[0_8px_25px_rgba(114,56,61,0.08)]"
                                                    : disabled
                                                        ? "cursor-not-allowed border-[#322D29]/10 bg-[#EFE9E1]/25 opacity-45"
                                                        : "border-[#322D29]/10 bg-[#EFE9E1]/40 hover:border-[#72383D]/30 hover:bg-[#EFE9E1]/70"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-mono text-[12px] font-bold">
                                                        {item.symbol}
                                                    </p>

                                                    <p className="mt-2 text-[9px] font-bold tracking-[0.08em]">
                                                        {item.name}
                                                    </p>
                                                </div>

                                                {active && (
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#72383D] text-[#EFE9E1]">
                                                        <Check className="h-3 w-3" />
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-7 flex items-center gap-2">
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${item.status ===
                                                            "LIVE"
                                                            ? "bg-[#72383D]"
                                                            : "bg-[#AC9C8D]"
                                                        }`}
                                                />

                                                <span className="font-mono text-[6px] font-bold tracking-[0.12em] text-[#322D29]/35">
                                                    {item.status}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* DEPTH */}

                        <section className="border border-[#322D29]/15 bg-[#D9D9D9]/30">
                            <div className="border-b border-[#322D29]/10 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                                            INVESTIGATION DEPTH
                                        </p>

                                        <p className="mt-1 text-[9px] text-[#322D29]/35">
                                            Define how far relationships should
                                            be followed.
                                        </p>
                                    </div>

                                    <Zap className="h-4 w-4 text-[#72383D]" />
                                </div>
                            </div>

                            <div className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-4">
                                {depths.map((item) => {
                                    const active = depth === item.value;

                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() =>
                                                setDepth(item.value)
                                            }
                                            className={`border p-4 text-left transition-all ${active
                                                    ? "border-[#72383D] bg-[#72383D]/5"
                                                    : "border-[#322D29]/10 bg-[#EFE9E1]/40 hover:border-[#72383D]/25"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`font-mono text-[9px] font-bold tracking-[0.12em] ${active
                                                            ? "text-[#72383D]"
                                                            : ""
                                                        }`}
                                                >
                                                    {item.title}
                                                </span>

                                                {active && (
                                                    <Check className="h-3.5 w-3.5 text-[#72383D]" />
                                                )}
                                            </div>

                                            <p className="mt-3 text-[8px] leading-4 text-[#322D29]/40">
                                                {item.detail}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ANALYSIS MODE */}

                        <section className="border border-[#322D29]/15 bg-[#D9D9D9]/30">
                            <div className="border-b border-[#322D29]/10 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                                            ANALYSIS MODE
                                        </p>

                                        <p className="mt-1 text-[9px] text-[#322D29]/35">
                                            Choose the primary investigation
                                            lens.
                                        </p>
                                    </div>

                                    <Sparkles className="h-4 w-4 text-[#72383D]" />
                                </div>
                            </div>

                            <div className="grid gap-3 p-6 md:grid-cols-3">
                                {[
                                    {
                                        title: "BEHAVIOURAL",
                                        detail: "Identify unusual movement patterns.",
                                    },
                                    {
                                        title: "TRANSACTION",
                                        detail: "Follow transfers and counterparties.",
                                    },
                                    {
                                        title: "FULL ANALYSIS",
                                        detail: "Combine transaction and behavioural signals.",
                                    },
                                ].map((item) => {
                                    const active =
                                        mode === item.title;

                                    return (
                                        <button
                                            key={item.title}
                                            type="button"
                                            onClick={() =>
                                                setMode(item.title)
                                            }
                                            className={`border p-5 text-left transition-all ${active
                                                    ? "border-[#72383D] bg-[#72383D]/5"
                                                    : "border-[#322D29]/10 bg-[#EFE9E1]/40 hover:border-[#72383D]/25"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p
                                                    className={`text-[9px] font-bold tracking-[0.1em] ${active
                                                            ? "text-[#72383D]"
                                                            : ""
                                                        }`}
                                                >
                                                    {item.title}
                                                </p>

                                                {active && (
                                                    <Check className="h-3.5 w-3.5 shrink-0 text-[#72383D]" />
                                                )}
                                            </div>

                                            <p className="mt-3 text-[8px] leading-5 text-[#322D29]/40">
                                                {item.detail}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* ========================================================
                        SUMMARY SIDEBAR
                    ======================================================== */}

                    <aside className="lg:sticky lg:top-28 lg:self-start">
                        <div className="border border-[#322D29]/15 bg-[#322D29] text-[#EFE9E1] shadow-[0_20px_60px_rgba(50,45,41,0.15)]">
                            <div className="border-b border-[#EFE9E1]/10 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                                            INVESTIGATION READY
                                        </p>

                                        <p className="mt-1 font-mono text-[7px] tracking-[0.12em] text-[#EFE9E1]/30">
                                            CONFIGURATION SUMMARY
                                        </p>
                                    </div>

                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#72383D]/40" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#72383D]" />
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-0">
                                <SummaryRow
                                    label="CASE"
                                    value={
                                        caseId || "UNASSIGNED"
                                    }
                                />

                                <SummaryRow
                                    label="NETWORK"
                                    value={network.toUpperCase()}
                                />

                                <SummaryRow
                                    label="DEPTH"
                                    value={`${depth}${depth === 1 ? " HOP" : " HOPS"}`}
                                />

                                <SummaryRow
                                    label="MODE"
                                    value={mode}
                                />
                            </div>

                            <div className="border-t border-[#EFE9E1]/10 p-6">
                                <p className="font-mono text-[7px] font-bold tracking-[0.14em] text-[#EFE9E1]/30">
                                    SUBJECT
                                </p>

                                <p className="mt-3 break-all font-mono text-[11px] leading-6 text-[#EFE9E1]/70">
                                    {wallet || "AWAITING ADDRESS"}
                                </p>
                            </div>

                            <div className="border-t border-[#EFE9E1]/10 p-6">
                                <button
                                    type="submit"
                                    className="group flex w-full items-center justify-between bg-[#72383D] px-5 py-4 text-left text-[9px] font-bold tracking-[0.14em] text-[#EFE9E1] shadow-[0_10px_30px_rgba(114,56,61,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EFE9E1] hover:text-[#72383D]"
                                >
                                    <span>
                                        START ANALYSIS
                                    </span>

                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </button>

                                <p className="mt-4 text-center font-mono text-[6px] leading-4 tracking-[0.08em] text-[#EFE9E1]/25">
                                    YOU WILL ENTER THE INVESTIGATION
                                    WORKSPACE AFTER ANALYSIS INITIALIZES
                                </p>
                            </div>
                        </div>

                        {/* WORKFLOW */}

                        <div className="mt-5 border border-[#322D29]/15 bg-[#D9D9D9]/30">
                            <div className="border-b border-[#322D29]/10 px-5 py-4">
                                <p className="font-mono text-[8px] font-bold tracking-[0.14em]">
                                    CASE WORKFLOW
                                </p>
                            </div>

                            <div className="space-y-0 p-5">
                                <WorkflowStep
                                    number="01"
                                    title="CASE INTAKE"
                                    active
                                />

                                <WorkflowLine />

                                <WorkflowStep
                                    number="02"
                                    title="TRANSACTION GRAPH"
                                />

                                <WorkflowLine />

                                <WorkflowStep
                                    number="03"
                                    title="FINDINGS"
                                />

                                <WorkflowLine />

                                <WorkflowStep
                                    number="04"
                                    title="EVIDENCE"
                                />

                                <WorkflowLine />

                                <WorkflowStep
                                    number="05"
                                    title="CASE REPORT"
                                />
                            </div>
                        </div>
                    </aside>
                </form>
            </section>

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <footer className="border-t border-[#EFE9E1]/10 bg-[#292522] text-[#EFE9E1]">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-6 py-9 text-[8px] font-semibold tracking-[0.17em] text-[#EFE9E1]/35 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                    <span>
                        CRYPTOGRAPH / CASE INTAKE
                    </span>

                    <span>
                        ETHEREUM / PRE-ANALYSIS
                    </span>

                    <span>
                        OBSERVE · TRACE · DOCUMENT
                    </span>
                </div>
            </footer>
        </main>
    );
}

/* ================================================================
   SUMMARY ROW
================================================================ */

function SummaryRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between border-b border-[#EFE9E1]/10 px-6 py-4">
            <span className="font-mono text-[7px] font-bold tracking-[0.13em] text-[#EFE9E1]/30">
                {label}
            </span>

            <span className="font-mono text-[8px] font-bold tracking-[0.08em] text-[#EFE9E1]/70">
                {value}
            </span>
        </div>
    );
}

/* ================================================================
   WORKFLOW STEP
================================================================ */

function WorkflowStep({
    number,
    title,
    active = false,
}: {
    number: string;
    title: string;
    active?: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[7px] font-bold ${active
                        ? "border-[#72383D] bg-[#72383D] text-[#EFE9E1]"
                        : "border-[#322D29]/15 text-[#322D29]/30"
                    }`}
            >
                {number}
            </span>

            <span
                className={`text-[8px] font-bold tracking-[0.1em] ${active
                        ? "text-[#72383D]"
                        : "text-[#322D29]/35"
                    }`}
            >
                {title}
            </span>

            {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#72383D]" />
            )}
        </div>
    );
}

/* ================================================================
   WORKFLOW LINE
================================================================ */

function WorkflowLine() {
    return (
        <div className="ml-3.5 h-5 border-l border-dashed border-[#322D29]/15" />
    );
}