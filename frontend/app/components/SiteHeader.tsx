"use client";

import Link from "next/link";
import { ReactNode } from "react";

type SitePage =
    | "home"
    | "intake"
    | "investigation"
    | "evidence"
    | "cross-case"
    | "action"
    | "documentation";

type SiteHeaderProps = {
    activePage: SitePage;
    rightAction?: ReactNode;
    statusText?: string;
};

const navigation: {
    label: string;
    href: string;
    page: SitePage;
}[] = [
    {
        label: "HOME",
        href: "/",
        page: "home",
    },
    {
        label: "INTAKE",
        href: "/intake",
        page: "intake",
    },
    {
        label: "INVESTIGATE",
        href: "/investigation",
        page: "investigation",
    },
    {
        label: "EVIDENCE",
        href: "/evidence",
        page: "evidence",
    },
    {
        label: "CROSS-CASE",
        href: "/cross-case",
        page: "cross-case",
    },
    {
        label: "ACTION",
        href: "/action",
        page: "action",
    },
    {
        label: "DOCUMENTATION",
        href: "/documentation",
        page: "documentation",
    },
];

export default function SiteHeader({
    activePage,
    rightAction,
    statusText = "ETH / LIVE",
}: SiteHeaderProps) {
    return (
        <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-[1480px] -translate-x-1/2">
            <div className="flex min-h-[70px] items-center gap-4 rounded-[20px] border border-[#EFE9E1]/10 bg-[#292522]/95 px-4 text-[#EFE9E1] shadow-[0_16px_50px_rgba(30,25,22,0.24)] backdrop-blur-xl lg:px-5">

                {/* BRAND */}

                <Link
                    href="/"
                    className="group flex shrink-0 items-center gap-3"
                >
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-[11px] border border-[#EFE9E1]/20 bg-[#322D29] transition-all duration-300 group-hover:border-[#72383D] group-hover:bg-[#72383D]">
                        <span className="font-mono text-[10px] font-bold tracking-[-0.05em]">
                            CG
                        </span>

                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#72383D]" />
                    </div>

                    <div className="hidden leading-none xl:block">
                        <p className="text-[12px] font-bold tracking-[0.14em]">
                            CRYPTOGRAPH
                        </p>

                        <p className="mt-1 font-mono text-[7px] tracking-[0.22em] text-[#EFE9E1]/35">
                            FINANCIAL INVESTIGATION
                        </p>
                    </div>
                </Link>

                {/* COMPLETE INVESTIGATION WORKFLOW */}

                <nav className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="mx-auto flex w-max items-center gap-0.5 rounded-full border border-[#EFE9E1]/10 bg-[#1F1C1A]/75 p-1">
                        {navigation.map((item) => {
                            const active = activePage === item.page;

                            return (
                                <Link
                                    key={item.page}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`whitespace-nowrap rounded-full px-3 py-2.5 text-[8px] font-bold tracking-[0.10em] transition-all duration-200 sm:px-3.5 lg:px-3.5 ${
                                        active
                                            ? "bg-[#EFE9E1] text-[#72383D] shadow-sm"
                                            : "text-[#EFE9E1]/45 hover:bg-[#EFE9E1]/10 hover:text-[#EFE9E1]"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* PERSISTENT CASE / NETWORK CONTEXT */}

                <div className="hidden shrink-0 items-center gap-2 lg:flex">

                    <div className="flex items-center gap-2 rounded-full border border-[#EFE9E1]/10 px-3 py-2.5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-[#72383D]/40" />

                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#72383D]" />
                        </span>

                        <span className="font-mono text-[8px] tracking-[0.12em] text-[#EFE9E1]/55">
                            {statusText}
                        </span>
                    </div>

                    <div className="hidden items-center rounded-full border border-[#EFE9E1]/10 px-3 py-2.5 xl:flex">
                        <span className="font-mono text-[8px] tracking-[0.12em] text-[#EFE9E1]/55">
                            CASE / CG-001
                        </span>
                    </div>

                    {rightAction}
                </div>
            </div>
        </header>
    );
}