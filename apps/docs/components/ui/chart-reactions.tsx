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
  loadingVariant?: "line" | "area" | "spark" | "range" | "bar" | "stacked-bar" | "h-bar" | "ring" | "donut" | "radial" | "radar" | "heatmap" | "funnel" | "sankey" | "scatter" | "bubble" | "candlestick" | "waterfall" | "gauge" | "gauge-needle" | "cashflow" | "lane" | "meter";
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
  loading: "Loading chart…", neutral: "No change", sad: "Significant decline",
  disappointed: "Below expectations", happy: "Making progress", surprised: "Unexpected growth", proud: "Goal achieved",
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
  return change > 0 ? "happy" : "neutral";
}
const ChartReactionsContext = React.createContext<ChartReactionsSettings>({});
const ChartReactionScopeContext = React.createContext(false);
export function ChartReactionsProvider({ children, ...settings }: ChartReactionsSettings & { children: React.ReactNode }) {
  const parent = useChartReactions();
  return <ChartReactionsContext.Provider value={{ ...parent, ...settings, assets: { ...parent.assets, ...settings.assets } }}>{children}</ChartReactionsContext.Provider>;
}
export function useChartReactions() { return React.useContext(ChartReactionsContext); }
export function ChartReactionScope({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  const parent = useChartReactionScope();
  return <ChartReactionScopeContext.Provider value={parent || active}>{children}</ChartReactionScopeContext.Provider>;
}
export function useChartReactionScope() { return React.useContext(ChartReactionScopeContext); }
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
  const enabled = reaction.enabled ?? settings.enabled ?? true;
  const resolver = reaction.resolver ?? settings.resolver ?? resolveChartEmotion;
  const emotion = isLoading ? "loading" : enabled ? reaction.emotion ?? resolver(reaction) : undefined;
  const asset = emotion ? { ...settings.assets?.[emotion], ...reaction.assets?.[emotion] } : undefined;
  return { emotion, asset, animationsEnabled: !reducedMotion && (settings.animationsEnabled ?? true) };
}
export function ChartSkeleton({ children, isLoading = false, className }: { children: React.ReactNode; isLoading?: boolean; className?: string }) {
  const settings = useChartReactions();
  const reducedMotion = useChartReducedMotion();
  const loading = isLoading || Boolean(settings.isLoading);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!loading || reducedMotion || settings.animationsEnabled === false) return;
    const animation = ref.current?.animate?.(
      [{ maskPosition: "100% 0%" }, { maskPosition: "0% 0%" }],
      { duration: 2200, iterations: Infinity, easing: "linear" }
    );
    return () => animation?.cancel();
  }, [loading, reducedMotion, settings.animationsEnabled]);
  return <div data-chart-skeleton={loading ? "true" : undefined} aria-busy={loading} className={["relative flex h-full min-h-0 w-full flex-1 flex-col", className].filter(Boolean).join(" ")}>
    <div ref={ref} inert={loading || undefined} aria-hidden={loading || undefined} className="flex h-full min-h-0 w-full flex-1 flex-col" style={loading ? {
      filter: "grayscale(1)", opacity: 0.65, pointerEvents: "none",
      maskImage: "linear-gradient(90deg, rgb(0 0 0 / 28%) 0%, rgb(0 0 0 / 28%) 35%, black 50%, rgb(0 0 0 / 28%) 65%, rgb(0 0 0 / 28%) 100%)",
      maskSize: "250% 100%", maskPosition: "50% 0%",
    } : undefined}>{children}</div>
    {loading ? <span role="status" className="sr-only">Loading chart</span> : null}
  </div>;
}
function ReactionMedia({ asset, emotion, animationsEnabled }: { asset?: ChartReactionAsset; emotion: ChartEmotion; animationsEnabled: boolean }) {
  const [failed, setFailed] = React.useState<string[]>([]);
  const poster = asset?.poster?.trim();
  const staticPoster = poster && !/\.gif(?:[?#]|$)|^data:image\/gif/i.test(poster) ? poster : undefined;
  const source = animationsEnabled && asset?.src?.trim() && !failed.includes(asset.src.trim()) ? asset.src.trim() : staticPoster;
  const src = source && !failed.includes(source) ? source : undefined;
  const alt = asset?.alt?.trim() || labels[emotion];
  return <>{src ? <img src={src} alt={alt} width={80} height={64} className="max-h-16 max-w-20 rounded-md object-contain" onError={() => setFailed(current => [...current, src])} /> : null}<span>{src ? labels[emotion] : alt}</span></>;
}
export function ChartReaction({ isLoading, reaction, className }: { isLoading?: boolean; reaction?: ChartReactionOptions; loadingVariant?: ChartReactionOptions["loadingVariant"]; className?: string }) {
  const { emotion, asset, animationsEnabled } = useChartReaction({ isLoading, reaction });
  const scoped = useChartReactionScope();
  if (!emotion || scoped || (emotion === "loading" && !asset?.src && !asset?.poster)) return null;
  return <div role="status" aria-live="polite" aria-atomic="true" data-chart-reaction={emotion} className={["flex w-fit items-center justify-center gap-2 rounded-md bg-card p-2 text-xs text-muted-foreground", className].filter(Boolean).join(" ")}>
    <ReactionMedia key={`${emotion}:${asset?.src}:${asset?.poster}`} asset={asset} emotion={emotion} animationsEnabled={animationsEnabled} />
  </div>;
}
