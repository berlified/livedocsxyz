"use client";

import * as React from "react";
import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Sankey as RechartsSankey,
  type SankeyLinkProps,
  type SankeyNodeProps,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type SankeyNode = { name: string };
export type SankeyLink = { source: number; target: number; value: number };

function ChartSankey({
  nodes,
  links,
  config,
  className,
  isLoading,
}: {
  nodes: SankeyNode[];
  links: SankeyLink[];
  config: ChartConfig;
  className?: string;
  isLoading?: boolean;
}) {
  return (
    <ChartContainer
      config={config}
      data={nodes as unknown as Record<string, unknown>[]}
      className={cn("h-80 w-full", className)}
    >
      {isLoading ? (
        <div className="h-full w-full animate-pulse rounded-xl bg-muted/40" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsSankey
            data={{ nodes, links }}
            nodePadding={24}
            nodeWidth={12}
            linkCurvature={0.5}
            iterations={32}
            node={renderSankeyNode}
            link={renderSankeyLink}
            margin={{ top: 8, right: 120, left: 8, bottom: 8 }}
          />
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
}

function renderSankeyNode(props: SankeyNodeProps) {
  const { x, y, width, height, payload } = props;
  return (
    <Layer>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="var(--chart-1)"
        radius={4}
      />
      <text
        x={x + width + 8}
        y={y + height / 2}
        dominantBaseline="middle"
        className="fill-muted-foreground text-[11px]"
      >
        {payload.name}
      </text>
    </Layer>
  );
}

function renderSankeyLink(props: SankeyLinkProps) {
  const {
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
  } = props;
  return (
    <path
      d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      fill="none"
      stroke="var(--chart-1)"
      strokeOpacity={0.28}
      strokeWidth={linkWidth}
    />
  );
}

export const SankeyChart = Object.assign(ChartSankey, {});
