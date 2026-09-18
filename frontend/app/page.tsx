"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  FileText,
  GitBranch,
  ShieldAlert,
  Wallet,
  X,
} from "lucide-react";

type NodeData = {
  id: string;
  address: string;
  label?: string;
  suspicious?: boolean;
  size?: "small" | "medium" | "large";
  position: string;
  relationship: string;
  transactions: string;
};

const graphNodes: NodeData[] = [
  {
    id: "subject",
    address: "0x71...8F2",
    label: "SUBJECT",
    size: "large",
    position: "left-[46%] top-[47%]",
    relationship: "PRIMARY ADDRESS",
    transactions: "128",
  },
  {
    id: "upper-left",
    address: "0x91...A72",
    position: "left-[20%] top-[25%]",
    relationship: "INBOUND",
    transactions: "34",
  },
  {
    id: "upper-right",
    address: "0x72...F19",
    position: "left-[76%] top-[22%]",
    relationship: "OUTBOUND",
    transactions: "19",
  },
  {
    id: "flagged",
    address: "0xC4...912",
    label: "FLAGGED",
    size: "medium",
    suspicious: true,
    position: "left-[19%] top-[67%]",
    relationship: "SUSPICIOUS",
    transactions: "67",
  },
  {
    id: "lower-right",
    address: "0xA1...D84",
    position: "left-[77%] top-[68%]",
    relationship: "OUTBOUND",
    transactions: "23",
  },
];

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!wallet.trim()) return;

    window.location.href = `/intake?wallet=${encodeURIComponent(
      wallet.trim()
    )}`;
  }
  return (
    <main className="min-h-screen overflow-hidden bg-[#EFE9E1] text-[#322D29]">
      {/* ============================================================
          NAVIGATION
      ============================================================ */}

      <header className="fixed left-1/2 top-5 z-50 w-[calc(100%-32px)] max-w-[1420px] -translate-x-1/2">
        <div className="relative flex h-[68px] items-center justify-between rounded-[20px] border border-[#EFE9E1]/10 bg-[#292522]/95 px-4 text-[#EFE9E1] shadow-[0_14px_45px_rgba(30,25,22,0.20)] backdrop-blur-md sm:px-5 lg:px-6">

          {/* BRAND */}
          <a
            href="/intake"
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#EFE9E1]/25 bg-[#322D29] transition-all duration-300 group-hover:border-[#72383D] group-hover:bg-[#72383D]">
              <span className="font-mono text-[9px] font-bold tracking-[-0.05em] text-[#EFE9E1]">
                CG
              </span>

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#72383D]" />
            </div>

            <div className="hidden leading-none sm:block">
              <p className="text-[11px] font-bold tracking-[0.14em]">
                CRYPTOGRAPH
              </p>

              <p className="mt-1 font-mono text-[6px] tracking-[0.22em] text-[#EFE9E1]/35">
                FINANCIAL INVESTIGATION
              </p>
            </div>
          </a>

          {/* NAVIGATION */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-[#EFE9E1]/10 bg-[#1F1C1A]/70 p-1 md:flex">
            <NavItem
              href="#investigate"
              label="Investigate"
              active
            />

            <NavItem
              href="#method"
              label="The Trail"
            />

            <NavItem
              href="#evidence"
              label="Evidence"
            />
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* Network status */}
            <div className="hidden items-center gap-2 rounded-full border border-[#EFE9E1]/10 px-3 py-2 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#72383D]/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#72383D]" />
              </span>

              <span className="font-mono text-[7px] font-medium tracking-[0.14em] text-[#EFE9E1]/55">
                ETH / LIVE
              </span>
            </div>

            {/* CTA */}
            <a
              href="#investigate"
              className="group flex h-10 items-center gap-2 rounded-[11px] bg-[#EFE9E1] px-4 text-[8px] font-bold tracking-[0.12em] text-[#322D29] transition-all duration-300 hover:bg-[#72383D] hover:text-[#EFE9E1] hover:shadow-[0_6px_20px_rgba(114,56,61,0.35)]"
            >
              <span className="hidden sm:inline">
                NEW INVESTIGATION
              </span>

              <span className="sm:hidden">
                NEW CASE
              </span>

              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO / INVESTIGATION
      ============================================================ */}

      <section
        id="investigate"
        className="mx-auto max-w-[1600px] px-6 lg:px-10"
      >
        <div className="relative grid min-h-[760px] grid-cols-1 pt-20 lg:grid-cols-[1fr_0.72fr] lg:pt-20">

          {/* Left vertical marker */}
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-[#322D29]/10 lg:block" />

          {/* ========================================================
              HERO COPY
          ======================================================== */}

          <div className="flex flex-col justify-center px-0 py-24 lg:pl-14 lg:pr-20">
            <div className="mb-8 flex items-center gap-3">
              <span className="font-mono text-[9px] text-[#72383D]">
                CASEWORK / 001
              </span>

              <span className="h-px w-12 bg-[#72383D]" />
            </div>

            <h1 className="max-w-[760px] text-[64px] font-medium leading-[0.91] tracking-[-0.065em] sm:text-[82px] lg:text-[104px]">
              Follow
              <br />
              the{" "}
              <span className="relative inline-block text-[#72383D]">
                money
                <span className="absolute -bottom-1 left-0 h-px w-[72%] bg-[#72383D]" />
              </span>
              .
            </h1>

            <div className="mt-10 grid max-w-[650px] grid-cols-[90px_1fr] gap-5">
              <span className="pt-1 font-mono text-[8px] tracking-[0.15em] text-[#322D29]/35">
                PURPOSE
              </span>

              <p className="max-w-[510px] text-[14px] leading-7 text-[#322D29]/60">
                Trace cryptocurrency transactions, expose relationships,
                identify behavioral patterns and build evidence from
                observable blockchain activity.
              </p>
            </div>

            {/* Begin investigation */}
            <div className="mt-14">
              <a
                href="/intake"
                className="group inline-flex h-[58px] items-center gap-5 bg-[#322D29] px-7 text-[9px] font-bold tracking-[0.18em] text-[#EFE9E1] transition-all duration-300 hover:bg-[#72383D] hover:shadow-[0_12px_30px_rgba(114,56,61,0.22)]"
              >
                BEGIN INVESTIGATION

                <span className="flex h-7 w-7 items-center justify-center border border-[#EFE9E1]/20 transition-all duration-300 group-hover:border-[#EFE9E1]/40">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>

              <p className="mt-4 font-mono text-[7px] tracking-[0.14em] text-[#322D29]/30">
                START WITH A SUBJECT WALLET ADDRESS
              </p>
            </div>

            {/* Bottom metadata */}
            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-5">
              <Meta label="NETWORK" value="ETHEREUM" />
              <Meta label="ANALYSIS" value="TRANSACTION GRAPH" />
              <Meta label="OUTPUT" value="EVIDENCE" />
            </div>
          </div>

          {/* ========================================================
              GRAPH / RIGHT SIDE
          ======================================================== */}

          <div
            className="relative hidden min-h-[760px] border-l border-[#322D29]/15 lg:block"
            onClick={() => setSelectedNode(null)}
          >

            {/* top metadata */}
            <div className="pointer-events-none absolute left-8 top-9 z-10">
              <p className="font-mono text-[8px] tracking-[0.14em] text-[#322D29]/30">
                LIVE NETWORK MAP
              </p>

              <p className="mt-2 font-mono text-[7px] tracking-[0.12em] text-[#322D29]/20">
                RELATIONSHIP VIEW / 2 HOPS
              </p>
            </div>

            <div className="pointer-events-none absolute right-8 top-9 z-10">
              <p className="font-mono text-[8px] text-[#322D29]/30">
                FIG. 01
              </p>
            </div>

            {/* subtle grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.11]"
              style={{
                backgroundImage:
                  "linear-gradient(#322D29 1px, transparent 1px), linear-gradient(90deg, #322D29 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />

            {/* Graph */}
            <div className="absolute inset-0">

              <svg
                viewBox="0 0 650 760"
                className="pointer-events-none absolute inset-0 h-full w-full"
                fill="none"
              >
                {/* neutral connections */}
                <path
                  d="M330 360 L155 215"
                  stroke={
                    selectedNode?.id === "upper-left"
                      ? "#72383D"
                      : "#AC9C8D"
                  }
                  strokeWidth={
                    selectedNode?.id === "upper-left" ? "2.5" : "1"
                  }
                  className="transition-all duration-300"
                />

                <path
                  d="M330 360 L505 190"
                  stroke={
                    selectedNode?.id === "upper-right"
                      ? "#72383D"
                      : "#AC9C8D"
                  }
                  strokeWidth={
                    selectedNode?.id === "upper-right" ? "2.5" : "1"
                  }
                  className="transition-all duration-300"
                />

                <path
                  d="M330 360 L150 520"
                  stroke={
                    selectedNode?.id === "flagged"
                      ? "#72383D"
                      : "#AC9C8D"
                  }
                  strokeWidth={
                    selectedNode?.id === "flagged" ? "2.5" : "1"
                  }
                  strokeDasharray={
                    selectedNode?.id === "flagged" ? "5 5" : undefined
                  }
                  className="transition-all duration-300"
                />

                <path
                  d="M330 360 L510 525"
                  stroke={
                    selectedNode?.id === "lower-right"
                      ? "#72383D"
                      : "#AC9C8D"
                  }
                  strokeWidth={
                    selectedNode?.id === "lower-right" ? "2.5" : "1"
                  }
                  className="transition-all duration-300"
                />

                <path
                  d="M155 215 L90 130"
                  stroke="#D1C7BD"
                  strokeWidth="1"
                />

                <path
                  d="M505 190 L575 110"
                  stroke="#D1C7BD"
                  strokeWidth="1"
                />

                <path
                  d="M150 520 L82 615"
                  stroke="#D1C7BD"
                  strokeWidth="1"
                />

                <path
                  d="M510 525 L580 625"
                  stroke="#D1C7BD"
                  strokeWidth="1"
                />

                {/* highlighted default relationship */}
                {!selectedNode && (
                  <path
                    d="M330 360 L150 520"
                    stroke="#72383D"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                  />
                )}
              </svg>

              {/* ====================================================
                  INTERACTIVE NODES
              ==================================================== */}

              {graphNodes.map((node) => (
                <GraphNode
                  key={node.id}
                  {...node}
                  selected={selectedNode?.id === node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                />
              ))}

              {/* outer nodes */}
              <div className="pointer-events-none absolute left-[11%] top-[16%] h-3 w-3 rounded-full bg-[#D1C7BD]" />

              <div className="pointer-events-none absolute left-[87%] top-[14%] h-3 w-3 rounded-full bg-[#D1C7BD]" />

              <div className="pointer-events-none absolute left-[10%] top-[82%] h-3 w-3 rounded-full bg-[#D1C7BD]" />

              <div className="pointer-events-none absolute left-[88%] top-[84%] h-3 w-3 rounded-full bg-[#D1C7BD]" />
            </div>

            {/* ====================================================
                NODE INSPECTION PANEL
            ==================================================== */}

            {selectedNode && (
              <div
                className="absolute bottom-8 left-8 z-30 w-[calc(100%-64px)] max-w-[390px] border border-[#322D29]/15 bg-[#EFE9E1]/95 shadow-[0_16px_45px_rgba(50,45,41,0.12)] backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* panel header */}
                <div className="flex items-center justify-between border-b border-[#322D29]/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${selectedNode.suspicious
                        ? "bg-[#72383D]"
                        : "bg-[#AC9C8D]"
                        }`}
                    />

                    <span className="font-mono text-[8px] font-bold tracking-[0.15em]">
                      NODE INSPECTION
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="flex h-5 w-5 items-center justify-center text-[#322D29]/35 transition-colors hover:text-[#72383D]"
                    aria-label="Close node inspection"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                {/* panel content */}
                <div className="grid grid-cols-3 gap-4 px-4 py-4">
                  <div>
                    <p className="font-mono text-[7px] tracking-[0.14em] text-[#322D29]/30">
                      ADDRESS
                    </p>

                    <p className="mt-2 font-mono text-[9px]">
                      {selectedNode.address}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[7px] tracking-[0.14em] text-[#322D29]/30">
                      RELATIONSHIP
                    </p>

                    <p
                      className={`mt-2 text-[8px] font-bold tracking-[0.08em] ${selectedNode.suspicious
                        ? "text-[#72383D]"
                        : ""
                        }`}
                    >
                      {selectedNode.relationship}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[7px] tracking-[0.14em] text-[#322D29]/30">
                      TRANSACTIONS
                    </p>

                    <p className="mt-2 font-mono text-[9px]">
                      {selectedNode.transactions}
                    </p>
                  </div>
                </div>

                {/* panel footer */}
                <div className="flex items-center justify-between border-t border-[#322D29]/10 px-4 py-3">
                  <span className="font-mono text-[7px] tracking-[0.13em] text-[#322D29]/35">
                    {selectedNode.label || "OBSERVED NODE"}
                  </span>

                  <span className="flex items-center gap-2 text-[7px] font-bold tracking-[0.14em]">
                    TRACE NODE
                    <ArrowRight className="h-3 w-3 text-[#72383D]" />
                  </span>
                </div>
              </div>
            )}

            {/* graph annotation */}
            {!selectedNode && (
              <div className="pointer-events-none absolute bottom-10 left-8 right-8 border-t border-[#322D29]/15 pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.16em]">
                      OBSERVED RELATIONSHIP
                    </p>

                    <p className="mt-1 max-w-[250px] text-[9px] leading-5 text-[#322D29]/40">
                      Click any wallet node to inspect its observable
                      relationship with the investigated address.
                    </p>
                  </div>

                  <ArrowDownRight className="h-4 w-4 text-[#72383D]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          METHOD
      ============================================================ */}

      <section
        id="method"
        className="border-y border-[#322D29]/15 bg-[#D9D9D9]/40"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-[280px_1fr]">

            {/* Section title */}
            <div className="border-r border-[#322D29]/15 py-20 pr-10">
              <p className="font-mono text-[9px] text-[#72383D]">
                02 / METHOD
              </p>

              <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.04em]">
                From address
                <br />
                to evidence.
              </h2>

              <p className="mt-5 text-xs leading-6 text-[#322D29]/45">
                An investigation develops through observable steps rather
                than a single risk score.
              </p>
            </div>

            {/* Steps */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              <Method
                number="01"
                icon={<Wallet />}
                title="ADDRESS"
                description="Establish the subject wallet and retrieve its observable transaction history."
              />

              <Method
                number="02"
                icon={<GitBranch />}
                title="NETWORK"
                description="Expand into relevant counterparties and map financial relationships."
              />

              <Method
                number="03"
                icon={<ShieldAlert />}
                title="BEHAVIOR"
                description="Evaluate transaction patterns against defined behavioral indicators."
              />

              <Method
                number="04"
                icon={<FileText />}
                title="EVIDENCE"
                description="Connect findings back to the blockchain transactions that support them."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TRANSACTION TRAIL
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#3A3430] text-[#EFE9E1]">
        {/* subtle background structure */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#EFE9E1 1px, transparent 1px), linear-gradient(90deg, #EFE9E1 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 py-32 lg:px-10">

          {/* section header */}
          <div className="mb-20 flex flex-col justify-between gap-8 border-b border-[#EFE9E1]/15 pb-8 lg:flex-row lg:items-end">

            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-[#AC9C8D]">
                  03 / TRANSACTION TRAIL
                </span>

                <span className="h-px w-16 bg-[#72383D]" />
              </div>

              <h2 className="mt-7 max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Follow the movement,
                <br />
                <span className="text-[#AC9C8D]">
                  not just the address.
                </span>
              </h2>
            </div>

            <div className="max-w-xs">
              <div className="mb-3 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#72383D]/40" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-[#72383D]" />
                </span>

                <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-[#EFE9E1]">
                  TRACE ACTIVE
                </span>
              </div>

              <p className="text-[13px] leading-6 text-[#EFE9E1]/50">
                Individual transfers become meaningful when examined as a
                sequence of connected movements.
              </p>
            </div>
          </div>

          {/* trail */}
          <div className="grid gap-16 lg:grid-cols-[0.55fr_1.45fr]">

            {/* left information */}
            <div className="relative">
              <div className="sticky top-32">
                <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-[#EFE9E1]/30">
                  INVESTIGATION PATH
                </p>

                <div className="mt-6 text-[46px] font-medium leading-none tracking-[-0.06em]">
                  03
                  <span className="ml-3 text-[#AC9C8D]">
                    HOPS
                  </span>
                </div>

                <p className="mt-6 max-w-sm text-[13px] leading-7 text-[#EFE9E1]/50">
                  The observed path below follows value as it moves from the
                  investigated address through connected counterparties.
                </p>

                <div className="mt-10 border-t border-[#EFE9E1]/15 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-[0.15em] text-[#EFE9E1]/35">
                      TOTAL OBSERVED
                    </span>

                    <span className="font-mono text-[12px] font-bold">
                      14.37 ETH
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-[0.15em] text-[#EFE9E1]/35">
                      TIME SPAN
                    </span>

                    <span className="font-mono text-[10px]">
                      26 MIN 41 SEC
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* transaction flow */}
            <div className="relative">
              <div className="absolute bottom-8 left-[17px] top-8 w-px bg-[#EFE9E1]/15" />

              <Trail
                time="09:14:21"
                amount="4.82 ETH"
                from="0x71...8F2"
                to="0x29...A91"
                note="OUTBOUND TRANSFER"
                step="01"
              />

              <Trail
                time="09:25:46"
                amount="4.80 ETH"
                from="0x29...A91"
                to="0xC12...8D4"
                note="11 MINUTES LATER"
                highlighted
                step="02"
              />

              <Trail
                time="09:41:02"
                amount="4.75 ETH"
                from="0xC12...8D4"
                to="0x91...77A"
                note="FORWARD MOVEMENT"
                step="03"
              />

              {/* end marker */}
              <div className="relative mt-10 flex items-center gap-5 pl-1">
                <div className="relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#72383D] bg-[#3A3430]">
                  <div className="h-2 w-2 rounded-full bg-[#72383D]" />
                </div>

                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-[#AC9C8D]">
                    CURRENT TRACE END
                  </p>

                  <p className="mt-1 text-[11px] text-[#EFE9E1]/40">
                    Observable path terminates here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          EVIDENCE
      ============================================================ */}

      <section
        id="evidence"
        className="border-t border-[#322D29]/15 bg-[#EFE9E1] text-[#322D29]"
      >
        <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">

            <div>
              <p className="font-mono text-[9px] text-[#72383D]">
                04 / EVIDENCE
              </p>

              <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                Every finding leaves a trail.
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-[#322D29]/50">
                Findings are accompanied by provenance so investigators can
                move from an observed signal back to the transactions behind
                it.
              </p>
            </div>

            <div className="border-t border-[#322D29]/15">
              <EvidenceRow
                number="01"
                title="HIGH INBOUND COUNTERPARTY DIVERSITY"
                detail="17 unique inbound wallets"
              />

              <EvidenceRow
                number="02"
                title="INBOUND CONCENTRATION"
                detail="Largest counterparty accounts for 61.4%"
              />

              <EvidenceRow
                number="03"
                title="ELEVATED FAILED TRANSACTIONS"
                detail="8.2% observed failure ratio"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer className="bg-[#292522] text-[#EFE9E1]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-6 py-9 text-[9px] font-semibold tracking-[0.17em] text-[#EFE9E1]/45 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>CRYPTOGRAPH / FINANCIAL INVESTIGATION</span>

          <span className="text-[#72383D]">ETHEREUM</span>

          <span>OBSERVE · TRACE · DOCUMENT</span>
        </div>
      </footer>
    </main>
  );
}

/* ================================================================
   NAVIGATION
================================================================ */

function NavItem({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`relative rounded-full px-4 py-2.5 text-[8px] font-bold tracking-[0.12em] transition-all duration-300 ${active
        ? "bg-[#EFE9E1] text-[#72383D] shadow-sm"
        : "text-[#EFE9E1]/45 hover:bg-[#EFE9E1]/10 hover:text-[#EFE9E1]"
        }`}
    >
      {label}

      {active && (
        <span className="absolute bottom-1 left-1/2 h-[2px] w-1 -translate-x-1/2 rounded-full bg-[#72383D]" />
      )}
    </a>
  );
}

/* ================================================================
   META
================================================================ */

function Meta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] font-bold tracking-[0.16em] text-[#322D29]/30">
        {label}
      </p>

      <p className="mt-1 font-mono text-[9px]">{value}</p>
    </div>
  );
}

/* ================================================================
   INTERACTIVE GRAPH NODE
================================================================ */

function GraphNode({
  position,
  size = "small",
  active = false,
  suspicious = false,
  selected = false,
  label,
  address,
  onClick,
}: NodeData & {
  selected?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const sizes = {
    small: "h-8 w-8",
    medium: "h-11 w-11",
    large: "h-[92px] w-[92px]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group absolute -translate-x-1/2 -translate-y-1/2 ${position} z-20 cursor-pointer outline-none`}
      aria-label={`Inspect ${address}`}
    >
      {/* selection halo */}
      <div
        className={`absolute -inset-4 rounded-full border transition-all duration-300 ${selected
          ? "scale-100 border-[#72383D]/45 opacity-100"
          : "scale-75 border-[#72383D]/0 opacity-0 group-hover:scale-100 group-hover:border-[#72383D]/20 group-hover:opacity-100"
          }`}
      />

      {/* node */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${sizes[size]
          } ${selected
            ? "border-2 border-[#72383D] bg-[#EFE9E1] shadow-[0_0_0_6px_rgba(114,56,61,0.10)]"
            : active
              ? "border-2 border-[#72383D] bg-[#EFE9E1]"
              : suspicious
                ? "border-2 border-[#72383D] bg-[#72383D]"
                : "border border-[#AC9C8D] bg-[#EFE9E1]"
          } ${!selected
            ? "group-hover:-translate-y-1 group-hover:border-[#72383D]"
            : ""
          }`}
      >
        <div
          className={`rounded-full transition-all duration-300 ${size === "large" ? "h-5 w-5" : "h-2 w-2"
            } ${selected
              ? "bg-[#72383D]"
              : active
                ? "bg-[#72383D]"
                : suspicious
                  ? "bg-[#EFE9E1]"
                  : "bg-[#AC9C8D]"
            }`}
        />

        {/* active pulse */}
        {(active || selected) && (
          <div
            className={`absolute -inset-3 rounded-full border ${selected
              ? "animate-pulse border-[#72383D]/35"
              : "border-[#72383D]/15"
              }`}
          />
        )}
      </div>

      {label && (
        <p
          className={`absolute top-full mt-3 whitespace-nowrap text-[8px] font-bold tracking-[0.14em] transition-colors ${suspicious || selected
            ? "text-[#72383D]"
            : "text-[#322D29]/45"
            }`}
        >
          {label}
        </p>
      )}

      <p className="absolute left-1/2 top-full mt-7 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] text-[#322D29]/30">
        {address}
      </p>
    </button>
  );
}

/* ================================================================
   METHOD
================================================================ */

function Method({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group border-b border-[#322D29]/15 p-7 transition-colors hover:bg-[#EFE9E1] lg:border-b-0 lg:border-r last:border-r-0">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[8px] text-[#72383D]">
          {number}
        </span>

        <div className="h-5 w-5 text-[#AC9C8D] transition-colors group-hover:text-[#72383D]">
          {icon}
        </div>
      </div>

      <h3 className="mt-14 text-[11px] font-bold tracking-[0.16em]">
        {title}
      </h3>

      <p className="mt-4 text-[11px] leading-6 text-[#322D29]/45">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   TRAIL
================================================================ */

function Trail({
  time,
  amount,
  from,
  to,
  note,
  highlighted = false,
  step,
}: {
  time: string;
  amount: string;
  from: string;
  to: string;
  note: string;
  highlighted?: boolean;
  step: string;
}) {
  return (
    <div className="group relative mb-12 pl-12 last:mb-0">

      {/* timeline node */}
      <div
        className={`absolute left-0 top-6 z-10 flex h-[35px] w-[35px] items-center justify-center rounded-full border transition-all duration-300 ${highlighted
          ? "border-[#72383D] bg-[#72383D] shadow-[0_0_0_8px_rgba(114,56,61,0.12)]"
          : "border-[#AC9C8D]/60 bg-[#3A3430] group-hover:border-[#72383D] group-hover:shadow-[0_0_0_7px_rgba(114,56,61,0.10)]"
          }`}
      >
        <span
          className={`h-2 w-2 rounded-full transition-all ${highlighted
            ? "bg-[#EFE9E1]"
            : "bg-[#AC9C8D] group-hover:bg-[#72383D]"
            }`}
        />
      </div>

      {/* transaction card */}
      <div
        className={`relative overflow-hidden border transition-all duration-300 ${highlighted
          ? "border-[#72383D]/35 bg-[#292522] shadow-[0_16px_40px_rgba(20,17,15,0.25)]"
          : "border-[#EFE9E1]/10 bg-[#292522]/65 group-hover:-translate-y-1 group-hover:border-[#72383D]/30 group-hover:bg-[#292522]/85 group-hover:shadow-[0_14px_35px_rgba(20,17,15,0.20)]"
          }`}
      >

        {/* top strip */}
        <div
          className={`flex items-center justify-between border-b px-5 py-3 ${highlighted
            ? "border-[#72383D]/20 bg-[#72383D]/[0.06]"
            : "border-[#EFE9E1]/10"
            }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-[#AC9C8D]">
              STEP {step}
            </span>

            <span className="h-px w-8 bg-[#72383D]/50" />

            <span className="font-mono text-[9px] tracking-[0.13em] text-[#EFE9E1]/35">
              {note}
            </span>
          </div>

          <span className="font-mono text-[9px] text-[#EFE9E1]/30">
            {time} UTC
          </span>
        </div>

        {/* main transaction */}
        <div className="grid gap-7 px-5 py-7 md:grid-cols-[1fr_auto_1fr] md:items-center">

          {/* sender */}
          <div>
            <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-[#EFE9E1]/30">
              FROM
            </p>

            <p className="mt-3 font-mono text-[15px] font-medium tracking-[-0.02em] text-[#EFE9E1]">
              {from}
            </p>

            <p className="mt-2 text-[9px] text-[#EFE9E1]/30">
              SOURCE WALLET
            </p>
          </div>

          {/* amount / direction */}
          <div className="flex flex-col items-center">

            <p
              className={`text-2xl font-medium tracking-[-0.04em] ${highlighted ? "text-[#AC9C8D]" : "text-[#EFE9E1]"
                }`}
            >
              {amount}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-px w-10 bg-[#72383D]/45" />

              <ArrowRight className="h-4 w-4 text-[#72383D]" />

              <div className="h-px w-10 bg-[#72383D]/45" />
            </div>

            <p className="mt-2 font-mono text-[7px] tracking-[0.14em] text-[#EFE9E1]/25">
              VALUE TRANSFER
            </p>
          </div>

          {/* receiver */}
          <div className="md:text-right">
            <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-[#EFE9E1]/30">
              TO
            </p>

            <p className="mt-3 font-mono text-[15px] font-medium tracking-[-0.02em] text-[#EFE9E1]">
              {to}
            </p>

            <p className="mt-2 text-[9px] text-[#EFE9E1]/30">
              DESTINATION WALLET
            </p>
          </div>
        </div>

        {/* bottom data strip */}
        <div className="flex flex-col gap-3 border-t border-[#EFE9E1]/10 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${highlighted ? "bg-[#72383D]" : "bg-[#AC9C8D]"
                }`}
            />

            <span className="font-mono text-[8px] tracking-[0.12em] text-[#EFE9E1]/35">
              OBSERVED ON CHAIN
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="font-mono text-[8px] text-[#EFE9E1]/25">
              ETHEREUM
            </span>

            <span className="font-mono text-[8px] text-[#EFE9E1]/25">
              CONFIRMED
            </span>
          </div>
        </div>

        {/* highlighted edge */}
        {highlighted && (
          <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#72383D]" />
        )}
      </div>
    </div>
  );
}

/* ================================================================
   EVIDENCE
================================================================ */

function EvidenceRow({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="grid gap-5 border-b border-[#322D29]/15 py-7 sm:grid-cols-[50px_1fr_auto] sm:items-center">
      <span className="font-mono text-[8px] text-[#72383D]">
        {number}
      </span>

      <div>
        <p className="text-[10px] font-bold tracking-[0.12em]">
          {title}
        </p>

        <p className="mt-2 text-[10px] text-[#322D29]/35">
          Blockchain transaction analysis
        </p>
      </div>

      <span className="font-mono text-[9px] text-[#72383D]">
        {detail}
      </span>
    </div>
  );
}