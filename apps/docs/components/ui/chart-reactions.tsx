"use client";

import * as React from "react";

export type ChartEmotion = "loading" | "neutral" | "sad" | "disappointed" | "happy" | "surprised" | "proud";
export type ChartReactionAsset = { src?: string; alt?: string; poster?: string };
export type ChartReactionMetric = { current: number; previous?: number; goal?: number; lowerIsBetter?: boolean };
export type ChartReactionOptions = {
  enabled?: boolean;
  emotion?: ChartEmotion;
  metric?: ChartReactionMetric;
  assets?: Partial<Record<ChartEmotion, ChartReactionAsset>>;
  resolver?: ChartReactionResolver;
  loadingVariant?: "line" | "area" | "bar" | "stacked-bar" | "h-bar" | "ring" | "donut" | "radial" | "radar" | "heatmap" | "funnel" | "sankey" | "scatter" | "bubble" | "candlestick" | "waterfall" | "gauge" | "gauge-needle" | "cashflow" | "lane" | "meter";
};
export type ChartReactionResolver = (options: ChartReactionOptions) => ChartEmotion | undefined;
export type ChartReactionsSettings = {
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  replayKey?: number;
  assets?: Partial<Record<ChartEmotion, ChartReactionAsset>>;
  enabled?: boolean;
  animationsEnabled?: boolean;
  resolver?: ChartReactionResolver;
};

const labels: Record<ChartEmotion, string> = {
  loading: "Loading chart…",
  neutral: "No change",
  sad: "Significant decline",
  disappointed: "Below expectations",
  happy: "Making progress",
  surprised: "Unexpected growth",
  proud: "Goal achieved",
};

export function resolveChartEmotion({ emotion, metric }: ChartReactionOptions): ChartEmotion | undefined {
  if (emotion) return emotion;
  if (!metric || !Number.isFinite(metric.current)) return undefined;
  const { current, previous, goal, lowerIsBetter } = metric;
  const direction = lowerIsBetter ? -1 : 1;
  if (goal !== undefined && Number.isFinite(goal) && (current - goal) * direction >= 0) return "proud";
  if (previous === undefined || !Number.isFinite(previous)) return goal !== undefined && Number.isFinite(goal) ? "disappointed" : undefined;
  const change = ((current - previous) * direction) / Math.max(Math.abs(previous), 1);
  if (change <= -0.2) return "sad";
  if (change < 0) return "disappointed";
  if (change >= 0.2) return "surprised";
  if (change > 0) return "happy";
  return "neutral";
}

const ChartReactionsContext = React.createContext<ChartReactionsSettings>({});
const ChartReactionScopeContext = React.createContext(false);

export function ChartReactionsProvider({ children, ...settings }: ChartReactionsSettings & { children: React.ReactNode }) {
  const parent = useChartReactions();
  return (
    <ChartReactionsContext.Provider value={{ ...parent, ...settings, assets: { ...parent.assets, ...settings.assets } }}>
      {children}
    </ChartReactionsContext.Provider>
  );
}

export function useChartReactions() {
  return React.useContext(ChartReactionsContext);
}

