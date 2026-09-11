import type { RegistryComponent, RegistryIndex } from "./types";
import button from "./components/button.json";
import badge from "./components/badge.json";
import card from "./components/card.json";
import input from "./components/input.json";
import avatar from "./components/avatar.json";
import separator from "./components/separator.json";
import chart from "./components/chart.json";
import sparkline from "./components/sparkline.json";
import areaChart from "./components/area-chart.json";
import lineChart from "./components/line-chart.json";
import barChart from "./components/bar-chart.json";
import composedChart from "./components/composed-chart.json";
import pieChart from "./components/pie-chart.json";
import radarChart from "./components/radar-chart.json";
import radialChart from "./components/radial-chart.json";
import sankeyChart from "./components/sankey-chart.json";

export type {
  ComponentAIGuidance,
  ComponentCategory,
  RegistryComponent,
  RegistryIndex,
} from "./types";

export const components: RegistryComponent[] = [
  button,
  badge,
  card,
  input,
  avatar,
  separator,
  chart,
  sparkline,
  areaChart,
  lineChart,
  barChart,
  composedChart,
  pieChart,
  radarChart,
  radialChart,
  sankeyChart,
] as RegistryComponent[];

export const registry: RegistryIndex = {
  version: "0.1.0",
  name: "livedocs",
  components,
};

export const categories = [
  { id: "foundations", title: "Foundations", description: "Core primitives" },
  { id: "forms", title: "Forms", description: "Inputs and field controls" },
  { id: "navigation", title: "Navigation", description: "Sidebars, tabs, menus" },
  { id: "overlays", title: "Overlays", description: "Dialogs, sheets, menus" },
  { id: "data-display", title: "Data Display", description: "Tables, lists, metrics" },
  { id: "charts", title: "Charts", description: "Analytics visualizations" },
  { id: "dashboard", title: "Dashboard", description: "Composable dashboard patterns" },
  { id: "commerce", title: "Commerce", description: "Pricing and checkout UI" },
  { id: "creator", title: "Creator", description: "Creator product patterns" },
  { id: "saas", title: "SaaS", description: "Workspace and billing patterns" },
] as const;

export function getComponent(name: string): RegistryComponent | undefined {
  return components.find((c) => c.name === name);
}

export function searchComponents(query: string): RegistryComponent[] {
  const q = query.trim().toLowerCase();
  if (!q) return components;

  return components.filter((c) => {
    const haystack = [
      c.name,
      c.title,
      c.description,
      c.category,
      ...c.keywords,
      ...c.variants,
      ...c.props.map((p) => p.name),
      c.ai.purpose,
      ...c.ai.useWhen,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function getComponentsByCategory(category: string): RegistryComponent[] {
  return components.filter((c) => c.category === category);
}
