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
  loadingVariant?: "line" | "bar" | "ring" | "radar" | "heatmap" | "funnel";
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

function ChartLoadingShape({ variant = "line", animated }: { variant?: ChartReactionOptions["loadingVariant"]; animated: boolean }) {
  const id = React.useId().replace(/:/g, "");
  const paint = `url(#${id}-light)`;
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
      {variant === "ring" ? <circle cx="240" cy="80" r="55" fill="none" stroke={paint} strokeWidth="18" strokeDasharray="240 110" /> : variant === "radar" ? <path d="M240 15 310 60 285 140 195 140 170 60Z M240 42 283 70 266 119 214 119 197 70Z" fill="none" stroke={paint} strokeWidth="3" /> : variant === "funnel" ? <path d="M35 25C140 25 150 64 240 64S350 73 445 73V87C350 87 330 96 240 96S140 135 35 135Z" fill={paint} /> : variant === "heatmap" ? Array.from({ length: 56 }, (_, i) => <rect key={i} x={34 + (i % 14) * 30} y={20 + Math.floor(i / 14) * 30} width="24" height="24" rx="4" fill={paint} opacity={0.25 + ((i * 7) % 11) / 15} />) : variant === "bar" ? Array.from({ length: 24 }, (_, i) => { const height = 25 + ((i * 29) % 100); return <rect key={i} x={24 + i * 18} y={145 - height} width="11" height={height} rx="3" fill={paint} />; }) : <>
        {[40, 85, 130].map((y) => <line key={y} x1="20" x2="460" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 5" />)}
        <path d="M20 128C55 128 65 85 95 92S145 120 175 78 215 100 250 58 300 85 345 40 405 64 460 20" fill="none" stroke={paint} strokeWidth="3" strokeLinecap="round" />
      </>}
    </svg>
  );
}

export function ChartReaction({ isLoading, reaction, className }: { isLoading?: boolean; reaction?: ChartReactionOptions; className?: string }) {
  const { emotion, asset, animationsEnabled } = useChartReaction({ isLoading, reaction });
  const scoped = useChartReactionScope();
  if (!emotion || scoped) return null;
  return (
    <div role="status" aria-live="polite" aria-atomic="true" data-chart-reaction={emotion} className={["flex items-center justify-center gap-2 rounded-md bg-card p-2 text-xs text-muted-foreground", emotion === "loading" ? "h-full min-h-20 w-full flex-col" : "w-fit", className].filter(Boolean).join(" ")}>
      {emotion === "loading" ? <ChartLoadingShape variant={reaction?.loadingVariant} animated={animationsEnabled} /> : null}
      <div className={emotion === "loading" && animationsEnabled ? "motion-safe:animate-pulse" : undefined}>
        <ReactionMedia key={`${emotion}:${asset?.src}:${asset?.poster}`} asset={asset} emotion={emotion} animationsEnabled={animationsEnabled} />
      </div>
    </div>
  );
}

