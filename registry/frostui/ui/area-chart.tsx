"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const SAMPLE = Array.from({ length: 29 }, (_, index) => {
  const trend = 16 + index * 1.35;
  const tooth = index % 2 === 0 ? 5.4 : -2.4;
  return trend + tooth;
});

export type AreaChartProps = React.ComponentProps<"div"> & {
  data?: number[];
  markerIndex?: number;
  markerLabel?: string;
  interactive?: boolean;
};

function toPoints(data: number[], width: number, height: number) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(max - min, 1);
  const bandTop = height * 0.36;
  const bandBottom = height * 0.58;

  return data.map((value, index) => {
    const x = data.length === 1 ? 0 : (index / (data.length - 1)) * width;
    const y = bandTop + (1 - (value - min) / span) * (bandBottom - bandTop);
    return { x, y, value };
  });
}

function linePath(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function AreaChart({
  className,
  data = SAMPLE,
  markerIndex,
  markerLabel = "Your balance will appear here.",
  interactive = true,
  ...props
}: AreaChartProps) {
  const defaultMarker = markerIndex ?? Math.floor(data.length * 0.56);
  const [active, setActive] = React.useState(defaultMarker);

  React.useEffect(() => {
    setActive(markerIndex ?? Math.floor(data.length * 0.56));
  }, [data.length, markerIndex]);

  const width = 960;
  const height = 280;
  const baseline = height * 0.9;
  const points = toPoints(data, width, height);
  const line = linePath(points);
  const area = `${line} L${width} ${baseline} L0 ${baseline} Z`;
  const marker = points[Math.min(Math.max(active, 0), points.length - 1)];

  const onMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || points.length < 2) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
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

  return (
    <div className={cn("relative w-full bg-background", className)} {...props}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-[220px] w-full md:h-[280px]"
        role="img"
        aria-label={markerLabel}
        onMouseMove={onMove}
        onMouseLeave={() =>
          setActive(markerIndex ?? Math.floor(data.length * 0.56))
        }
      >
        <path d={area} className="fill-foreground/[0.09]" />
        <path
          d={line}
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line
          x1="0"
          x2={width}
          y1={baseline}
          y2={baseline}
          className="stroke-muted-foreground/30"
          strokeDasharray="2.5 6"
        />
        {marker ? (
          <g>
            <line
              x1={marker.x}
              x2={marker.x}
              y1="36"
              y2={baseline}
              className="stroke-muted-foreground/40"
              strokeWidth="1"
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r="3.5"
              className="fill-muted-foreground"
            />
          </g>
        ) : null}
      </svg>
      {marker ? (
        <div
          className="pointer-events-none absolute top-1 -translate-x-1/2"
          style={{ left: `${(marker.x / width) * 100}%` }}
        >
          <div className="rounded-full border border-border bg-card/90 px-2.5 py-1 text-[11px] text-muted-foreground">
            {markerLabel}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { AreaChart, SAMPLE as areaChartSample };
