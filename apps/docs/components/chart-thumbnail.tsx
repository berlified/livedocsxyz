"use client";

const C1 = "var(--chart-1)";
const C2 = "var(--chart-2)";
const C3 = "var(--chart-3)";
const C4 = "var(--chart-4)";
const MUTED = "var(--muted-foreground)";
const TRACK = "var(--muted)";
const GRID = "var(--border)";
const BAD = "var(--destructive)";

function Grid() {
  return (
    <g stroke={GRID} strokeWidth={1} strokeDasharray="3 3">
      <line x1={0} y1={18} x2={144} y2={18} />
      <line x1={0} y1={36} x2={144} y2={36} />
      <line x1={0} y1={54} x2={144} y2={54} />
    </g>
  );
}

function Bars({ values, color = C1, y0 = 64 }: { values: number[]; color?: string; y0?: number }) {
  const w = 10;
  const gap = (144 - 16 - values.length * w) / (values.length - 1);
  return (
    <g fill={color}>
      {values.map((value, index) => {
        const h = Math.max(3, value);
        const x = 8 + index * (w + gap);
        return <rect key={index} x={x} y={y0 - h} width={w} height={h} rx={2.5} />;
      })}
    </g>
  );
}

const glyphs: Record<string, React.ReactNode> = {
  area: (
    <g>
      <Grid />
      <path d="M0,52 C18,44 26,30 42,34 C58,38 64,48 80,42 C96,36 104,20 122,22 L144,18 L144,64 L0,64 Z" fill={C1} opacity={0.25} />
      <path d="M0,52 C18,44 26,30 42,34 C58,38 64,48 80,42 C96,36 104,20 122,22 L144,18" fill="none" stroke={C1} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  ),
  line: (
    <g fill="none" strokeLinecap="round">
      <Grid />
      <path d="M4,50 C22,44 30,26 48,30 C66,34 72,46 90,40 C108,34 118,22 140,24" stroke={C1} strokeWidth={2.5} />
      <path d="M4,58 C26,56 40,48 60,50 C84,52 100,44 140,42" stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 4" />
    </g>
  ),
  bar: (
    <g>
      <Grid />
      <Bars values={[22, 40, 28, 48, 34, 54, 30]} />
    </g>
  ),
  composed: (
    <g>
      <Grid />
      <Bars values={[20, 30, 24, 36, 28, 40]} />
      <path d="M4,44 C26,40 40,28 62,30 C86,32 104,20 140,22" fill="none" stroke={C2} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  ),
  pie: (
    <g stroke="var(--background)" strokeWidth={2}>
      <path d="M72,36 L72,12 A24,24 0 0,1 86.1,55.4 Z" fill={C1} />
      <path d="M72,36 L86.1,55.4 A24,24 0 0,1 49.2,43.4 Z" fill={C2} />
      <path d="M72,36 L49.2,43.4 A24,24 0 0,1 72,12 Z" fill={C3} />
    </g>
  ),
  ring: (
    <g fill="none" strokeLinecap="round" transform="rotate(-90 72 36)">
      <circle cx={72} cy={36} r={22} stroke={TRACK} strokeWidth={11} />
      <circle cx={72} cy={36} r={22} stroke={C1} strokeWidth={11} pathLength={100} strokeDasharray="68 100" />
      <circle cx={72} cy={36} r={22} stroke={C2} strokeWidth={11} pathLength={100} strokeDasharray="18 100" strokeDashoffset={-70} />
    </g>
  ),
  radar: (
    <g>
      <polygon points="72,10 96,28 89,56 55,56 48,28" fill="none" stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
      <polygon points="72,18 88,32 83,50 61,50 56,32" fill={C1} opacity={0.22} stroke={C1} strokeWidth={2} strokeLinejoin="round" />
      <polygon points="72,24 82,33 78,45 66,45 62,33" fill="none" stroke={C2} strokeWidth={1.5} />
    </g>
  ),
  radial: (
    <g fill="none" strokeLinecap="round" transform="rotate(90 72 36)">
      <circle cx={72} cy={36} r={26} stroke={TRACK} strokeWidth={7} />
      <circle cx={72} cy={36} r={26} stroke={C1} strokeWidth={7} pathLength={100} strokeDasharray="72 100" />
      <circle cx={72} cy={36} r={17} stroke={TRACK} strokeWidth={7} />
      <circle cx={72} cy={36} r={17} stroke={C2} strokeWidth={7} pathLength={100} strokeDasharray="48 100" />
      <circle cx={72} cy={36} r={8} stroke={TRACK} strokeWidth={7} />
      <circle cx={72} cy={36} r={8} stroke={C3} strokeWidth={7} pathLength={100} strokeDasharray="80 100" />
    </g>
  ),
  sankey: (
    <g>
      <path d="M30,10 C70,10 70,30 114,30 L114,40 C70,40 70,20 30,20 Z" fill={C1} opacity={0.55} />
      <path d="M30,34 C70,34 70,50 114,50 L114,60 C70,60 70,44 30,44 Z" fill={C2} opacity={0.55} />
      <rect x={22} y={6} width={8} height={52} rx={3} fill={C1} />
      <rect x={114} y={26} width={8} height={38} rx={3} fill={C2} />
    </g>
  ),
  trend: (
    <g fill="none" strokeLinecap="round">
      <Grid />
      <path d="M4,56 C24,54 30,40 48,42 C66,44 74,30 94,28 C112,26 124,18 140,16" stroke={C1} strokeWidth={2.5} />
      <circle cx={140} cy={16} r={3.5} fill={C1} />
      <path d="M4,60 C30,60 60,56 90,56 C110,56 126,54 140,54" stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 4" />
    </g>
  ),
  comparison: (
    <g>
      <Grid />
      <path d="M0,48 C30,44 60,30 90,32 C112,33 128,26 144,28 L144,64 L0,64 Z" fill={C2} opacity={0.3} />
      <path d="M0,56 C30,54 60,44 90,42 C114,40 130,36 144,34 L144,64 L0,64 Z" fill={C1} opacity={0.35} />
      <path d="M0,48 C30,44 60,30 90,32 C112,33 128,26 144,28" fill="none" stroke={C2} strokeWidth={2} strokeLinecap="round" />
      <path d="M0,56 C30,54 60,44 90,42 C114,40 130,36 144,34" fill="none" stroke={C1} strokeWidth={2} strokeLinecap="round" />
    </g>
  ),
  breakdown: (
    <g>
      <rect x={8} y={14} width={128} height={16} rx={8} fill={TRACK} />
      <rect x={8} y={14} width={62} height={16} rx={8} fill={C1} />
      <rect x={70} y={14} width={34} height={16} fill={C2} />
      <rect x={104} y={14} width={20} height={16} fill={C4} />
      <rect x={124} y={14} width={12} height={16} rx={0} fill={BAD} />
      <g fontSize={9} fill={MUTED}>
        <circle cx={12} cy={44} r={3} fill={C1} /><circle cx={12} cy={58} r={3} fill={C2} />
      </g>
      <line x1={24} y1={44} x2={60} y2={44} stroke={MUTED} strokeWidth={4} strokeLinecap="round" />
      <line x1={24} y1={58} x2={48} y2={58} stroke={MUTED} strokeWidth={4} strokeLinecap="round" />
      <line x1={100} y1={44} x2={132} y2={44} stroke={C1} strokeWidth={4} strokeLinecap="round" />
      <line x1={100} y1={58} x2={124} y2={58} stroke={C1} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  range: (
    <g>
      <Grid />
      <path d="M0,44 C30,38 60,30 90,32 C112,33 130,28 144,26 L144,52 C130,54 112,57 90,56 C60,54 30,58 0,60 Z" fill={C1} opacity={0.25} />
      <path d="M0,52 C30,48 60,42 90,44 C112,45 130,41 144,39" fill="none" stroke={C1} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  ),
  country: (
    <g>
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect x={8} y={10 + row * 20} width={128} height={9} rx={4.5} fill={TRACK} />
          <rect x={8} y={10 + row * 20} width={[96, 68, 44][row]!} height={9} rx={4.5} fill={C1} />
          <rect x={[70, 52, 60][row]! - 1.5} y={7 + row * 20} width={3} height={15} rx={1.5} fill="var(--foreground)" />
        </g>
      ))}
    </g>
  ),
  cashflow: (
    <g>
      <line x1={0} y1={36} x2={144} y2={36} stroke={GRID} strokeWidth={1} />
      <g>
        {[18, 34, 8, 26, 14, 30].map((h, i) => (
          <rect key={i} x={10 + i * 21} y={36 - h} width={12} height={h} rx={2.5} fill={C1} />
        ))}
        {[12, 22, 10, 18, 26, 12].map((h, i) => (
          <rect key={i} x={10 + i * 21} y={36} width={12} height={h} rx={2.5} fill={C2} opacity={0.75} />
        ))}
      </g>
    </g>
  ),
  spotlight: (
    <g>
      <Grid />
      <path d="M0,54 C24,50 36,34 56,34 C76,34 84,44 104,30 C118,20 130,22 144,18 L144,64 L0,64 Z" fill={C1} opacity={0.2} />
      <path d="M0,54 C24,50 36,34 56,34 C76,34 84,44 104,30 C118,20 130,22 144,18" fill="none" stroke={C1} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={104} cy={30} r={6} fill="none" stroke={C1} strokeWidth={2} />
      <circle cx={104} cy={30} r={2.5} fill={C1} />
    </g>
  ),
  lane: (
    <g>
      {[14, 36, 58].map((y, row) => (
        <g key={row}>
          <line x1={8} y1={y} x2={136} y2={y} stroke={TRACK} strokeWidth={8} strokeLinecap="round" />
          <line x1={8} y1={y} x2={[90, 60, 110][row]!} y2={y} stroke={[C1, C2, C4][row]!} strokeWidth={8} strokeLinecap="round" />
          <circle cx={[90, 60, 110][row]!} cy={y} r={4} fill="var(--background)" stroke={[C1, C2, C4][row]!} strokeWidth={2.5} />
        </g>
      ))}
    </g>
  ),
  usage: (
    <g>
      <rect x={8} y={26} width={128} height={14} rx={7} fill={TRACK} />
      <rect x={8} y={26} width={84} height={14} rx={7} fill={C1} />
      <circle cx={92} cy={33} r={8} fill={C1} stroke="var(--background)" strokeWidth={2.5} />
      <line x1={20} y1={52} x2={60} y2={52} stroke={MUTED} strokeWidth={4} strokeLinecap="round" />
      <line x1={110} y1={52} x2={132} y2={52} stroke={C1} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  heatmap: (
    <g>
      {Array.from({ length: 12 }, (_, col) =>
        Array.from({ length: 5 }, (_, row) => {
          const level = (col * 7 + row * 3 + col * row) % 5;
          return (
            <rect
              key={`${col}-${row}`}
              x={10 + col * 11}
              y={6 + row * 12}
              width={8}
              height={9}
              rx={2}
              fill={level === 0 ? TRACK : "var(--chart-heat-3)"}
              opacity={level === 0 ? 1 : 0.25 + level * 0.18}
            />
          );
        })
      )}
    </g>
  ),
  funnel: (
    <g>
      {[
        "M28,8 L116,8 L108,22 L36,22 Z",
        "M36,24 L108,24 L100,38 L44,38 Z",
        "M44,40 L100,40 L94,54 L50,54 Z",
        "M50,56 L94,56 L94,64 L50,64 Z",
      ].map((d, i) => (
        <path key={i} d={d} fill={C2} opacity={0.95 - i * 0.18} stroke="var(--background)" strokeWidth={1.5} />
      ))}
    </g>
  ),
  scatter: (
    <g>
      <Grid />
      {[[16, 48, 3], [34, 38, 4.5], [52, 44, 3], [70, 28, 5], [88, 34, 3.5], [106, 20, 4], [124, 26, 5.5], [44, 54, 3], [96, 50, 3], [120, 44, 3.5]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 3 === 2 ? C2 : C1} opacity={0.85} />
      ))}
    </g>
  ),
  waterfall: (
    <g>
      <rect x={12} y={40} width={16} height={16} rx={2.5} fill={C2} />
      <rect x={32} y={28} width={16} height={12} rx={2.5} fill={C2} />
      <rect x={52} y={28} width={16} height={20} rx={2.5} fill={BAD} />
      <rect x={72} y={40} width={16} height={16} rx={2.5} fill={C2} />
      <rect x={92} y={32} width={16} height={8} rx={2.5} fill={C2} />
      <rect x={112} y={20} width={16} height={20} rx={2.5} fill={C1} />
    </g>
  ),
  candle: (
    <g strokeLinecap="round">
      {[
        { x: 24, high: 14, low: 52, open: 24, close: 40, up: true },
        { x: 56, high: 20, low: 58, open: 44, close: 28, up: false },
        { x: 88, high: 12, low: 46, open: 22, close: 38, up: true },
        { x: 120, high: 26, low: 60, open: 50, close: 34, up: false },
      ].map((c, i) => (
        <g key={i}>
          <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={c.up ? "var(--chart-up)" : BAD} strokeWidth={1.5} />
          <rect x={c.x - 5} y={Math.min(c.open, c.close)} width={10} height={Math.max(4, Math.abs(c.close - c.open))} rx={2} fill={c.up ? "var(--chart-up)" : BAD} />
        </g>
      ))}
    </g>
  ),
  spark: (
    <g fill="none" strokeLinecap="round">
      <path d="M4,52 C20,50 26,38 40,40 C54,42 60,28 76,28 C92,28 98,40 112,34 C124,29 132,24 140,22" stroke={C1} strokeWidth={2} />
      <circle cx={140} cy={22} r={3} fill={C1} stroke="none" />
    </g>
  ),
  live: (
    <g>
      <Grid />
      <path d="M0,50 C20,48 28,34 46,36 C64,38 70,46 88,40 C106,34 118,22 140,24 L140,64 L0,64 Z" fill={C1} opacity={0.25} />
      <path d="M0,50 C20,48 28,34 46,36 C64,38 70,46 88,40 C106,34 118,22 140,24" fill="none" stroke={C1} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={140} cy={24} r={3.5} fill={C1} stroke="var(--background)" strokeWidth={1.5} />
      <circle cx={118} cy={30} r={2} fill={C2} />
    </g>
  ),
  book: (
    <g fontSize={8} fontFamily="monospace">
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect x={76} y={8 + row * 13} width={58 - row * 9} height={9} rx={2} fill={BAD} opacity={0.28} />
          <rect x={10 + row * 7} y={8 + row * 13} width={58 - row * 9} height={9} rx={2} fill={C1} opacity={0.28} />
        </g>
      ))}
    </g>
  ),
  depth: (
    <g>
      <path d="M8,56 L40,56 L40,44 L64,44 L64,30 L88,30 L88,30 L72,30 L72,64 L8,64 Z" fill={C1} opacity={0.3} />
      <path d="M8,56 L40,56 L40,44 L64,44 L64,30 L72,30" fill="none" stroke={C1} strokeWidth={2} strokeLinejoin="round" />
      <path d="M136,56 L112,56 L112,40 L96,40 L96,26 L88,26 L72,26 L72,64 L136,64 Z" fill={BAD} opacity={0.3} />
      <path d="M136,56 L112,56 L112,40 L96,40 L96,26 L88,26 L72,26" fill="none" stroke={BAD} strokeWidth={2} strokeLinejoin="round" />
      <line x1={72} y1={8} x2={72} y2={64} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
    </g>
  ),
  tape: (
    <g fontSize={9} fontFamily="monospace">
      {[0, 1, 2, 3, 4].map((row) => (
        <g key={row}>
          <circle cx={18} cy={12 + row * 12} r={3} fill={row % 2 ? BAD : C1} />
          <line x1={30} y1={12 + row * 12} x2={86 - row * 7} y2={12 + row * 12} stroke={MUTED} strokeWidth={5} strokeLinecap="round" />
          <line x1={96} y1={12 + row * 12} x2={134} y2={12 + row * 12} stroke={GRID} strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),
  movers: (
    <g>
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <circle cx={16} cy={14 + row * 20} r={7} fill={TRACK} />
          <line x1={30} y1={12 + row * 20} x2={62} y2={12 + row * 20} stroke={MUTED} strokeWidth={4} strokeLinecap="round" />
          <line x1={30} y1={19 + row * 20} x2={50} y2={19 + row * 20} stroke={GRID} strokeWidth={3} strokeLinecap="round" />
          <path d={`M76,${22 + row * 20} C88,${20 + row * 20} 96,${12 + row * 20} 108,${14 + row * 20} C118,${15 + row * 20} 126,${10 + row * 20} 136,${8 + row * 20}`} fill="none" stroke={row === 1 ? BAD : C1} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),
  primitives: (
    <g>
      <line x1={8} y1={6} x2={8} y2={64} stroke={MUTED} strokeWidth={1.5} />
      <line x1={8} y1={64} x2={140} y2={64} stroke={MUTED} strokeWidth={1.5} />
      <Grid />
      <rect x={30} y={40} width={14} height={18} rx={2.5} fill={C1} />
      <rect x={48} y={28} width={14} height={30} rx={2.5} fill={C1} opacity={0.7} />
      <circle cx={104} cy={30} r={12} fill={C2} opacity={0.85} />
      <path d="M84,54 L104,34 L124,54" fill="none" stroke={C3} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  reaction: (
    <g>
      <circle cx={56} cy={36} r={16} fill={C1} opacity={0.25} />
      <circle cx={56} cy={36} r={16} fill="none" stroke={C1} strokeWidth={2} />
      <circle cx={92} cy={36} r={16} fill={C2} opacity={0.25} />
      <circle cx={92} cy={36} r={16} fill="none" stroke={C2} strokeWidth={2} />
      <circle cx={56} cy={36} r={4} fill={C1} />
      <circle cx={92} cy={36} r={4} fill={C2} />
    </g>
  ),
};

const byName: Record<string, keyof typeof glyphs | string> = {
  "area-chart": "area",
  "line-chart": "line",
  "bar-chart": "bar",
  "composed-chart": "composed",
  "pie-chart": "pie",
  "radar-chart": "radar",
  "radial-chart": "radial",
  "sankey-chart": "sankey",
  "trend-card": "trend",
  "metric-chart": "trend",
  "comparison-chart": "comparison",
  "breakdown-chart": "breakdown",
  "range-chart": "range",
  "country-chart": "country",
  "ring-metric": "ring",
  "cashflow-chart": "cashflow",
  "spotlight-chart": "spotlight",
  "lane-chart": "lane",
  "usage-meter": "usage",
  "heatmap-chart": "heatmap",
  "funnel-chart": "funnel",
  "scatter-chart": "scatter",
  "waterfall-chart": "waterfall",
  "candlestick-chart": "candle",
  sparkline: "spark",
  "activity-chart": "bar",
  "live-price-chart": "live",
  "order-book": "book",
  "depth-chart": "depth",
  "trades-feed": "tape",
  "market-movers": "movers",
  chart: "primitives",
  "chart-reactions": "reaction",
};

export function ChartThumbnail({ name, className }: { name: string; className?: string }) {
  const key = byName[name] ?? "spark";
  return (
    <svg viewBox="0 0 144 72" role="img" aria-hidden className={["h-20 w-full max-w-44", className].filter(Boolean).join(" ")}>
      {glyphs[key] ?? glyphs.spark}
    </svg>
  );
}
