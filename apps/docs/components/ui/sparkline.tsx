"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const SAMPLE = Array.from({ length: 42 }, (_, index) => {
  const t = index / 41;
  return (
    38 +
    t * 34 +
    Math.sin(t * Math.PI * 2.6) * 8.5 +
    Math.sin(t * Math.PI * 7.4) * 2.8 +
    (index > 28 ? (index - 28) * 0.55 : 0)
  );
});

const sizeClass = {
  sm: "h-10",
  md: "h-28",
  lg: "h-[220px] md:h-[280px]",
} as const;

const toneClass = {
  neutral: "text-foreground",
  up: "text-[color:var(--chart-2)]",
  down: "text-destructive",
} as const;

export type SparklineProps = React.ComponentProps<"div"> & {
  data?: number[];
  markerIndex?: number;
  markerLabel?: string;
  interactive?: boolean;
  showValue?: boolean;
  format?: (value: number) => string;
  size?: keyof typeof sizeClass;
  tone?: keyof typeof toneClass;
};

function toPoints(data: number[], width: number, height: number) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(max - min, 1);
  const padX = 10;
  const padTop = height * 0.18;
  const padBottom = height * 0.22;
  const usable = height - padTop - padBottom;

  return data.map((value, index) => {
    const x =
      data.length === 1
        ? width / 2
        : padX + (index / (data.length - 1)) * (width - padX * 2);
    const y = padTop + (1 - (value - min) / span) * usable;
    return { x, y, value };
  });
}

function smoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  return points
    .map((point, index) => {
      if (index === 0) return `M${point.x} ${point.y}`;
      const previous = points[index - 1] ?? point;
      const middle = (previous.x + point.x) / 2;
      return `C${middle} ${previous.y} ${middle} ${point.y} ${point.x} ${point.y}`;
    })
    .join(" ");
}

function Sparkline({
  className,
  data = SAMPLE,
  markerIndex,
  markerLabel,
  interactive = true,
  showValue = true,
  format = (value) =>
    value.toLocaleString("en-US", { maximumFractionDigits: 1 }),
  size = "lg",
  tone = "neutral",
  ...props
}: SparklineProps) {
  const uid = React.useId().replace(/:/g, "");
  const fallbackIndex = markerIndex ?? Math.max(0, data.length - 1);
  const [active, setActive] = React.useState(fallbackIndex);
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    setActive(markerIndex ?? Math.max(0, data.length - 1));
  }, [data.length, markerIndex]);

  const width = 960;
  const height = 280;
  const baseline = height - 18;
  const points = toPoints(data, width, height);
  const line = smoothPath(points);
  const last = points[points.length - 1];
  const area = last
    ? `${line} L${last.x} ${baseline} L${points[0]?.x ?? 0} ${baseline} Z`
    : "";
  const marker = points[Math.min(Math.max(active, 0), Math.max(points.length - 1, 0))];

  const moveTo = (clientX: number) => {
    if (!interactive || points.length < 2 || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let best = Infinity;
    points.forEach((point, index) => {
      const distance = Math.abs(point.x - x);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setActive(nearest);
  };

  const reset = () => setActive(markerIndex ?? Math.max(0, data.length - 1));

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (!interactive || points.length < 2) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const delta = event.key === "ArrowLeft" ? -1 : 1;
      setActive((current) =>
        Math.min(points.length - 1, Math.max(0, current + delta))
      );
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setActive(points.length - 1);
    }
  };

  const caption = markerLabel ?? (marker ? format(marker.value) : "");

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("block w-full select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", sizeClass[size], toneClass[tone])}
        role={interactive && points.length ? "slider" : "img"}
        aria-label={caption || "Trend"}
        aria-valuemin={interactive && points.length ? 1 : undefined}
        aria-valuemax={interactive && points.length ? points.length : undefined}
        aria-valuenow={interactive && marker ? points.indexOf(marker) + 1 : undefined}
        aria-valuetext={interactive && marker ? format(marker.value) : undefined}
        tabIndex={interactive && points.length ? 0 : undefined}
        onPointerDown={(event) => {
          if (!interactive) return;
          if (event.pointerType !== "mouse") {
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          moveTo(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!interactive) return;
          if (
            event.pointerType === "mouse" ||
            event.currentTarget.hasPointerCapture(event.pointerId)
          ) {
            moveTo(event.clientX);
          }
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") reset();
        }}
        onPointerLeave={reset}
        onKeyDown={onKeyDown}
      >
        {area ? (
          <>
            <defs>
              <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.14} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${uid}-area)`} />
          </>
        ) : null}
        <line
          x1="0"
          x2={width}
          y1={baseline}
          y2={baseline}
          className="stroke-border"
          strokeDasharray="4 4"
        />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {last ? (
          <circle
            cx={last.x}
            cy={last.y}
            r="3"
            fill="currentColor"
            className="opacity-40"
          />
        ) : null}
        {marker ? (
          <g>
            <line
              x1={marker.x}
              x2={marker.x}
              y1="20"
              y2={baseline}
              className="stroke-border"
              strokeWidth="2"
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r="4"
              fill="currentColor"
              stroke="var(--card)"
              strokeWidth="2"
            />
          </g>
        ) : null}
      </svg>
      {marker && (markerLabel || showValue) ? (
        <div
          className="pointer-events-none absolute top-1 max-w-[calc(100%-1rem)] -translate-x-1/2"
          style={{
            left: `${Math.min(86, Math.max(14, (marker.x / width) * 100))}%`,
          }}
        >
          <div className="rounded-lg border border-border bg-popover px-2.5 py-1.5 tabular-nums shadow-sm">
            {markerLabel ? (
              <p className="text-xs text-muted-foreground">{markerLabel}</p>
            ) : null}
            {showValue ? (
              <p
                className={cn(
                  "text-xs font-medium text-foreground",
                  markerLabel && "mt-0.5"
                )}
              >
                {format(marker.value)}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { Sparkline, SAMPLE as sparklineSample };
