import type { RegistryComponent, RegistryIndex } from "./types";
import chart from "./components/chart.json";
import chartReactions from "./components/chart-reactions.json";
import sparkline from "./components/sparkline.json";
import areaChart from "./components/area-chart.json";
import lineChart from "./components/line-chart.json";
import barChart from "./components/bar-chart.json";
import composedChart from "./components/composed-chart.json";
import pieChart from "./components/pie-chart.json";
import radarChart from "./components/radar-chart.json";
import radialChart from "./components/radial-chart.json";
import sankeyChart from "./components/sankey-chart.json";
import trendCard from "./components/trend-card.json";
import metricChart from "./components/metric-chart.json";
import comparisonChart from "./components/comparison-chart.json";
import breakdownChart from "./components/breakdown-chart.json";
import rangeChart from "./components/range-chart.json";
import countryChart from "./components/country-chart.json";
import ringMetric from "./components/ring-metric.json";
import cashflowChart from "./components/cashflow-chart.json";
import spotlightChart from "./components/spotlight-chart.json";
import laneChart from "./components/lane-chart.json";
import usageMeter from "./components/usage-meter.json";
import heatmapChart from "./components/heatmap-chart.json";
import funnelChart from "./components/funnel-chart.json";
import scatterChart from "./components/scatter-chart.json";
import waterfallChart from "./components/waterfall-chart.json";
import candlestickChart from "./components/candlestick-chart.json";
import activityChart from "./components/activity-chart.json";

export type {
  ComponentAIGuidance,
  ComponentCategory,
  RegistryComponent,
  RegistryIndex,
} from "./types";

export const components: RegistryComponent[] = [
  chart,
  chartReactions,
  sparkline,
  areaChart,
  lineChart,
  barChart,
  composedChart,
  pieChart,
  radarChart,
  radialChart,
  sankeyChart,
  trendCard,
  metricChart,
  comparisonChart,
  breakdownChart,
  rangeChart,
  countryChart,
  ringMetric,
  cashflowChart,
  spotlightChart,
  laneChart,
  usageMeter,
  heatmapChart,
  funnelChart,
  scatterChart,
  waterfallChart,
  candlestickChart,
  activityChart,
] as RegistryComponent[];

export const registry: RegistryIndex = {
  version: "0.1.0",
  name: "livedocs",
  components,
};

export const categories = [
  { id: "charts", title: "Charts", description: "Analytics visualizations" },
] as const;

export function getComponent(name: string): RegistryComponent | undefined {
  return components.find((c) => c.name === name);
}

function fieldScore(query: string, value: string, weight: number) {
  const text = value.toLowerCase();
  if (!text || !query) return 0;
  if (text === query) return weight * 5;
  if (text.startsWith(query)) return weight * 4;
  if (text.includes(query)) return weight * 2;
  return 0;
}

function scoreComponent(component: RegistryComponent, query: string) {
  const tokens = query.split(/\s+/).filter(Boolean);
  const haystack = [
    component.name,
    component.name.replaceAll("-", " "),
    component.title,
    component.description,
    component.category,
    ...component.keywords,
    ...component.variants,
    ...component.props.map((prop) => `${prop.name} ${prop.description}`),
    component.ai.purpose,
    ...component.ai.useWhen,
  ]
    .join(" ")
    .toLowerCase();

  if (!tokens.every((token) => haystack.includes(token))) return 0;

  return (
    fieldScore(query, component.title, 50) +
    fieldScore(query, component.name.replaceAll("-", " "), 42) +
    fieldScore(query, component.name, 36) +
    component.keywords.reduce((sum, keyword) => sum + fieldScore(query, keyword, 18), 0) +
    fieldScore(query, component.description, 8) +
    fieldScore(query, component.ai.purpose, 6) +
    tokens.length * 4
  );
}

export function searchComponents(query: string): RegistryComponent[] {
  const q = query.trim().toLowerCase();
  if (!q) return components;

  return components
    .map((component) => ({ component, score: scoreComponent(component, q) }))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.component.title.localeCompare(b.component.title)
    )
    .map((item) => item.component);
}

export function getComponentsByCategory(category: string): RegistryComponent[] {
  return components.filter((c) => c.category === category);
}
