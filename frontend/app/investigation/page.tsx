"use client";
import SiteHeader from "../components/SiteHeader";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Activity,
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    CircleAlert,
    FileText,
    GitBranch,
    Maximize2,
    Minus,
    Plus,
    RotateCcw,
    Search,
    ShieldAlert,
    Wallet,
    X,
    Zap,
} from "lucide-react";

type NodeData = {
    id: string;
    address: string;
    label?: string;
    suspicious?: boolean;
    type: "subject" | "wallet" | "exchange" | "contract";
    transactions: number;
    volume: string;
    relationship: string;
    position: string;
};

type GraphEdge = {
    id: string;
    from: string;
    to: string;
    amount: string;
    note: string;
};

const demoNodes: NodeData[] = [
    {
        id: "subject",
        address: "0x71...8F2",
        label: "SUBJECT",
        type: "subject",
        transactions: 128,
        volume: "42.81 ETH",
        relationship: "PRIMARY ADDRESS",
        position: "left-[50%] top-[50%]",
    },
    {
        id: "inbound",
        address: "0x91...A72",
        type: "wallet",
        transactions: 34,
        volume: "8.42 ETH",
        relationship: "INBOUND",
        position: "left-[24%] top-[27%]",
    },
    {
        id: "outbound",
        address: "0x72...F19",
        type: "wallet",
        transactions: 19,
        volume: "12.17 ETH",
        relationship: "OUTBOUND",
        position: "left-[77%] top-[24%]",
    },
    {
        id: "flagged",
        address: "0xC4...912",
        label: "FLAGGED",
        suspicious: true,
        type: "wallet",
        transactions: 67,
        volume: "17.92 ETH",
        relationship: "SUSPICIOUS",
        position: "left-[23%] top-[70%]",
    },
    {
        id: "exchange",
        address: "0xA1...D84",
        label: "EXCHANGE",
        type: "exchange",
        transactions: 23,
        volume: "21.44 ETH",
        relationship: "EXCHANGE",
        position: "left-[77%] top-[71%]",
    },
    {
        id: "contract",
        address: "0xF2...91C",
        type: "contract",
        transactions: 42,
        volume: "6.31 ETH",
        relationship: "CONTRACT",
        position: "left-[50%] top-[17%]",
    },
];

/*
 * FRONTEND GRAPH RELATIONSHIPS
 *
 * These are the relationships the trace engine currently follows.
 * Later, these can be replaced directly with relationships returned
 * from the blockchain/backend.
 */
const demoGraphEdges: GraphEdge[] = [
    {
        id: "subject-inbound",
        from: "subject",
        to: "inbound",
        amount: "8.42 ETH",
        note: "INBOUND TRANSFER",
    },
    {
        id: "subject-outbound",
        from: "subject",
        to: "outbound",
        amount: "12.17 ETH",
        note: "OUTBOUND TRANSFER",
    },
    {
        id: "subject-flagged",
        from: "subject",
        to: "flagged",
        amount: "17.92 ETH",
        note: "SUSPICIOUS MOVEMENT",
    },
    {
        id: "subject-exchange",
        from: "subject",
        to: "exchange",
        amount: "21.44 ETH",
        note: "EXCHANGE INTERACTION",
    },
    {
        id: "subject-contract",
        from: "subject",
        to: "contract",
        amount: "6.31 ETH",
        note: "CONTRACT INTERACTION",
    },
    {
        id: "flagged-exchange",
        from: "flagged",
        to: "exchange",
        amount: "4.71 ETH",
        note: "FORWARD MOVEMENT",
    },
];

const demoTrail = [
    {
        time: "09:14:21",
        amount: "4.82 ETH",
        from: "0x71...8F2",
        to: "0x29...A91",
        note: "OUTBOUND TRANSFER",
    },
    {
        time: "09:25:46",
        amount: "4.80 ETH",
        from: "0x29...A91",
        to: "0xC12...8D4",
        note: "11 MINUTES LATER",
        highlighted: true,
    },
    {
        time: "09:41:02",
        amount: "4.75 ETH",
        from: "0xC12...8D4",
        to: "0x91...77A",
        note: "FORWARD MOVEMENT",
    },
    {
        time: "10:03:18",
        amount: "4.71 ETH",
        from: "0x91...77A",
        to: "0xA1...D84",
        note: "EXCHANGE INTERACTION",
    },
];


type RawRecord = Record<string, unknown>;

