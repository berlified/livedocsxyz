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

import { ChartContainer, GradientFill, pixelPatternId, type ChartConfig, useChart } from "@/components/ui/chart";
import { type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export type SankeyNode = { name: string };
export type SankeyLink = { source: number; target: number; value: number };

function ChartSankey({
  nodes,
  links,
  config,
  className,
  isLoading,
  reaction,
}: {
  nodes: SankeyNode[];
  links: SankeyLink[];
  config: ChartConfig;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  return (
    <ChartContainer
      isLoading={isLoading}
      reaction={reaction}
      config={config}
      data={nodes as unknown as Record<string, unknown>[]}
      className={cn("h-80 w-full", className)}
    >
      {isLoading ? null : (
        <SankeyBody nodes={nodes} links={links} />
      )}
    </ChartContainer>
  );
}

function SankeyBody({
  nodes,
  links,
}: {
  nodes: SankeyNode[];
  links: SankeyLink[];
}) {
  const { id } = useChart();
  const fillId = pixelPatternId(id, "flow");

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsSankey
        data={{ nodes, links }}
        nodePadding={24}
        nodeWidth={12}
        linkCurvature={0.5}
        iterations={32}
        node={(props) => renderSankeyNode(props, fillId)}
        link={(props) => renderSankeyLink(props, fillId)}
        margin={{ top: 8, right: 120, left: 8, bottom: 8 }}
      >
        <defs>
          <GradientFill id={fillId} color="var(--chart-1)" />
        </defs>
      </RechartsSankey>
    </ResponsiveContainer>
  );
}

function renderSankeyNode(props: SankeyNodeProps, fillId: string) {
  const { x, y, width, height, payload } = props;
  return (
    <Layer>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${fillId})`}
        radius={2}
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

function renderSankeyLink(props: SankeyLinkProps, fillId: string) {
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
      stroke={`url(#${fillId})`}
      strokeOpacity={0.55}
      strokeWidth={linkWidth}
    />
  );
}

export const SankeyChart = Object.assign(ChartSankey, {});
