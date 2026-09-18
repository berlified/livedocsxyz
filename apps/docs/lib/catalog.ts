import {
  components,
  searchComponents,
  type RegistryComponent,
} from "@frostui/registry";

const HIDDEN = new Set(["chart", "chart-reactions"]);

export function isVisibleComponent(name: string) {
  return !HIDDEN.has(name);
}

export const visibleComponents: RegistryComponent[] = components.filter(
  (component) => !HIDDEN.has(component.name)
);

export function searchVisibleComponents(query: string): RegistryComponent[] {
  return searchComponents(query).filter((component) => !HIDDEN.has(component.name));
}