function shortenAddress(value: string) {
    if (!value) return "UNKNOWN";
    if (value.length <= 14) return value;
    return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function collectTransactions(value: unknown, output: RawRecord[] = []) {
    if (Array.isArray(value)) {
        for (const item of value) {
            collectTransactions(item, output);
        }
        return output;
    }

    if (!value || typeof value !== "object") return output;

    const obj = value as RawRecord;

    const from =
        typeof obj.from_wallet === "string"
            ? obj.from_wallet
            : typeof obj.from === "string"
                ? obj.from
                : null;

    const to =
        typeof obj.to_wallet === "string"
            ? obj.to_wallet
            : typeof obj.to === "string"
                ? obj.to
                : null;

    if (from && to) {
        output.push(obj);
    }

    for (const child of Object.values(obj)) {
        if (child && typeof child === "object") {
            collectTransactions(child, output);
        }
    }

    return output;
}

function numberValue(value: unknown) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function buildLiveGraph(data: unknown, rootWallet: string) {
    const raw = collectTransactions(data);
    const seen = new Set<string>();
    const transactions = raw.filter((tx) => {
        const hash =
            typeof tx.transaction_hash === "string"
                ? tx.transaction_hash
                : "";

        const from =
            typeof tx.from_wallet === "string"
                ? tx.from_wallet
                : typeof tx.from === "string"
                    ? tx.from
                    : "";

        const to =
            typeof tx.to_wallet === "string"
                ? tx.to_wallet
                : typeof tx.to === "string"
                    ? tx.to
                    : "";

        const timestamp =
            typeof tx.timestamp === "string"
                ? tx.timestamp
                : "";

        const key =
            hash ||
            `${from}|${to}|${timestamp}|${numberValue(tx.value_eth)}`;

        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    if (transactions.length === 0) {
        return {
            nodes: demoNodes,
            graphEdges: demoGraphEdges,
            trail: demoTrail,
        };
    }

    const addressSet = new Set<string>();

    for (const tx of transactions) {
        const from =
            typeof tx.from_wallet === "string"
                ? tx.from_wallet
                : typeof tx.from === "string"
                    ? tx.from
                    : "";

        const to =
            typeof tx.to_wallet === "string"
                ? tx.to_wallet
                : typeof tx.to === "string"
                    ? tx.to
                    : "";

        if (from) addressSet.add(from.toLowerCase());
        if (to) addressSet.add(to.toLowerCase());
    }

    if (rootWallet) {
        addressSet.add(rootWallet.toLowerCase());
    }

    const addresses = [...addressSet].slice(0, 18);
    const root = rootWallet.toLowerCase();

    const nodes = addresses.map((address, index) => {
        const related = transactions.filter((tx) => {
            const from =
                typeof tx.from_wallet === "string"
                    ? tx.from_wallet.toLowerCase()
                    : typeof tx.from === "string"
                        ? tx.from.toLowerCase()
                        : "";

            const to =
                typeof tx.to_wallet === "string"
                    ? tx.to_wallet.toLowerCase()
                    : typeof tx.to === "string"
                        ? tx.to.toLowerCase()
                        : "";

            return from === address || to === address;
        });

        const volume = related.reduce(
            (sum, tx) => sum + numberValue(tx.value_eth),
            0,
        );

        const inbound = related.filter((tx) => {
            const to =
                typeof tx.to_wallet === "string"
                    ? tx.to_wallet.toLowerCase()
                    : typeof tx.to === "string"
                        ? tx.to.toLowerCase()
                        : "";
            return to === address;
        }).length;

        const outbound = related.filter((tx) => {
            const from =
                typeof tx.from_wallet === "string"
                    ? tx.from_wallet.toLowerCase()
                    : typeof tx.from === "string"
                        ? tx.from.toLowerCase()
                        : "";
            return from === address;
        }).length;

        const angle =
            addresses.length > 1
                ? (index / addresses.length) * Math.PI * 2
                : 0;

        const left = 50 + Math.cos(angle) * 35;
        const top = 50 + Math.sin(angle) * 33;

        const isRoot = address === root;

        return {
            id: `wallet-${index}`,
            address: shortenAddress(address),
            label: isRoot ? "SUBJECT" : undefined,
            suspicious: false,
            type: "wallet" as const,
            transactions: related.length,
            volume: `${volume.toFixed(2)} ETH`,
            relationship: isRoot
                ? "PRIMARY ADDRESS"
                : inbound > outbound
                    ? "INBOUND"
                    : "OUTBOUND",
            position: `left-[${Math.max(8, Math.min(92, left))}%] top-[${Math.max(18, Math.min(82, top))}%]`,
        };
    });

    const nodeByAddress = new Map(
        addresses.map((address, index) => [
            address,
            `wallet-${index}`,
        ]),
    );

    const graphEdges = transactions
        .slice(0, 24)
        .map((tx, index) => {
            const from =
                typeof tx.from_wallet === "string"
                    ? tx.from_wallet.toLowerCase()
                    : typeof tx.from === "string"
                        ? tx.from.toLowerCase()
                        : "";

            const to =
                typeof tx.to_wallet === "string"
                    ? tx.to_wallet.toLowerCase()
                    : typeof tx.to === "string"
                        ? tx.to.toLowerCase()
                        : "";

            const fromId = nodeByAddress.get(from);
            const toId = nodeByAddress.get(to);

            if (!fromId || !toId) return null;

            return {
                id: `live-edge-${index}`,
                from: fromId,
                to: toId,
                amount: `${numberValue(tx.value_eth).toFixed(4)} ETH`,
                note: "BLOCKCHAIN TRANSFER",
            };
        })
        .filter(Boolean) as GraphEdge[];

    const trail = transactions
        .slice(0, 8)
        .map((tx, index) => {
            const from =
                typeof tx.from_wallet === "string"
                    ? tx.from_wallet
                    : typeof tx.from === "string"
                        ? tx.from
                        : "";

            const to =
                typeof tx.to_wallet === "string"
                    ? tx.to_wallet
                    : typeof tx.to === "string"
                        ? tx.to
                        : "";

            return {
                time:
                    typeof tx.timestamp === "string"
                        ? tx.timestamp.slice(11, 19)
                        : `TX-${index + 1}`,
                amount: `${numberValue(tx.value_eth).toFixed(4)} ETH`,
                from: shortenAddress(from),
                to: shortenAddress(to),
                note: "BLOCKCHAIN TRANSFER",
                highlighted: index === 0,
            };
        });

    return {
        nodes,
        graphEdges,
        trail: trail.length ? trail : demoTrail,
    };
}

export default function InvestigationPage() {
    const [investigationData, setInvestigationData] = useState<unknown>(null);
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [zoom, setZoom] = useState(1);

    /*
     * TRACE STATE
     *
     * tracedNode = starting node for the current trace
     * traceRunning = whether the trace sequence is active
     * traceStep = which relationship in the path is currently being traced
     * tracePath = ordered node path discovered from the graph
     * traceEdges = ordered edge path discovered from the graph
     */
    const [tracedNode, setTracedNode] = useState<NodeData | null>(null);
    const [traceRunning, setTraceRunning] = useState(false);
    const [traceStep, setTraceStep] = useState(0);
    const [tracePath, setTracePath] = useState<string[]>([]);
    const [traceEdges, setTraceEdges] = useState<string[]>([]);

    /*
     * DRAGGABLE INSPECTOR
     */
    const graphRef = useRef<HTMLDivElement | null>(null);

    const [inspectorPosition, setInspectorPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const [draggingInspector, setDraggingInspector] = useState(false);

    const dragOffset = useRef({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem("investigationData");

            if (!stored) return;

            setInvestigationData(JSON.parse(stored));
        } catch {
            setInvestigationData(null);
        }
    }, []);

    const rootWallet = useMemo(() => {
        const value = investigationData as RawRecord | null;

        if (!value || typeof value !== "object") return "";

        const investigation =
            value.investigation &&
            typeof value.investigation === "object"
                ? (value.investigation as RawRecord)
                : null;

        const candidates = [
            investigation?.wallet_address,
            value.wallet_address,
            investigation?.suspect_wallet,
        ];

        return (
            candidates.find(
                (item): item is string =>
                    typeof item === "string" && item.length > 0,
            ) ?? ""
        );
    }, [investigationData]);

    const liveGraph = useMemo(
        () =>
            investigationData
                ? buildLiveGraph(investigationData, rootWallet)
                : {
                    nodes: demoNodes,
                    graphEdges: demoGraphEdges,
                    trail: demoTrail,
                },
        [investigationData, rootWallet],
    );

    const nodes = liveGraph.nodes;
    const graphEdges = liveGraph.graphEdges;
    const trail = liveGraph.trail;

    useEffect(() => {
        if (!selectedNode && nodes.length > 0) {
            setSelectedNode(nodes[0]);
        }
    }, [nodes, selectedNode]);

    /*
     * Set the inspector's initial position to the bottom-right
     * of the graph area.
     */
    useEffect(() => {
        const graph = graphRef.current;

        if (!graph) return;

        const width = graph.clientWidth;
        const height = graph.clientHeight;

        setInspectorPosition({
            x: Math.max(20, width - 355),
            y: Math.max(100, height - 295),
        });
    }, []);

    /*
     * Handle inspector dragging.
     */
    useEffect(() => {
        if (!draggingInspector) return;

        const handlePointerMove = (event: PointerEvent) => {
            const graph = graphRef.current;

            if (!graph) return;

            const rect = graph.getBoundingClientRect();

            const inspectorWidth = 330;
            const inspectorHeight = 280;

            let nextX =
                event.clientX -
                rect.left -
                dragOffset.current.x;

            let nextY =
                event.clientY -
                rect.top -
                dragOffset.current.y;

            /*
             * Keep the inspector inside the graph.
             */
            nextX = Math.max(
                10,
                Math.min(
                    nextX,
                    rect.width - inspectorWidth - 10,
                ),
            );

            nextY = Math.max(
                75,
                Math.min(
                    nextY,
                    rect.height - inspectorHeight - 10,
                ),
            );

            setInspectorPosition({
                x: nextX,
                y: nextY,
            });
        };

        const handlePointerUp = () => {
            setDraggingInspector(false);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove,
            );

            window.removeEventListener(
                "pointerup",
                handlePointerUp,
            );
        };
    }, [draggingInspector]);

    /*
     * TRACE ENGINE
     *
     * Every ~900ms the trace moves one relationship further through
     * the graph. This makes the visual trace correspond to an actual
     * ordered graph path rather than simply turning on every line.
     */
    useEffect(() => {
        if (!traceRunning || traceEdges.length === 0) return;

        const interval = window.setInterval(() => {
            setTraceStep((current) => {
                if (current >= traceEdges.length) {
                    window.clearInterval(interval);
                    return current;
                }

                return current + 1;
            });
        }, 900);

        return () => window.clearInterval(interval);
    }, [traceRunning, traceEdges.length]);

    /*
     * End the visual trace after the final relationship has been
     * displayed for a short period.
     */
    useEffect(() => {
        if (!traceRunning || traceEdges.length === 0) return;

        const duration =
            traceEdges.length * 900 + 1900;

        const timer = window.setTimeout(() => {
            setTraceRunning(false);
            setTraceStep(traceEdges.length);
        }, duration);

        return () => window.clearTimeout(timer);
    }, [traceRunning, traceEdges.length]);

    /*
     * Build a breadth-first trace path from the selected node.
     *
     * This means TRACE NODE is actually traversing the graph:
     *
     * selected node
     *      ↓
     * connected node
     *      ↓
     * next connected node
     *      ↓
     * etc.
     *
     * Each edge is visited once.
     */
    function buildTracePath(startNodeId: string) {
        const visitedNodes = new Set<string>();
        const visitedEdges = new Set<string>();

        const orderedNodes: string[] = [startNodeId];
        const orderedEdges: string[] = [];

        const queue: string[] = [startNodeId];

        visitedNodes.add(startNodeId);

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (!currentNode) continue;

            const connectedEdges = graphEdges.filter(
                (edge) =>
                    edge.from === currentNode ||
                    edge.to === currentNode,
            );

            for (const edge of connectedEdges) {
                if (visitedEdges.has(edge.id)) continue;

                const nextNode =
                    edge.from === currentNode
                        ? edge.to
                        : edge.from;

                visitedEdges.add(edge.id);
                orderedEdges.push(edge.id);

                if (!visitedNodes.has(nextNode)) {
                    visitedNodes.add(nextNode);
                    orderedNodes.push(nextNode);
                    queue.push(nextNode);
                }
            }
        }

        return {
            nodes: orderedNodes,
            edges: orderedEdges,
        };
    }

    /*
     * Return the nodes that have already been reached by the trace.
     */
    const tracedNodeIds = useMemo(() => {
        if (!traceRunning && traceStep === 0) {
            return new Set<string>();
        }

        const reached = new Set<string>();

        if (tracePath.length > 0) {
            reached.add(tracePath[0]);
        }

        for (
            let index = 0;
            index < Math.min(traceStep, tracePath.length - 1);
            index++
        ) {
            reached.add(tracePath[index + 1]);
        }

        return reached;
    }, [tracePath, traceStep, traceRunning]);

    /*
     * Return the edges that have already been reached.
     */
    const tracedEdgeIds = useMemo(() => {
        return new Set(
            traceEdges.slice(
                0,
                Math.min(traceStep, traceEdges.length),
            ),
        );
    }, [traceEdges, traceStep]);

    function startInspectorDrag(
        event: React.PointerEvent<HTMLDivElement>,
    ) {
        if (!inspectorPosition) return;

        const rect = event.currentTarget
            .closest("[data-inspector]")
            ?.getBoundingClientRect();

        if (!rect) return;

        dragOffset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        setDraggingInspector(true);

        event.preventDefault();
    }

    const visibleNodes = useMemo(() => {
        if (activeFilter === "ALL") return nodes;

        if (activeFilter === "FLAGGED") {
            return nodes.filter((node) => node.suspicious);
        }

        if (activeFilter === "EXCHANGE") {
            return nodes.filter((node) => node.type === "exchange");
        }

        return nodes.filter((node) => node.type === "wallet");
    }, [activeFilter]);

    const searchedNodes = useMemo(() => {
        if (!search.trim()) return visibleNodes;

        return visibleNodes.filter((node) =>
            `${node.address} ${node.label ?? ""} ${node.relationship}`
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [search, visibleNodes]);

    /*
     * Generate transaction trail data from the actual graph path.
     */
    const activeTrail = useMemo(() => {
        if (!tracedNode || tracePath.length < 2) {
            return trail;
        }

        const generatedTrail = [];

        for (
            let index = 0;
            index < traceEdges.length;
            index++
        ) {
            const edge = graphEdges.find(
                (item) => item.id === traceEdges[index],
            );

            if (!edge) continue;

            const fromNode = nodes.find(
                (node) => node.id === edge.from,
            );

            const toNode = nodes.find(
                (node) => node.id === edge.to,
            );

            if (!fromNode || !toNode) continue;

            generatedTrail.push({
                time: `0${9 + Math.floor(index / 2)}:${String(
                    14 + index * 7,
                ).padStart(2, "0")}:21`,
                amount: edge.amount,
                from: fromNode.address,
                to: toNode.address,
                note: edge.note,
                highlighted:
                    toNode.suspicious ||
                    index === 0,
            });
        }

        return generatedTrail.length > 0
            ? generatedTrail
            : trail;
    }, [tracedNode, tracePath, traceEdges]);

    /*
     * Dynamic trace findings.
     */
    const activeFindings = useMemo(() => {
        if (!tracedNode) {
            return [
                {
                    number: "01",
                    icon: <ShieldAlert />,
                    title: "HIGH COUNTERPARTY DIVERSITY",
                    detail:
                        "17 unique inbound wallets observed across the analyzed period.",
                    value: "17",
                },
                {
                    number: "02",
                    icon: <Wallet />,
                    title: "INBOUND CONCENTRATION",
                    detail:
                        "Largest observed counterparty accounts for 61.4% of inbound volume.",
                    value: "61.4%",
                },
                {
                    number: "03",
                    icon: <GitBranch />,
                    title: "FORWARD MOVEMENT",
                    detail:
                        "Funds move through multiple addresses within short transaction intervals.",
                    value: "DETECTED",
                },
            ];
        }

        return [
            {
                number: "01",
                icon: <GitBranch />,
                title: "TRACE PATH LENGTH",
                detail:
                    `${Math.max(
                        tracePath.length - 1,
                        0,
                    )} connected relationships discovered from ${tracedNode.address}.`,
                value: `${Math.max(
                    tracePath.length - 1,
                    0,
                )} HOPS`,
            },
            {
                number: "02",
                icon: <Wallet />,
                title: "CONNECTED COUNTERPARTIES",
                detail:
                    `${Math.max(
                        tracePath.length - 1,
                        0,
                    )} counterparties are reachable through the current graph.`,
                value: `${Math.max(
                    tracePath.length - 1,
                    0,
                )}`,
            },
            {
                number: "03",
                icon: <CircleAlert />,
                title: "FLAGGED RELATIONSHIP",
                detail:
                    tracePath.includes("flagged")
                        ? "The active trace reaches a flagged address within the graph."
                        : "No flagged address is reached by the current graph path.",
                value: tracePath.includes("flagged")
                    ? "DETECTED"
                    : "NOT FOUND",
            },
        ];
    }, [tracedNode, tracePath]);

    /*
     * Dynamic evidence.
     */
    const activeEvidence = useMemo(() => {
        if (!tracedNode) {
            return [
                {
                    icon: <FileText />,
                    title: "TRANSACTION PROVENANCE",
                    detail:
                        "4 transactions supporting the selected trace",
                },
                {
                    icon: <GitBranch />,
                    title: "RELATIONSHIP PATH",
                    detail:
                        "Subject → intermediary → flagged address",
                },
                {
                    icon: <CircleAlert />,
                    title: "BEHAVIOURAL INDICATOR",
                    detail:
                        "Short-interval forward movement detected",
                },
            ];
        }

        return [
            {
                icon: <FileText />,
                title: "TRANSACTION PROVENANCE",
                detail: `${traceEdges.length} graph relationships supporting the current trace`,
            },
            {
                icon: <GitBranch />,
                title: "RELATIONSHIP PATH",
                detail:
                    tracePath
                        .map((id) => {
                            return nodes.find(
                                (node) => node.id === id,
                            )?.address;
                        })
                        .filter(Boolean)
                        .join(" → "),
            },
            {
                icon: <CircleAlert />,
                title: "TRACE STATUS",
                detail:
                    tracePath.includes("flagged")
                        ? "Flagged address reached through the active graph"
                        : "No flagged address reached in the active graph",
            },
        ];
    }, [tracedNode, tracePath, traceEdges]);

    function resetGraph() {
        setSelectedNode(nodes[0]);
        setActiveFilter("ALL");
        setSearch("");
        setZoom(1);
        setTracedNode(null);
        setTraceRunning(false);
        setTraceStep(0);
        setTracePath([]);
        setTraceEdges([]);

        const graph = graphRef.current;

        if (graph) {
            setInspectorPosition({
                x: Math.max(20, graph.clientWidth - 355),
                y: Math.max(100, graph.clientHeight - 295),
            });
        }
    }

    function traceSelectedNode() {
        if (!selectedNode) return;

        const result = buildTracePath(
            selectedNode.id,
        );

        setTracedNode(selectedNode);
        setTracePath(result.nodes);
        setTraceEdges(result.edges);
        setTraceStep(0);
        setTraceRunning(false);

        /*
         * Restart the animation cleanly.
         */
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                setTraceRunning(true);
            });
        });
    }

    const isTraceActive = Boolean(tracedNode);

    return (
        <main
            className={`min-h-screen bg-[#EFE9E1] text-[#322D29] transition-all duration-1000 ${traceRunning
                ? "bg-[#e9e0d6]"
                : ""
                }`}
        >
            {/* ============================================================
                NAVIGATION
            ============================================================ */}
            
<SiteHeader
    activePage="investigation"
    statusText={traceRunning ? "TRACE / ACTIVE" : "ETH / LIVE"}
    rightAction={
        <button
            type="button"
            onClick={resetGraph}
            className="flex h-10 items-center gap-2 rounded-[11px] bg-[#EFE9E1] px-4 text-[8px] font-bold tracking-[0.12em] text-[#322D29] transition hover:bg-[#72383D] hover:text-[#EFE9E1]"
        >
            <RotateCcw className="h-3 w-3" />
            RESET
        </button>
    }
/>

            {/* ============================================================
                CASE HEADER
            ============================================================ */}

            <section className="border-b border-[#322D29]/15 pt-32">
                <div className="mx-auto max-w-[1600px] px-6 pb-8 lg:px-10">
                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <div className="mb-4 flex items-center gap-3">
                                <a
                                    href="/"
                                    className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[#322D29]/35 transition hover:text-[#72383D]"
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                    BACK TO OVERVIEW
                                </a>

                                <span className="h-px w-8 bg-[#72383D]" />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <p className="font-mono text-[12px] font-bold tracking-[0.15em] text-[#72383D]">
                                    CASE / {rootWallet ? "LIVE" : "CG-001"}
                                </p>

                                <span
                                    className={`rounded-full border px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] transition-all duration-700 ${traceRunning
                                        ? "border-[#72383D]/50 bg-[#72383D] text-[#EFE9E1] shadow-[0_0_25px_rgba(114,56,61,0.25)]"
                                        : "border-[#72383D]/25 bg-[#72383D]/5 text-[#72383D]"
                                        }`}
                                >
                                    {traceRunning
                                        ? "TRACE IN PROGRESS"
                                        : "ANALYSIS ACTIVE"}
                                </span>
                            </div>

                            <h1 className="mt-4 text-5xl font-medium tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Investigation
                                <span className="text-[#72383D]">
                                    {" "}
                                    workspace.
                                </span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
                            <CaseStat
                                label="NETWORK"
                                value="ETHEREUM"
                            />

                            <CaseStat
                                label="HOPS"
                                value={
                                    tracedNode
                                        ? String(
                                            Math.max(
                                                tracePath.length -
                                                1,
                                                0,
                                            ),
                                        )
                                        : "2"
                                }
                            />

                            <CaseStat
                                label="NODES"
                                value={
                                    tracedNode
                                        ? String(
                                            tracePath.length,
                                        )
                                        : "6"
                                }
                            />

                            <CaseStat
                                label="TRANSACTIONS"
                                value={
                                    tracedNode
                                        ? String(
                                            traceEdges.length,
                                        )
                                        : "128"
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                WORKSPACE
            ============================================================ */}

            <section className="mx-auto max-w-[1600px] px-6 py-8 lg:px-10">
                <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                    {/* ========================================================
                        LEFT SIDEBAR
                    ======================================================== */}

                    <aside
                        className={`space-y-5 transition-all duration-1000 ${traceRunning
                            ? "translate-x-[2px]"
                            : ""
                            }`}
                    >
                        <div
                            className={`border bg-[#D9D9D9]/35 transition-all duration-700 ${traceRunning
                                ? "border-[#72383D]/30 shadow-[0_0_30px_rgba(114,56,61,0.08)]"
                                : "border-[#322D29]/15"
                                }`}
                        >
                            <div className="border-b border-[#322D29]/10 px-5 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-mono text-[11px] font-bold tracking-[0.15em]">
                                        CASE SUBJECT
                                    </p>

                                    <Wallet className="h-4 w-4 text-[#72383D]" />
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="font-mono text-[16px] font-medium">
                                    {nodes[0]?.address ?? "UNKNOWN"}
                                </p>

                                <p className="mt-2 text-[12px] leading-5 text-[#322D29]/40">
                                    Primary address under investigation
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <MetricBox
                                        label="TRANSACTIONS"
                                        value={String(nodes[0]?.transactions ?? 0)}
                                    />

                                    <MetricBox
                                        label="VOLUME"
                                        value={nodes[0]?.volume ?? "0 ETH"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#D9D9D9]/35">
                            <div className="border-b border-[#322D29]/10 px-5 py-4">
                                <p className="font-mono text-[11px] font-bold tracking-[0.15em]">
                                    SEARCH NETWORK
                                </p>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center border-b border-[#322D29]/20 pb-3 focus-within:border-[#72383D]">
                                    <Search className="mr-3 h-4 w-4 text-[#322D29]/30" />

                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search node..."
                                        className="w-full bg-transparent font-mono text-[12px] outline-none placeholder:text-[#322D29]/30"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#D9D9D9]/35">
                            <div className="border-b border-[#322D29]/10 px-5 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-mono text-[11px] font-bold tracking-[0.15em]">
                                        FILTER GRAPH
                                    </p>

                                    <ChevronDown className="h-4 w-4 text-[#322D29]/30" />
                                </div>
                            </div>

                            <div className="space-y-1 p-3">
                                {[
                                    "ALL",
                                    "WALLETS",
                                    "FLAGGED",
                                    "EXCHANGE",
                                ].map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() =>
                                            setActiveFilter(
                                                filter,
                                            )
                                        }
                                        className={`flex w-full items-center justify-between px-3 py-3 text-left text-[11px] font-bold tracking-[0.13em] transition ${activeFilter === filter
                                            ? "bg-[#322D29] text-[#EFE9E1]"
                                            : "text-[#322D29]/45 hover:bg-[#EFE9E1]"
                                            }`}
                                    >
                                        {filter}

                                        {filter ===
                                            "FLAGGED" && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#72383D]" />
                                            )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border border-[#322D29]/15 bg-[#D9D9D9]/35">
                            <div className="border-b border-[#322D29]/10 px-5 py-4">
                                <p className="font-mono text-[11px] font-bold tracking-[0.15em]">
                                    BEHAVIOUR
                                </p>
                            </div>

                            <div className="space-y-4 p-5">
                                <Behavior
                                    icon={<CircleAlert />}
                                    title="COUNTERPARTY CONCENTRATION"
                                    detail={nodes.length > 0 ? `${nodes.length}` : "0"}
                                />

                                <Behavior
                                    icon={<Activity />}
                                    title="FAILED TRANSACTIONS"
                                    detail="8.2%"
                                />

                                <Behavior
                                    icon={<GitBranch />}
                                    title="FORWARD MOVEMENT"
                                    detail={
                                        tracePath.includes(
                                            "flagged",
                                        )
                                            ? "DETECTED"
                                            : "OBSERVED"
                                    }
                                />
                            </div>
                        </div>
                    </aside>

                    {/* ========================================================
                        GRAPH AREA
                    ======================================================== */}

                    <div
                        ref={graphRef}
                        className={`relative min-h-[720px] overflow-hidden border bg-[#E8E2D9] transition-all duration-1000 ${traceRunning
                            ? "border-[#72383D]/35 shadow-[0_0_70px_rgba(114,56,61,0.12)]"
                            : "border-[#322D29]/15"
                            }`}
                    >
                        {/* trace activation overlay */}

                        {traceRunning && (
                            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                                <div className="trace-scan-line absolute left-0 right-0 h-[2px] bg-[#72383D]/45 shadow-[0_0_18px_rgba(114,56,61,0.65)]" />

                                <div className="absolute inset-0 animate-pulse bg-[#72383D]/[0.025]" />
                            </div>
                        )}

                        {/* graph header */}

                        <div
                            className={`absolute left-0 right-0 top-0 z-30 flex items-center justify-between border-b bg-[#E8E2D9]/90 px-5 py-4 backdrop-blur-md transition-all duration-700 ${traceRunning
                                ? "border-[#72383D]/20"
                                : "border-[#322D29]/10"
                                }`}
                        >
                            <div>
                                <div className="flex items-center gap-3">
                                    <p className="font-mono text-[11px] font-bold tracking-[0.15em]">
                                        TRANSACTION GRAPH
                                    </p>

                                    {traceRunning && (
                                        <span className="flex items-center gap-2 rounded-full border border-[#72383D]/25 bg-[#72383D]/10 px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.12em] text-[#72383D]">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#72383D]" />
                                            TRACE SCANNING
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[#322D29]/35">
                                    RELATIONSHIP VIEW /{" "}
                                    {tracedNode
                                        ? `${Math.max(
                                            tracePath.length -
                                            1,
                                            0,
                                        )} HOPS`
                                        : "2 HOPS"}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <GraphControl
                                    icon={<Minus />}
                                    onClick={() =>
                                        setZoom((value) =>
                                            Math.max(
                                                0.7,
                                                value - 0.1,
                                            ),
                                        )
                                    }
                                />

                                <span className="min-w-[48px] text-center font-mono text-[9px] text-[#322D29]/45">
                                    {Math.round(
                                        zoom * 100,
                                    )}
                                    %
                                </span>

                                <GraphControl
                                    icon={<Plus />}
                                    onClick={() =>
                                        setZoom((value) =>
                                            Math.min(
                                                1.5,
                                                value + 0.1,
                                            ),
                                        )
                                    }
                                />

                                <GraphControl
                                    icon={<Maximize2 />}
                                    onClick={() =>
                                        setZoom(1)
                                    }
                                />
                            </div>
                        </div>

                        {/* graph grid */}

                        <div
                            className={`absolute inset-0 opacity-[0.14] transition-opacity duration-1000 ${traceRunning
                                ? "opacity-[0.20]"
                                : ""
                                }`}
                            style={{
                                backgroundImage:
                                    "linear-gradient(#322D29 1px, transparent 1px), linear-gradient(90deg, #322D29 1px, transparent 1px)",
                                backgroundSize: "55px 55px",
                            }}
                        />

                        {/* graph */}

                        <div
                            className={`absolute inset-0 transition-transform duration-300 ${traceRunning
                                ? "trace-graph-active"
                                : ""
                                }`}
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin:
                                    "50% 52%",
                            }}
                        >
                            <svg
                                viewBox="0 0 900 720"
                                className="absolute inset-0 h-full w-full"
                                fill="none"
                            >
                                {graphEdges.map((edge) => {
                                    const from = nodes.find(
                                        (node) => node.id === edge.from,
                                    );
                                    const to = nodes.find(
                                        (node) => node.id === edge.to,
                                    );

                                    if (!from || !to) return null;

                                    const fromIndex = nodes.indexOf(from);
                                    const toIndex = nodes.indexOf(to);

                                    const point = (index: number) => {
                                        if (index === 0) {
                                            return { x: 450, y: 360 };
                                        }

                                        const angle =
                                            (index / Math.max(nodes.length - 1, 1)) *
                                            Math.PI *
                                            2;

                                        return {
                                            x: 450 + Math.cos(angle) * 300,
                                            y: 360 + Math.sin(angle) * 240,
                                        };
                                    };

                                    const p1 = point(fromIndex);
                                    const p2 = point(toIndex);

                                    return (
                                        <GraphLine
                                            key={edge.id}
                                            edgeId={edge.id}
                                            selected={
                                                selectedNode?.id === edge.from ||
                                                selectedNode?.id === edge.to ||
                                                tracedNode?.id === edge.from ||
                                                tracedNode?.id === edge.to
                                            }
                                            tracing={tracedEdgeIds.has(edge.id)}
                                            activeTrace={
                                                traceEdges[traceStep - 1] === edge.id
                                            }
                                            x1={String(p1.x)}
                                            y1={String(p1.y)}
                                            x2={String(p2.x)}
                                            y2={String(p2.y)}
                                            suspicious={from.suspicious || to.suspicious}
                                        />
                                    );
                                })}
                            </svg>

                            {searchedNodes.map((node) => (
                                <WorkspaceNode
                                    key={node.id}
                                    node={node}
                                    selected={
                                        selectedNode?.id ===
                                        node.id
                                    }
                                    traced={
                                        tracedNode?.id ===
                                        node.id ||
                                        tracedNodeIds.has(
                                            node.id,
                                        )
                                    }
                                    tracing={
                                        traceRunning &&
                                        tracedNodeIds.has(
                                            node.id,
                                        )
                                    }
                                    reached={
                                        tracedNodeIds.has(
                                            node.id,
                                        )
                                    }
                                    onClick={() => {
                                        setSelectedNode(node);
                                        setTracedNode(null);
                                        setTraceRunning(false);
                                        setTraceStep(0);
                                        setTracePath([]);
                                        setTraceEdges([]);
                                    }}
                                />
                            ))}
                        </div>

                        {/* trace progress */}

                        {traceRunning &&
                            tracePath.length > 0 && (
                                <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 border border-[#72383D]/25 bg-[#EFE9E1]/90 px-5 py-3 backdrop-blur-md">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#72383D]/50" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#72383D]" />
                                            </span>

                                            <span className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#72383D]">
                                                FOLLOWING PATH
                                            </span>
                                        </div>

                                        <span className="font-mono text-[9px] text-[#322D29]/35">
                                            {Math.min(
                                                traceStep,
                                                traceEdges.length,
                                            )}{" "}
                                            /{" "}
                                            {
                                                traceEdges.length
                                            }{" "}
                                            RELATIONSHIPS
                                        </span>
                                    </div>
                                </div>
                            )}

                        {/* legend */}

                        <div
                            className={`absolute bottom-5 left-5 z-20 flex flex-wrap items-center gap-5 border bg-[#EFE9E1]/85 px-4 py-3 backdrop-blur-md transition-all duration-700 ${traceRunning
                                ? "border-[#72383D]/30 shadow-[0_0_30px_rgba(114,56,61,0.12)]"
                                : "border-[#322D29]/10"
                                }`}
                        >
                            <LegendItem
                                type="subject"
                                label="SUBJECT"
                            />

                            <LegendItem
                                type="wallet"
                                label="WALLET"
                            />

                            <LegendItem
                                type="flagged"
                                label="FLAGGED"
                            />

                            <LegendItem
                                type="exchange"
                                label="EXCHANGE"
                            />
                        </div>

                        {/* ====================================================
                            DRAGGABLE NODE INSPECTOR
                        ==================================================== */}

                        {selectedNode &&
                            inspectorPosition && (
                                <div
                                    data-inspector
                                    className={`absolute z-40 w-[330px] border bg-[#EFE9E1]/95 shadow-[0_18px_55px_rgba(50,45,41,0.16)] backdrop-blur-xl transition-shadow duration-700 ${traceRunning &&
                                        tracedNode?.id ===
                                        selectedNode.id
                                        ? "border-[#72383D]/50 shadow-[0_0_45px_rgba(114,56,61,0.25),0_25px_70px_rgba(50,45,41,0.20)]"
                                        : "border-[#322D29]/15"
                                        } ${draggingInspector
                                            ? "cursor-grabbing shadow-[0_25px_70px_rgba(50,45,41,0.24)]"
                                            : ""
                                        }`}
                                    style={{
                                        left: inspectorPosition.x,
                                        top: inspectorPosition.y,
                                    }}
                                >
                                    {/* draggable header */}

                                    <div
                                        onPointerDown={
                                            startInspectorDrag
                                        }
                                        className={`flex items-center justify-between border-b border-[#322D29]/10 px-5 py-4 ${draggingInspector
                                            ? "cursor-grabbing"
                                            : "cursor-grab"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${selectedNode.suspicious
                                                    ? "bg-[#72383D]"
                                                    : "bg-[#AC9C8D]"
                                                    } ${traceRunning &&
                                                        tracedNode?.id ===
                                                        selectedNode.id
                                                        ? "animate-pulse shadow-[0_0_15px_rgba(114,56,61,0.75)]"
                                                        : ""
                                                    }`}
                                            />

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-mono text-[9px] font-bold tracking-[0.15em]">
                                                        NODE INSPECTION
                                                    </p>

                                                    {tracedNode?.id ===
                                                        selectedNode.id && (
                                                            <span
                                                                className={`rounded-full bg-[#72383D] px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.1em] text-[#EFE9E1] ${traceRunning
                                                                    ? "animate-pulse"
                                                                    : ""
                                                                    }`}
                                                            >
                                                                TRACE ACTIVE
                                                            </span>
                                                        )}
                                                </div>

                                                <p className="mt-1 text-[11px] text-[#322D29]/35">
                                                    {
                                                        selectedNode.relationship
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onPointerDown={(
                                                event,
                                            ) =>
                                                event.stopPropagation()
                                            }
                                            onClick={() =>
                                                setSelectedNode(
                                                    null,
                                                )
                                            }
                                            className="text-[#322D29]/30 transition hover:text-[#72383D]"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        <p className="font-mono text-xl tracking-[-0.04em]">
                                            {
                                                selectedNode.address
                                            }
                                        </p>

                                        {selectedNode.label && (
                                            <span
                                                className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] ${selectedNode.suspicious
                                                    ? "border-[#72383D]/30 bg-[#72383D]/5 text-[#72383D]"
                                                    : "border-[#322D29]/15 text-[#322D29]/45"
                                                    }`}
                                            >
                                                {
                                                    selectedNode.label
                                                }
                                            </span>
                                        )}

                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <MetricBox
                                                label="TRANSACTIONS"
                                                value={String(
                                                    selectedNode.transactions,
                                                )}
                                            />

                                            <MetricBox
                                                label="VOLUME"
                                                value={
                                                    selectedNode.volume
                                                }
                                            />
                                        </div>

                                        <div className="mt-3 border border-[#322D29]/10 px-4 py-3">
                                            <p className="font-mono text-[9px] tracking-[0.14em] text-[#322D29]/30">
                                                RELATIONSHIP
                                            </p>

                                            <p
                                                className={`mt-2 text-[12px] font-bold tracking-[0.1em] ${selectedNode.suspicious
                                                    ? "text-[#72383D]"
                                                    : ""
                                                    }`}
                                            >
                                                {
                                                    selectedNode.relationship
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={`flex items-center justify-between border-t px-5 py-4 transition-all duration-700 ${traceRunning &&
                                            tracedNode?.id ===
                                            selectedNode.id
                                            ? "border-[#72383D]/25 bg-[#72383D]/[0.035]"
                                            : "border-[#322D29]/10"
                                            }`}
                                    >
                                        <span className="font-mono text-[9px] tracking-[0.13em] text-[#322D29]/35">
                                            {traceRunning &&
                                                tracedNode?.id ===
                                                selectedNode.id
                                                ? `FOLLOWING ${Math.min(
                                                    traceStep,
                                                    traceEdges.length,
                                                )}/${traceEdges.length}`
                                                : isTraceActive &&
                                                    tracedNode?.id ===
                                                    selectedNode.id
                                                    ? "TRACE COMPLETE"
                                                    : "OBSERVABLE DATA"}
                                        </span>

                                        <button
                                            type="button"
                                            onPointerDown={(
                                                event,
                                            ) =>
                                                event.stopPropagation()
                                            }
                                            onClick={
                                                traceSelectedNode
                                            }
                                            className={`group flex items-center gap-2 rounded-[7px] px-3 py-2 text-[9px] font-bold tracking-[0.13em] transition-all duration-300 ${tracedNode?.id ===
                                                selectedNode.id
                                                ? traceRunning
                                                    ? "bg-[#72383D] text-[#EFE9E1] shadow-[0_0_25px_rgba(114,56,61,0.30)]"
                                                    : "bg-[#72383D]/10 text-[#72383D]"
                                                : "bg-[#72383D] text-[#EFE9E1] shadow-[0_8px_20px_rgba(114,56,61,0.20)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(114,56,61,0.30)]"
                                                }`}
                                        >
                                            {tracedNode?.id ===
                                                selectedNode.id
                                                ? traceRunning
                                                    ? "TRACING..."
                                                    : "TRACE AGAIN"
                                                : "TRACE NODE"}

                                            <ArrowRight
                                                className={`h-3 w-3 transition-transform ${traceRunning
                                                    ? "translate-x-1"
                                                    : "group-hover:translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* graph status */}

                        <div
                            className={`absolute right-5 top-[88px] z-20 border bg-[#EFE9E1]/80 px-4 py-3 backdrop-blur-md transition-all duration-700 ${traceRunning
                                ? "border-[#72383D]/30 bg-[#EFE9E1]/95 shadow-[0_0_30px_rgba(114,56,61,0.12)]"
                                : "border-[#322D29]/10"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Activity
                                    className={`h-3.5 w-3.5 text-[#72383D] ${traceRunning
                                        ? "animate-pulse"
                                        : ""
                                        }`}
                                />

                                <span className="font-mono text-[9px] font-bold tracking-[0.13em]">
                                    {
                                        searchedNodes.length
                                    }{" "}
                                    VISIBLE NODES
                                </span>
                            </div>
                        </div>

                        {/* active trace status */}

                        {tracedNode && (
                            <div
                                className={`absolute left-1/2 top-[88px] z-20 -translate-x-1/2 border bg-[#EFE9E1]/95 px-5 py-3.5 backdrop-blur-md transition-all duration-700 ${traceRunning
                                    ? "border-[#72383D]/45 shadow-[0_0_35px_rgba(114,56,61,0.20)]"
                                    : "border-[#72383D]/20 shadow-sm"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span
                                            className={`absolute inline-flex h-full w-full rounded-full bg-[#72383D]/50 ${traceRunning
                                                ? "animate-ping"
                                                : ""
                                                }`}
                                        />

                                        <span
                                            className={`relative inline-flex h-2.5 w-2.5 rounded-full bg-[#72383D] ${traceRunning
                                                ? "shadow-[0_0_15px_rgba(114,56,61,0.75)]"
                                                : ""
                                                }`}
                                        />
                                    </span>

                                    <div>
                                        <span className="font-mono text-[9px] font-bold tracking-[0.13em] text-[#72383D]">
                                            {traceRunning
                                                ? "TRACE IN PROGRESS"
                                                : "TRACE COMPLETE"}
                                        </span>

                                        <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[#322D29]/40">
                                            {
                                                tracedNode.address
                                            }{" "}
                                            /{" "}
                                            {traceRunning
                                                ? `FOLLOWING ${Math.min(
                                                    traceStep,
                                                    traceEdges.length,
                                                )} RELATIONSHIPS`
                                                : `${tracePath.length} NODES / ${traceEdges.length} RELATIONSHIPS`}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTracedNode(
                                                null,
                                            );
                                            setTraceRunning(
                                                false,
                                            );
                                            setTraceStep(0);
                                            setTracePath([]);
                                            setTraceEdges([]);
                                        }}
                                        className="ml-2 text-[#322D29]/30 transition hover:text-[#72383D]"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================================================
                TRANSACTION TRAIL
            ============================================================ */}

            <section
                className={`border-t bg-[#322D29] text-[#EFE9E1] transition-all duration-1000 ${traceRunning
                    ? "border-[#72383D]/40 shadow-[inset_0_8px_50px_rgba(114,56,61,0.10)]"
                    : "border-[#322D29]/15"
                    }`}
            >
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[11px] text-[#AC9C8D]">
                                02 / TRANSACTION TRAIL
                            </p>

                            <h2 className="mt-6 max-w-lg text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Follow the movement.
                            </h2>

                            <p className="mt-7 max-w-md text-sm leading-7 text-[#EFE9E1]/45">
                                Transactions become meaningful when
                                viewed as a sequence. Follow the
                                movement between counterparties and
                                inspect the relationships that form
                                the financial trail.
                            </p>

                            <div
                                className={`mt-10 flex items-center gap-3 transition-all duration-700 ${traceRunning
                                    ? "translate-x-2"
                                    : ""
                                    }`}
                            >
                                <div
                                    className={`flex h-9 w-9 items-center justify-center border transition-all duration-700 ${traceRunning
                                        ? "border-[#AC9C8D]/50 bg-[#72383D]/20 shadow-[0_0_25px_rgba(172,156,141,0.12)]"
                                        : "border-[#EFE9E1]/15"
                                        }`}
                                >
                                    <Zap
                                        className={`h-4 w-4 text-[#AC9C8D] ${traceRunning
                                            ? "animate-pulse"
                                            : ""
                                            }`}
                                    />
                                </div>

                                <div>
                                    <p className="text-[9px] font-bold tracking-[0.14em]">
                                        ACTIVE TRACE
                                    </p>

                                    <p className="mt-1 font-mono text-[9px] text-[#EFE9E1]/35">
                                        {tracedNode
                                            ? `${traceEdges.length} GRAPH RELATIONSHIPS`
                                            : "4 TRANSACTION EVENTS"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#EFE9E1]/15">
                            {activeTrail.map(
                                (item, index) => (
                                    <TrailRow
                                        key={`${item.time}-${index}`}
                                        {...item}
                                        traceActive={
                                            traceRunning
                                        }
                                        index={index}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                FINDINGS
            ============================================================ */}

            <section
                className={`bg-[#EFE9E1] transition-all duration-1000 ${traceRunning
                    ? "shadow-[inset_0_15px_45px_rgba(114,56,61,0.05)]"
                    : ""
                    }`}
            >
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[11px] text-[#72383D]">
                                03 / FINDINGS
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Signals worth investigating.
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-7 text-[#322D29]/45">
                                Observed indicators are presented with
                                the underlying blockchain activity that
                                produced them.
                            </p>
                        </div>

                        <div className="border-t border-[#322D29]/15">
                            {activeFindings.map(
                                (finding) => (
                                    <Finding
                                        key={
                                            finding.number
                                        }
                                        {...finding}
                                        traceActive={
                                            traceRunning
                                        }
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                EVIDENCE
            ============================================================ */}

            <section
                className={`border-t border-[#322D29]/15 bg-[#D9D9D9]/35 transition-all duration-1000 ${traceRunning
                    ? "bg-[#d6d0c8]"
                    : ""
                    }`}
            >
                <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
                    <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
                        <div>
                            <p className="font-mono text-[11px] text-[#72383D]">
                                04 / EVIDENCE
                            </p>

                            <h2 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                                Build from the trail.
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-7 text-[#322D29]/45">
                                Each finding can be traced back to
                                observable transactions, addresses and
                                relationships within the investigation.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {activeEvidence.map(
                                (evidence) => (
                                    <EvidenceCard
                                        key={
                                            evidence.title
                                        }
                                        {...evidence}
                                        traceActive={
                                            traceRunning
                                        }
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="pt-5">
                <Link
                    href="/evidence"
                    className="group inline-flex items-center gap-3 bg-[#72383D] px-5 py-3.5 text-[9px] font-bold tracking-[0.14em] text-[#EFE9E1] shadow-[0_8px_20px_rgba(114,56,61,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#322D29] hover:shadow-[0_12px_30px_rgba(50,45,41,0.20)]"
                >
                    VIEW EVIDENCE
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <footer
                className={`bg-[#292522] text-[#EFE9E1] transition-all duration-1000 ${traceRunning
                    ? "shadow-[inset_0_8px_35px_rgba(114,56,61,0.12)]"
                    : ""
                    }`}
            >
                <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-6 py-9 text-[9px] font-semibold tracking-[0.17em] text-[#EFE9E1]/35 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                    <span>
                        CRYPTOGRAPH / INVESTIGATION WORKSPACE
                    </span>

                    <span>
                        ETHEREUM / CASE CG-001
                    </span>

                    <span>
                        OBSERVE · TRACE · DOCUMENT
                    </span>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes traceScan {
                    0% {
                        transform: translateY(0);
                        opacity: 0;
                    }

                    10% {
                        opacity: 1;
                    }

                    85% {
                        opacity: 1;
                    }

                    100% {
                        transform: translateY(720px);
                        opacity: 0;
                    }
                }

                @keyframes traceDash {
                    0% {
                        stroke-dashoffset: 0;
                    }

                    100% {
                        stroke-dashoffset: -40;
                    }
                }

                @keyframes traceGraphPulse {
                    0%,
                    100% {
                        filter: brightness(1);
                    }

                    45% {
                        filter: brightness(1.045);
                    }
                }

                @keyframes traceNodeArrival {
                    0% {
                        transform: scale(0.85);
                        opacity: 0.35;
                    }

                    55% {
                        transform: scale(1.16);
                        opacity: 1;
                    }

                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes traceArrivalRing {
                    0% {
                        transform: scale(0.55);
                        opacity: 0.8;
                    }

                    100% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }

                .trace-scan-line {
                    animation: traceScan 4.8s ease-in-out 0.15s 1;
                }

                .trace-dash-active {
                    animation: traceDash 1.2s linear infinite;
                }

                .trace-graph-active {
                    animation: traceGraphPulse 2.2s ease-in-out infinite;
                }

                .trace-node-arrival {
                    animation: traceNodeArrival 0.75s ease-out;
                }

                .trace-arrival-ring {
                    animation: traceArrivalRing 0.9s ease-out;
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
   METRIC BOX
================================================================ */

function MetricBox({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="border border-[#322D29]/10 bg-[#EFE9E1]/50 p-3">
            <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#322D29]/30">
                {label}
            </p>

            <p className="mt-2 font-mono text-[12px] font-bold">
                {value}
            </p>
        </div>
    );
}

/* ================================================================
   GRAPH CONTROL
================================================================ */

function GraphControl({
    icon,
    onClick,
}: {
    icon: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-8 w-8 items-center justify-center border border-[#322D29]/10 bg-[#EFE9E1]/70 text-[#322D29]/45 transition hover:border-[#72383D]/30 hover:text-[#72383D]"
        >
            <span className="h-3.5 w-3.5">
                {icon}
            </span>
        </button>
    );
}

/* ================================================================
   GRAPH LINE
================================================================ */

function GraphLine({
    x1,
    y1,
    x2,
    y2,
    selected,
    suspicious = false,
    tracing = false,
    activeTrace = false,
}: {
    edgeId: string;
    x1: string;
    y1: string;
    x2: string;
    y2: string;
    selected: boolean;
    suspicious?: boolean;
    tracing?: boolean;
    activeTrace?: boolean;
}) {
    return (
        <>
            <path
                d={`M${x1} ${y1} L${x2} ${y2}`}
                stroke={
                    selected || suspicious
                        ? "#72383D"
                        : "#AC9C8D"
                }
                strokeWidth={
                    activeTrace
                        ? "5"
                        : tracing
                            ? "3"
                            : selected || suspicious
                                ? "2.5"
                                : "1"
                }
                strokeDasharray={
                    suspicious ? "6 5" : undefined
                }
                className={`transition-all duration-700 ${tracing
                    ? "opacity-100"
                    : ""
                    }`}
            />

            {tracing && (
                <path
                    d={`M${x1} ${y1} L${x2} ${y2}`}
                    stroke="#72383D"
                    strokeWidth={
                        activeTrace ? "11" : "8"
                    }
                    strokeLinecap="round"
                    opacity={
                        activeTrace ? "0.13" : "0.07"
                    }
                    className="animate-pulse"
                />
            )}

            {activeTrace && (
                <>
                    <circle
                        r="9"
                        fill="#72383D"
                        opacity="0.12"
                    >
                        <animateMotion
                            dur="1.2s"
                            repeatCount="indefinite"
                            path={`M${x1} ${y1} L${x2} ${y2}`}
                        />
                    </circle>

                    <circle
                        r="6"
                        fill="#72383D"
                        opacity="0.95"
                    >
                        <animateMotion
                            dur="1.2s"
                            repeatCount="indefinite"
                            path={`M${x1} ${y1} L${x2} ${y2}`}
                        />
                    </circle>

                    <circle
                        r="2.5"
                        fill="#EFE9E1"
                        opacity="1"
                    >
                        <animateMotion
                            dur="1.2s"
                            begin="0.08s"
                            repeatCount="indefinite"
                            path={`M${x1} ${y1} L${x2} ${y2}`}
                        />
                    </circle>
                </>
            )}
        </>
    );
}

/* ================================================================
   WORKSPACE NODE
================================================================ */

function WorkspaceNode({
    node,
    selected,
    traced,
    tracing,
    reached,
    onClick,
}: {
    node: NodeData;
    selected: boolean;
    traced: boolean;
    tracing: boolean;
    reached: boolean;
    onClick: () => void;
}) {
    const sizes = {
        subject: "h-[104px] w-[104px]",
        wallet: "h-14 w-14",
        exchange: "h-[68px] w-[68px]",
        contract: "h-14 w-14",
    };

    const isActiveTraceNode =
        traced && tracing;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group absolute ${node.position} z-20 -translate-x-1/2 -translate-y-1/2 outline-none ${isActiveTraceNode
                ? "trace-node-active"
                : ""
                }`}
            aria-label={`Inspect ${node.address}`}
        >
            {/* trace arrival ring */}

            {reached && tracing && (
                <span className="trace-arrival-ring absolute -inset-8 rounded-full border-2 border-[#72383D]/35" />
            )}

            {/* trace halo */}

            {traced && (
                <>
                    <span
                        className={`absolute -inset-8 rounded-full border border-[#72383D]/40 ${tracing
                            ? "animate-ping"
                            : "animate-pulse"
                            }`}
                    />

                    {tracing && (
                        <span className="absolute -inset-14 rounded-full border border-[#72383D]/15 animate-pulse" />
                    )}
                </>
            )}

            {/* hover halo */}

            <span
                className={`absolute -inset-5 rounded-full border transition-all duration-300 ${selected
                    ? "scale-100 border-[#72383D]/45 opacity-100"
                    : "scale-75 border-transparent opacity-0 group-hover:scale-100 group-hover:border-[#72383D]/25 group-hover:opacity-100"
                    }`}
            />

            {/* node */}

            <span
                className={`relative flex items-center justify-center rounded-full transition-all duration-700 ${sizes[node.type]
                    } ${selected
                        ? "border-2 border-[#72383D] bg-[#EFE9E1] shadow-[0_0_0_7px_rgba(114,56,61,0.10)]"
                        : node.suspicious
                            ? "border-2 border-[#72383D] bg-[#72383D]"
                            : node.type === "subject"
                                ? "border-2 border-[#72383D] bg-[#EFE9E1]"
                                : "border border-[#AC9C8D] bg-[#EFE9E1]"
                    } ${tracing && traced
                        ? "scale-110 shadow-[0_0_0_12px_rgba(114,56,61,0.08),0_0_45px_rgba(114,56,61,0.28)]"
                        : reached
                            ? "border-[#72383D]/70 shadow-[0_0_0_6px_rgba(114,56,61,0.06)]"
                            : ""
                    } group-hover:-translate-y-1`}
            >
                <span
                    className={`rounded-full ${node.type === "subject"
                        ? "h-6 w-6"
                        : node.type === "exchange"
                            ? "h-4 w-4"
                            : "h-3 w-3"
                        } ${node.suspicious
                            ? "bg-[#EFE9E1]"
                            : selected ||
                                node.type ===
                                "subject"
                                ? "bg-[#72383D]"
                                : reached
                                    ? "bg-[#72383D]"
                                    : "bg-[#AC9C8D]"
                        } ${tracing && traced
                            ? "animate-pulse shadow-[0_0_20px_rgba(114,56,61,0.65)]"
                            : ""
                        }`}
                />

                {(selected ||
                    node.type === "subject") && (
                        <span className="absolute -inset-3 rounded-full border border-[#72383D]/20" />
                    )}
            </span>

            {/* label */}

            {node.label && (
                <span
                    className={`absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold tracking-[0.15em] transition-all duration-500 ${node.suspicious ||
                        selected ||
                        traced
                        ? "text-[#72383D]"
                        : "text-[#322D29]/55"
                        } ${tracing && traced
                            ? "scale-110"
                            : ""
                        }`}
                >
                    {node.label}
                </span>
            )}

            {/* address */}

            <span
                className={`absolute left-1/2 top-full mt-9 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] transition-all duration-500 ${reached
                    ? "text-[#72383D]/75"
                    : "text-[#322D29]/35"
                    }`}
            >
                {node.address}
            </span>
        </button>
    );
}

/* ================================================================
   LEGEND
================================================================ */

function LegendItem({
    type,
    label,
}: {
    type:
    | "subject"
    | "wallet"
    | "flagged"
    | "exchange";
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`h-2.5 w-2.5 rounded-full ${type === "flagged"
                    ? "bg-[#72383D]"
                    : type === "subject"
                        ? "border-2 border-[#72383D] bg-[#EFE9E1]"
                        : "border border-[#AC9C8D] bg-[#EFE9E1]"
                    }`}
            />

            <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-[#322D29]/45">
                {label}
            </span>
        </div>
    );
}

/* ================================================================
   BEHAVIOR
================================================================ */

function Behavior({
    icon,
    title,
    detail,
}: {
    icon: React.ReactNode;
    title: string;
    detail: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="h-4 w-4 text-[#72383D]">
                    {icon}
                </span>

                <span className="max-w-[150px] text-[9px] font-bold leading-4 tracking-[0.08em]">
                    {title}
                </span>
            </div>

            <span className="font-mono text-[9px] text-[#72383D]">
                {detail}
            </span>
        </div>
    );
}

/* ================================================================
   TRAIL ROW
================================================================ */

function TrailRow({
    time,
    amount,
    from,
    to,
    note,
    highlighted = false,
    traceActive = false,
    index = 0,
}: {
    time: string;
    amount: string;
    from: string;
    to: string;
    note: string;
    highlighted?: boolean;
    traceActive?: boolean;
    index?: number;
}) {
    return (
        <div
            className={`group grid gap-5 border-b border-[#EFE9E1]/10 py-7 transition-all duration-700 sm:grid-cols-[100px_1fr_220px] sm:items-center ${traceActive
                ? "border-[#AC9C8D]/20"
                : ""
                }`}
            style={{
                transitionDelay: traceActive
                    ? `${index * 110}ms`
                    : "0ms",
            }}
        >
            <div>
                <p className="font-mono text-[9px] text-[#EFE9E1]/30">
                    {time} UTC
                </p>

                <p
                    className={`mt-2 text-lg font-medium ${highlighted
                        ? "text-[#AC9C8D]"
                        : ""
                        } ${traceActive
                            ? "text-[#EFE9E1]"
                            : ""
                        }`}
                >
                    {amount}
                </p>
            </div>

            <div className="font-mono text-[11px] leading-7">
                <p className="text-[#EFE9E1]/60">
                    {from}
                </p>

                <p className="text-[#AC9C8D]">
                    ↓
                </p>

                <p className="text-[#EFE9E1]/60">
                    {to}
                </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end sm:gap-5">
                <span
                    className={`text-[9px] font-bold tracking-[0.14em] ${highlighted
                        ? "text-[#AC9C8D]"
                        : "text-[#EFE9E1]/30"
                        } ${traceActive
                            ? "text-[#AC9C8D]"
                            : ""
                        }`}
                >
                    {note}
                </span>

                <ArrowRight
                    className={`h-3.5 w-3.5 text-[#EFE9E1]/20 transition group-hover:translate-x-1 group-hover:text-[#AC9C8D] ${traceActive
                        ? "translate-x-1 text-[#AC9C8D]"
                        : ""
                        }`}
                />
            </div>
        </div>
    );
}

/* ================================================================
   FINDING
================================================================ */

function Finding({
    number,
    icon,
    title,
    detail,
    value,
    traceActive = false,
}: {
    number: string;
    icon: React.ReactNode;
    title: string;
    detail: string;
    value: string;
    traceActive?: boolean;
}) {
    return (
        <div
            className={`grid gap-5 border-b border-[#322D29]/15 py-7 transition-all duration-700 sm:grid-cols-[50px_40px_1fr_auto] sm:items-center ${traceActive
                ? "translate-x-1 border-[#72383D]/20"
                : ""
                }`}
        >
            <span className="font-mono text-[9px] text-[#72383D]">
                {number}
            </span>

            <span
                className={`h-5 w-5 text-[#72383D] ${traceActive
                    ? "animate-pulse"
                    : ""
                    }`}
            >
                {icon}
            </span>

            <div>
                <p className="text-[12px] font-bold tracking-[0.12em]">
                    {title}
                </p>

                <p className="mt-2 max-w-xl text-[12px] leading-5 text-[#322D29]/40">
                    {detail}
                </p>
            </div>

            <span
                className={`font-mono text-[12px] font-bold text-[#72383D] ${traceActive
                    ? "animate-pulse"
                    : ""
                    }`}
            >
                {value}
            </span>
        </div>
    );
}

/* ================================================================
   EVIDENCE CARD
================================================================ */

function EvidenceCard({
    icon,
    title,
    detail,
    traceActive = false,
}: {
    icon: React.ReactNode;
    title: string;
    detail: string;
    traceActive?: boolean;
}) {
    return (
        <div
            className={`group flex items-center justify-between border bg-[#EFE9E1]/45 p-5 transition-all duration-700 hover:border-[#72383D]/30 hover:bg-[#EFE9E1] ${traceActive
                ? "translate-x-1 border-[#72383D]/25 bg-[#EFE9E1]/70 shadow-[0_8px_30px_rgba(114,56,61,0.06)]"
                : "border-[#322D29]/15"
                }`}
        >
            <div className="flex items-center gap-5">
                <div
                    className={`flex h-10 w-10 items-center justify-center border text-[#72383D] transition-all duration-700 ${traceActive
                        ? "border-[#72383D]/30 shadow-[0_0_20px_rgba(114,56,61,0.12)]"
                        : "border-[#322D29]/10"
                        }`}
                >
                    <span
                        className={`h-4 w-4 ${traceActive
                            ? "animate-pulse"
                            : ""
                            }`}
                    >
                        {icon}
                    </span>
                </div>

                <div>
                    <p className="text-[12px] font-bold tracking-[0.12em]">
                        {title}
                    </p>

                    <p className="mt-2 text-[12px] text-[#322D29]/40">
                        {detail}
                    </p>
                </div>
            </div>

            <ArrowRight
                className={`h-4 w-4 text-[#322D29]/25 transition group-hover:translate-x-1 group-hover:text-[#72383D] ${traceActive
                    ? "translate-x-1 text-[#72383D]"
                    : ""
                    }`}
            />
        </div>
    );
}