export function ChartReactionScope({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  const parent = React.useContext(ChartReactionScopeContext);
  return <ChartReactionScopeContext.Provider value={parent || active}>{children}</ChartReactionScopeContext.Provider>;
}

export function useChartReactionScope() {
  return React.useContext(ChartReactionScopeContext);
}

function subscribeMotion(callback: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function useChartReducedMotion() {
  return React.useSyncExternalStore(subscribeMotion, () => typeof window.matchMedia !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
}

export function useChartReaction({ isLoading = false, reaction }: { isLoading?: boolean; reaction?: ChartReactionOptions } = {}) {
  const settings = useChartReactions();
  const reducedMotion = useChartReducedMotion();
  reaction = { ...settings.reaction, ...reaction };
  isLoading = isLoading || Boolean(settings.isLoading);
  const enabled = reaction?.enabled ?? settings.enabled ?? true;
  const resolver = reaction?.resolver ?? settings.resolver ?? resolveChartEmotion;
  const emotion = isLoading ? "loading" : enabled ? reaction?.emotion ?? resolver(reaction ?? {}) : undefined;
  const asset = emotion ? { ...settings.assets?.[emotion], ...reaction?.assets?.[emotion] } : undefined;
  return { emotion, asset, animationsEnabled: !reducedMotion && (settings.animationsEnabled ?? true) };
}

function ReactionMedia({ asset, emotion, animationsEnabled }: { asset?: ChartReactionAsset; emotion: ChartEmotion; animationsEnabled: boolean }) {
  const [failed, setFailed] = React.useState<string[]>([]);
  const poster = asset?.poster?.trim();
  const staticPoster = poster && !/\.gif(?:[?#]|$)|^data:image\/gif/i.test(poster) ? poster : undefined;
  const source = animationsEnabled && asset?.src?.trim() && !failed.includes(asset.src.trim()) ? asset.src.trim() : staticPoster;
  const src = source && !failed.includes(source) ? source : undefined;
  const alt = asset?.alt?.trim() || labels[emotion];
  return (
    <>
      {src ? <img src={src} alt={alt} width={80} height={64} className="max-h-16 max-w-20 rounded-md object-contain" onError={() => setFailed((current) => [...current, src])} /> : null}
      <span>{src ? labels[emotion] : alt}</span>
    </>
  );
}

function bars(seed: number, count: number, min = 24) {
  return Array.from({ length: count }, (_, i) => {
    const height = min + ((i * seed) % 101);
    return { height, x: i };
  });
}

function ChartLoadingShape({ variant = "line", animated }: { variant?: ChartReactionOptions["loadingVariant"]; animated: boolean }) {
  const id = React.useId().replace(/:/g, "");
  const paint = `url(#${id}-light)`;
  const candle = (i: number) => {
    const base = 30 + ((i * 37) % 80);
    const body = 14 + ((i * 23) % 40);
    const up = i % 2 === 0;
    const x = 26 + i * 36;
    const bodyTop = 150 - base - (up ? body : 0);
    return (
      <g key={i}>
        <line x1={x + 7} x2={x + 7} y1={150 - base - body - 14} y2={150 - base + 10} stroke={paint} strokeWidth="2" />
        <rect x={x} y={bodyTop} width="14" height={body} rx="2" fill={paint} fillOpacity={up ? 0.25 : 1} stroke={paint} strokeWidth="1.5" />
      </g>
    );
  };
  const shape = (() => {
    switch (variant) {
      case "area":
        return <>
          <path d="M20 130C60 130 70 88 100 95S150 118 180 76 230 96 260 54 320 80 360 38 420 58 460 24" fill="none" stroke={paint} strokeWidth="3" strokeLinecap="round" />
          <path d="M20 130C60 130 70 88 100 95S150 118 180 76 230 96 260 54 320 80 360 38 420 58 460 24V150H20Z" fill={paint} fillOpacity="0.35" stroke="none" />
        </>;
      case "bar":
        return bars(29, 20).map(({ height, x }) => <rect key={x} x={28 + x * 22} y={150 - height} width="14" height={height} rx="3" fill={paint} />);
      case "stacked-bar":
        return bars(29, 14).map(({ height, x }) => <>
          <rect key={`a${x}`} x={26 + x * 33} y={150 - height} width="18" height={height / 3} rx="2" fill={paint} />
          <rect key={`b${x}`} x={26 + x * 33} y={150 - height - height / 3 - 3} width="14" height={height / 3} rx="2" fill={paint} fillOpacity="0.6" />
          <rect key={`c${x}`} x={26 + x * 33} y={150 - height - (height / 3 + 3) * 2} width="14" height={height / 3} rx="2" fill={paint} fillOpacity="0.3" />
        </>);
      case "h-bar":
        return bars(31, 8).map(({ height, x }) => <rect key={x} x={90} y={22 + x * 16} width={20 + height * 3.4} height="10" rx="3" fill={paint} />);
      case "ring":
        return <circle cx="240" cy="80" r="55" fill="none" stroke={paint} strokeWidth="18" strokeDasharray="240 110" strokeLinecap="round" />;
      case "donut":
        return <>
          <circle cx="240" cy="80" r="55" fill="none" stroke={paint} strokeWidth="22" strokeDasharray="172 173" />
          <circle cx="240" cy="80" r="55" fill="none" stroke={paint} strokeOpacity="0.5" strokeWidth="22" strokeDasharray="86 259" strokeDashoffset="-172" />
          <circle cx="240" cy="80" r="55" fill="none" stroke={paint} strokeOpacity="0.3" strokeWidth="22" strokeDasharray="57 288" strokeDashoffset="-258" />
        </>;
      case "radial":
        return Array.from({ length: 5 }, (_, i) => <circle key={i} cx="240" cy="80" r={20 + i * 11} fill="none" stroke={paint} strokeWidth="7" strokeDasharray={`${40 + ((i * 53) % 80)} 400`} strokeLinecap="round" />);
      case "radar":
        return <>
          {[30, 50, 70].map((r) => <polygon key={r} points="240,20 305,55 305,125 240,160 175,125 175,55" fill="none" stroke="var(--border)" transform={`translate(${240 - r * 1.0} 0) scale(${r / 80})`} opacity="0.5" />)}
          <polygon points="240,35 290,62 275,132 210,124 196,68" fill={paint} fillOpacity="0.2" stroke={paint} strokeWidth="2.5" />
          <polygon points="240,70 268,84 258,116 226,110 216,86" fill="none" stroke={paint} strokeWidth="2" strokeDasharray="4 4" />
        </>;
      case "heatmap":
        return bars(7, 56).map(({ height, x }, i) => <rect key={i} x={34 + (i % 14) * 30} y={18 + Math.floor(i / 14) * 30} width="24" height="24" rx="4" fill={paint} opacity={0.2 + (height % 70) / 100} />);
      case "funnel":
        return <>
          <path d="M30 30H450V50H30Z M55 62H425V82H55Z M90 94H390V114H90Z M135 126H345V146H135Z" fill={paint} fillOpacity="0.55" />
          <path d="M30 30H450V50H55V62H425V82H90V94H390V114H135V126H345V146" fill="none" stroke={paint} strokeWidth="2" />
        </>;
      case "sankey":
        return <>
          {([[20, 30, 130, 60], [20, 60, 130, 100], [20, 90, 130, 140]] as const).map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1}C${x1 + 70} ${y1} ${x2 - 70} ${y2} ${x2} ${y2}V${y2 + 14}C${x2 - 70} ${y2 + 14} ${x1 + 70} ${y1 + 14} ${x1} ${y1 + 14}Z`} fill={paint} fillOpacity={0.25 + i * 0.2} />)}
          <rect x="20" y="28" width="8" height="112" rx="3" fill={paint} />
          <rect x="440" y="56" width="8" height="100" rx="3" fill={paint} fillOpacity="0.6" />
        </>;
      case "bubble":
        return <>
          {[[90, 110, 10], [150, 70, 16], [210, 105, 8], [265, 55, 22], [320, 95, 12], [380, 60, 18]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={paint} fillOpacity={0.3 + (i % 3) * 0.2} stroke={paint} strokeWidth="1.5" />)}
          {[30, 80, 130].map((y) => <line key={y} x1="20" x2="460" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 5" />)}
        </>;
      case "scatter":
        return <>
          {[[70, 118], [120, 88], [165, 108], [215, 62], [265, 84], [315, 48], [365, 70], [415, 40]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5" fill={paint} />)}
          {[30, 80, 130].map((y) => <line key={y} x1="20" x2="460" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 5" />)}
          <line x1="30" y1="122" x2="450" y2="46" stroke={paint} strokeWidth="2" strokeDasharray="6 5" />
        </>;
      case "candlestick":
        return Array.from({ length: 12 }, (_, i) => candle(i));
      case "waterfall":
        return <>
          {([[40, 100, 40], [100, 60, 40], [160, 60, 40], [220, 84, 24], [260, 50, 40], [320, 44, 40]] as const).map(([x, y, h], i) => <rect key={i} x={x} y={y} width="26" height={h} rx="3" fill={paint} fillOpacity={i === 0 || i === 5 ? 0.9 : 0.5} />)}
          {[70, 80, 70, 96, 70, 64].slice(0, 5).map((y, i) => <line key={i} x1={66 + i * 60} x2={100 + i * 60} y1={y} y2={y} stroke={paint} strokeWidth="1.5" strokeDasharray="4 3" />)}
        </>;
      case "gauge":
      case "gauge-needle":
        return <>
          <path d="M50 130A78 78 0 1 1 430 130" fill="none" stroke={paint} strokeWidth="16" strokeLinecap="round" strokeDasharray="470 300" />
          <line x1="240" y1="130" x2="330" y2="66" stroke={paint} strokeWidth="4" strokeLinecap="round" />
          <circle cx="240" cy="130" r="7" fill={paint} />
        </>;
      case "cashflow":
        return <>
          {([[30, 70, 60], [90, 46, 54], [150, 84, 46], [210, 40, 70], [270, 96, 44], [330, 60, 60], [390, 78, 52]] as const).map(([x, y, h], i) => i % 2 === 0
            ? <rect key={i} x={x} y={y} width="24" height={h} rx="3" fill={paint} />
            : <rect key={i} x={x} y={84} width="24" height={h - 20} rx="3" fill={paint} fillOpacity="0.45" />)}
          <line x1="20" x2="460" y1="84" y2="84" stroke="var(--border)" />
        </>;
      case "lane":
        return <>
          {[26, 62, 98, 134].map((y, i) => <rect key={i} x={30} y={y} width={400 - i * 60} height="18" rx="9" fill="var(--muted)" />)}
          {[30, 62, 98, 134].map((y, i) => <rect key={`f${i}`} x={30} y={y} width={[260, 180, 120, 60][i]} height="18" rx="9" fill={paint} />)}
        </>;
      case "meter":
        return <>
          <rect x="60" y="66" width="360" height="28" rx="14" fill="var(--muted)" />
          <rect x="60" y="66" width="230" height="28" rx="14" fill={paint} />
        </>;
      default:
        return <>
          {[40, 85, 130].map((y) => <line key={y} x1="20" x2="460" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 5" />)}
          <path d="M20 128C55 128 65 85 95 92S145 120 175 78 215 100 250 58 300 85 345 40 405 64 460 20" fill="none" stroke={paint} strokeWidth="3" strokeLinecap="round" />
        </>;
    }
  })();
  return (
    <svg viewBox="0 0 480 160" className="h-full max-h-48 min-h-12 w-full text-chart-1" aria-hidden="true" data-chart-loading-shape={variant}>
      <defs>
        <linearGradient id={`${id}-light`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.15" />
          {animated ? <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0;-1 0" dur="2.4s" repeatCount="indefinite" /> : null}
        </linearGradient>
      </defs>
      {shape}
    </svg>
  );
}

export function ChartReaction({ isLoading, reaction, loadingVariant, className }: { isLoading?: boolean; reaction?: ChartReactionOptions; loadingVariant?: ChartReactionOptions["loadingVariant"]; className?: string }) {
  const { emotion, asset, animationsEnabled } = useChartReaction({ isLoading, reaction });
  const scoped = useChartReactionScope();
  if (!emotion || scoped) return null;
  return (
    <div role="status" aria-live="polite" aria-atomic="true" data-chart-reaction={emotion} className={["flex items-center justify-center gap-2 rounded-md bg-card p-2 text-xs text-muted-foreground", emotion === "loading" ? "h-full min-h-20 w-full flex-col" : "w-fit", className].filter(Boolean).join(" ")}>
      {emotion === "loading" ? <ChartLoadingShape variant={reaction?.loadingVariant ?? loadingVariant} animated={animationsEnabled} /> : null}
      <div className={emotion === "loading" && animationsEnabled ? "motion-safe:animate-pulse" : undefined}>
        <ReactionMedia key={`${emotion}:${asset?.src}:${asset?.poster}`} asset={asset} emotion={emotion} animationsEnabled={animationsEnabled} />
      </div>
    </div>
  );
}

