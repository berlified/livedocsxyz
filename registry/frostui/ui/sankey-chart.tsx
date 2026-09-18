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

import { ChartContainer, colorVar, type ChartConfig, useChart } from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { Button } from "@/components/ui/button";
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
  defaultSelectedDataKey,
  onSelectionChange,
}: {
  nodes: SankeyNode[];
  links: SankeyLink[];
  config: ChartConfig;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  defaultSelectedDataKey?: string;
  onSelectionChange?: (key?: string) => void;
}) {
  return (
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="sankey"
      reaction={reaction}
      config={config}
      data={nodes as unknown as Record<string, unknown>[]}
      className={cn("h-auto min-h-[440px] w-full sm:h-[440px]", className)}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      <SankeyBody nodes={nodes} links={links} />
    </ChartContainer>
  );
}

function SankeyBody({ nodes, links }: { nodes: SankeyNode[]; links: SankeyLink[] }) {
  const { config, selected, setSelected } = useChart();
  const [hoveredKey, setHoveredKey] = React.useState<string>();
  const [focusedKey, setFocusedKey] = React.useState<string>();
  const activeKey = hoveredKey ?? focusedKey ?? selected;
  const tooltipKey = hoveredKey ?? focusedKey;
  const legendId = React.useId();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const transition = animationsEnabled && !reducedMotion ? "opacity 180ms ease, stroke-width 180ms ease" : "none";
  const linkKey = (index: number) => `link:${index}`;
  const nodeKey = (index: number) => `node:${index}`;
  const nodeValue = (index: number) => Math.max(
    links.reduce((sum, link) => sum + (link.source === index ? link.value : 0), 0),
    links.reduce((sum, link) => sum + (link.target === index ? link.value : 0), 0)
  );
  const nodeColor = (index: number) => config[(nodes[index]?.name ?? "")] ? colorVar(nodes[index]?.name ?? "") : `var(--chart-${index % 5 + 1})`;
  const nodeLabel = (index: number) => config[(nodes[index]?.name ?? "")]?.label ?? (nodes[index]?.name ?? "");
  const accessibleLabel = (index: number) => typeof nodeLabel(index) === "string" ? String(nodeLabel(index)) : (nodes[index]?.name ?? "");
  const formatValue = (index: number, value: number) => config[(nodes[index]?.name ?? "")]?.valueFormatter?.(value) ?? value.toLocaleString("en-US");
  const activeNode = nodes.findIndex((node, index) => nodeKey(index) === activeKey || node.name === activeKey);
  const activeLink = links.findIndex((_, index) => linkKey(index) === activeKey);
  const isRelatedNode = (index: number) => !activeKey || activeNode === index ||
    (activeLink >= 0 && (links[activeLink]?.source === index || links[activeLink]?.target === index)) ||
    (activeNode >= 0 && links.some((link) => (link.source === activeNode && link.target === index) || (link.target === activeNode && link.source === index)));
  const isRelatedLink = (index: number) => !activeKey || activeLink === index || links[index]?.source === activeNode || links[index]?.target === activeNode;
  const events = (key: string) => ({
    tabIndex: 0,
    role: "button",
    "aria-pressed": selected === key,
    className: "cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    onMouseEnter: () => setHoveredKey(key),
    onMouseLeave: () => setHoveredKey(undefined),
    onFocus: () => setFocusedKey(key),
    onBlur: () => setFocusedKey(undefined),
    onClick: () => setSelected(key),
    onKeyDown: (event: React.KeyboardEvent<SVGElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        setSelected(key);
      }
    },
  });
  const tooltipNode = nodes.findIndex((_, index) => nodeKey(index) === tooltipKey);
  const tooltipLink = links.findIndex((_, index) => linkKey(index) === tooltipKey);
  const detailLink = links[tooltipLink];
  const detailNode = detailLink?.source ?? tooltipNode;
  const renderNode = ({ x, y, width, height, index, payload }: SankeyNodeProps) => {
    const key = nodeKey(index);
    const terminal = !links.some((link) => link.source === index);
    const labelX = terminal ? x - 10 : x + width + 10;
    return (
      <Layer
        {...events(key)}
        aria-label={`${accessibleLabel(index)}: ${nodeValue(index)}`}
        style={{ opacity: isRelatedNode(index) ? 1 : 0.6, transition }}
      >
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={Math.max(height, 2)}
          fill={nodeColor(index)}
          stroke={focusedKey === key ? "var(--ring)" : "var(--background)"}
          strokeWidth={activeNode === index ? 3 : 1}
          radius={3}
        />
        <text
          x={labelX}
          y={y + height / 2 - 8}
          textAnchor={terminal ? "end" : "start"}
          dominantBaseline="middle"
          className="fill-foreground text-xs font-medium"
          pointerEvents="none"
        >
          {typeof nodeLabel(index) === "string" ? String(nodeLabel(index)) : payload.name}
        </text>
        <text
          x={labelX}
          y={y + height / 2 + 10}
          textAnchor={terminal ? "end" : "start"}
          dominantBaseline="middle"
          className="fill-muted-foreground font-mono text-xs font-bold tabular-nums"
          pointerEvents="none"
        >
          {nodeValue(index).toLocaleString("en-US")}
        </text>
      </Layer>
    );
  };
  const renderLink = ({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index }: SankeyLinkProps) => {
    const link = links[index];
    if (!link) return <path />;
    const key = linkKey(index);
    return (
      <path
        {...events(key)}
        aria-label={`${accessibleLabel(link.source)} to ${accessibleLabel(link.target)}: ${link.value}`}
        d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
        fill="none"
        stroke={focusedKey === key ? "var(--ring)" : nodeColor(link.source)}
        strokeOpacity={isRelatedLink(index) && activeKey ? 0.7 : 0.35}
        opacity={isRelatedLink(index) ? 1 : 0.6}
        strokeWidth={Math.max(linkWidth, 2)}
        style={{ transition }}
      />
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <div className="relative min-h-64 flex-1">
        <div role="region" aria-label="Flow diagram" tabIndex={0} className="h-full min-h-64 overflow-x-auto rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
          <div className="h-full min-h-64 min-w-[520px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <RechartsSankey
                data={{ nodes, links }}
                nodePadding={40}
                nodeWidth={18}
                linkCurvature={0.5}
                iterations={32}
                node={renderNode}
                link={renderLink}
                margin={{ top: 16, right: 12, left: 12, bottom: 16 }}
              />
            </ResponsiveContainer>
          </div>
        </div>
        {detailNode >= 0 ? (
          <div role="tooltip" className="pointer-events-none absolute left-1/2 top-0 z-10 w-max max-w-full -translate-x-1/2 rounded-sm bg-[var(--chart-tooltip-background,var(--popover))] px-3.5 py-3 text-xs text-[var(--chart-tooltip-foreground,var(--popover-foreground))] shadow-lg">
            <p className="mb-2 font-bold">{tooltipLink >= 0 ? "Flow" : "Total flow"}</p>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-[var(--chart-tooltip-muted,var(--muted-foreground))]">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: nodeColor(detailNode) }} />
                {nodeLabel(detailNode)}{detailLink ? <> → {nodeLabel(detailLink.target)}</> : null}
              </span>
              <span className="font-mono font-bold tabular-nums">{formatValue(detailNode, detailLink?.value ?? nodeValue(detailNode))}</span>
            </div>
          </div>
        ) : null}
      </div>
      <div role="group" aria-labelledby={legendId} className="shrink-0 space-y-2">
        <h3 id={legendId} className="px-3 text-sm font-semibold text-foreground">Flow by stage</h3>
        <div className="grid max-h-40 grid-cols-2 gap-1 overflow-y-auto p-1 sm:grid-cols-3">
          {nodes.map((node, index) => (
            <Button
              key={nodeKey(index)}
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={selected === nodeKey(index)}
              onClick={() => setSelected(nodeKey(index))}
              onMouseEnter={() => setHoveredKey(nodeKey(index))}
              onMouseLeave={() => setHoveredKey(undefined)}
              onFocus={() => setFocusedKey(nodeKey(index))}
              onBlur={() => setFocusedKey(undefined)}
              className={cn("h-9 w-full justify-start gap-3 px-3 text-muted-foreground", activeNode === index && "bg-accent text-foreground", !isRelatedNode(index) && "opacity-60")}
            >
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: nodeColor(index) }} />
              <span className="truncate">{config[node.name]?.label ?? node.name}</span>
              <span className="ml-auto shrink-0 font-mono font-bold tabular-nums text-foreground">{formatValue(index, nodeValue(index))}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SankeyChart = Object.assign(ChartSankey, {});
