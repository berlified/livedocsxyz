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
  loadingVariant?: "line" | "area" | "spark" | "range" | "bar" | "stacked-bar" | "h-bar" | "ring" | "donut" | "radial" | "radar" | "heatmap" | "funnel" | "sankey" | "scatter" | "bubble" | "candlestick" | "waterfall" | "cashflow" | "lane" | "meter";
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
type SkeletonBox = { x: number; y: number; w: number; h: number };
const ChartSkeletonContext = React.createContext(false);
function sameBoxes(a: SkeletonBox[], b: SkeletonBox[]) {
  return a.length === b.length && a.every((box, index) => { const other = b[index]; return other && Math.abs(box.x - other.x) < 0.5 && Math.abs(box.y - other.y) < 0.5 && Math.abs(box.w - other.w) < 0.5 && Math.abs(box.h - other.h) < 0.5; });
}
function useLoadingTextPlaceholders(ref: React.RefObject<HTMLDivElement | null>, loading: boolean) {
  const [boxes, setBoxes] = React.useState<SkeletonBox[]>([]);
  React.useEffect(() => {
    if (!loading) {
      setBoxes([]);
      return;
    }
    const root = ref.current;
    if (!root) return;
    let frame = 0;
    let active = true;
    const observed = new Set<Element>();
    const measure = () => {
      frame = 0;
      if (!active) return;
      const base = root.getBoundingClientRect();
      const next: SkeletonBox[] = [];
      const targets = new Set<Element>([root]);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        const text = node.textContent ?? "";
        if (!parent || !text.trim() || parent.closest("style, script, noscript, defs, title, desc, .sr-only")) continue;
        targets.add(parent);
        const style = window.getComputedStyle(parent);
        if (style.visibility === "hidden" || style.display === "none") continue;
        range.setStart(node, text.length - text.trimStart().length);
        range.setEnd(node, text.trimEnd().length);
        for (const rect of Array.from(range.getClientRects())) {
          const x = Math.max(rect.left, base.left);
          const y = Math.max(rect.top, base.top);
          const w = Math.min(rect.right, base.right) - x;
          const h = Math.min(rect.bottom, base.bottom) - y;
          if (w <= 0 || h <= 0) continue;
          const box = { x: x - base.left, y: y - base.top, w, h };
          if (!next.some((other) => sameBoxes([other], [box]))) next.push(box);
        }
      }
      observed.forEach((target) => {
        if (!targets.has(target)) {
          resizeObserver.unobserve(target);
          observed.delete(target);
        }
      });
      targets.forEach((target) => {
        if (!observed.has(target)) {
          resizeObserver.observe(target);
          observed.add(target);
        }
      });
      setBoxes((current) => (sameBoxes(current, next) ? current : next));
    };
    const schedule = () => {
      if (active && !frame) frame = window.requestAnimationFrame(measure);
    };
    const resizeObserver = new ResizeObserver(schedule);
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(root, { subtree: true, childList: true, characterData: true, attributes: true });
    window.addEventListener("resize", schedule);
    root.addEventListener("scroll", schedule, true);
    document.fonts?.addEventListener("loadingdone", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});
    schedule();
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", schedule);
      root.removeEventListener("scroll", schedule, true);
      document.fonts?.removeEventListener("loadingdone", schedule);
    };
  }, [loading, ref]);
  return boxes;
}
export function ChartSkeleton({ children, isLoading = false, className }: { children: React.ReactNode; isLoading?: boolean; className?: string }) {
  const settings = useChartReactions();
  const reducedMotion = useChartReducedMotion();
  const parentLoading = React.useContext(ChartSkeletonContext);
  const loading = parentLoading || isLoading || Boolean(settings.isLoading);
  const owner = loading && !parentLoading;
  const animate = owner && !reducedMotion && settings.animationsEnabled !== false;
  const ref = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const boxes = useLoadingTextPlaceholders(ref, owner);
  const [mediaFailed, setMediaFailed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const loadingAsset = { ...settings.assets?.loading, ...settings.reaction?.assets?.loading };
  const sadLoading = settings.reaction?.emotion === "sad";
  const loadingSrc = !animate || !sadLoading ? undefined : !mediaFailed && loadingAsset.src?.trim() ? loadingAsset.src.trim() : undefined;
  const loadingPoster = !animate || !sadLoading || loadingSrc ? undefined : loadingAsset.poster?.trim() || undefined;
  React.useEffect(() => {
    if (!animate) return;
    const animation = labelRef.current?.animate?.(
      [{ backgroundPosition: "100% 50%" }, { backgroundPosition: "0% 50%" }],
      { duration: 2200, iterations: Infinity, easing: "linear" }
    );
    const sweep = ref.current?.animate?.(
      [{ maskPosition: "100% 0%" }, { maskPosition: "0% 0%" }],
      { duration: 2200, iterations: Infinity, easing: "linear" }
    );
    return () => { animation?.cancel(); sweep?.cancel(); };
  }, [animate]);
  return <ChartSkeletonContext.Provider value={loading}>
    <ChartReactionsProvider isLoading={loading}>
      <div data-chart-skeleton={owner ? "true" : undefined} aria-busy={loading} className={["relative flex h-full min-h-0 w-full flex-1 flex-col", className].filter(Boolean).join(" ")}>
        <div ref={ref} inert={owner || undefined} aria-hidden={owner || undefined} data-chart-loading-text={owner ? "true" : undefined} className="flex h-full min-h-0 w-full flex-1 flex-col" style={owner ? {
          filter: "grayscale(1)", opacity: 0.5, pointerEvents: "none",
          maskImage: "linear-gradient(90deg, rgb(0 0 0 / 30%) 0%, rgb(0 0 0 / 30%) 35%, black 50%, rgb(0 0 0 / 30%) 65%, rgb(0 0 0 / 30%) 100%)",
          maskSize: "250% 100%", maskPosition: "50% 0%",
        } : undefined}>{children}</div>
        {owner && mounted && (loadingSrc || loadingPoster) ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-lg">
            <img
              src={loadingSrc ?? loadingPoster}
              alt=""
              className="h-full w-full object-cover opacity-75"
              onError={() => setMediaFailed(true)}
            />
          </div>
        ) : null}
        {owner ? <style>{`[data-chart-loading-text="true"],[data-chart-loading-text="true"] *{-webkit-text-fill-color:transparent!important;text-shadow:none!important}[data-chart-loading-text="true"] :is(text,tspan,textPath){fill:transparent!important;stroke:transparent!important}`}</style> : null}
        {owner && boxes.length ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
            {boxes.map((box, index) => (
              <span
                key={index}
                data-chart-loading-bar=""
                className="absolute rounded-full bg-muted-foreground"
                style={{ left: box.x, top: box.y + box.h * 0.18, width: box.w, height: Math.min(box.h * 0.64, 28), opacity: 0.28 }}
              />
            ))}
          </div>
        ) : null}
        {owner ? <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
          <span ref={labelRef} role="status" aria-label="Loading chart" data-chart-loading-label="" className="bg-clip-text text-sm font-medium tracking-wide text-transparent" style={{
            backgroundImage: "linear-gradient(110deg, var(--muted-foreground) 35%, var(--foreground) 50%, var(--muted-foreground) 65%)",
            backgroundSize: "250% 100%", backgroundPosition: "50% 50%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Loading</span>
        </div> : null}
      </div>
    </ChartReactionsProvider>
  </ChartSkeletonContext.Provider>;
}
function ReactionMedia({ asset, emotion, animationsEnabled }: { asset?: ChartReactionAsset; emotion: ChartEmotion; animationsEnabled: boolean }) {
  const [failed, setFailed] = React.useState<string[]>([]);
  const poster = asset?.poster?.trim();
  const staticPoster = poster && !/\.gif(?:[?#]|$)|^data:image\/gif/i.test(poster) ? poster : undefined;
  const source = animationsEnabled && asset?.src?.trim() && !failed.includes(asset.src.trim()) ? asset.src.trim() : staticPoster;
  const src = source && !failed.includes(source) ? source : undefined;
  const alt = asset?.alt?.trim() || labels[emotion];
  return <>{src ? <img src={src} alt={alt} width={160} height={144} className="max-h-36 max-w-40 rounded-md object-contain" onError={() => setFailed(current => [...current, src])} /> : null}<span>{src ? labels[emotion] : alt}</span></>;
}
export function ChartReaction({ isLoading, reaction, className }: { isLoading?: boolean; reaction?: ChartReactionOptions; loadingVariant?: ChartReactionOptions["loadingVariant"]; className?: string }) {
  const { emotion, asset, animationsEnabled } = useChartReaction({ isLoading, reaction });
  const scoped = useChartReactionScope();
  if (!emotion || scoped || emotion === "loading" || (!asset?.src && !asset?.poster)) return null;
  return <div role="status" aria-live="polite" aria-atomic="true" data-chart-reaction={emotion} className={["flex w-fit items-center justify-center gap-2 rounded-md bg-card p-2 text-xs text-muted-foreground", className].filter(Boolean).join(" ")}>
    <ReactionMedia key={`${emotion}:${asset?.src}:${asset?.poster}`} asset={asset} emotion={emotion} animationsEnabled={animationsEnabled} />
  </div>;
}
