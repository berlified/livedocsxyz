export type ComponentCategory =
  | "foundations"
  | "forms"
  | "navigation"
  | "overlays"
  | "data-display"
  | "charts"
  | "dashboard"
  | "commerce"
  | "creator"
  | "saas";

export interface ComponentAIGuidance {
  purpose: string;
  useWhen: string[];
  preferOver: string[];
  avoid: string[];
  compositions: string[];
}

export interface RegistryComponent {
  name: string;
  title: string;
  category: ComponentCategory;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: string[];
  examples: string[];
  variants: string[];
  keywords: string[];
  props: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
  }>;
  ai: ComponentAIGuidance;
}

export interface RegistryIndex {
  version: string;
  name: string;
  components: RegistryComponent[];
}
