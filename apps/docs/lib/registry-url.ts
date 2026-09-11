export const REGISTRY_NAME = "frostui";
export const PRODUCTION_REGISTRY_URL = "https://livedocs.xyz/r";

export function getRegistryBaseUrl() {
  if (process.env.NEXT_PUBLIC_REGISTRY_URL) {
    return process.env.NEXT_PUBLIC_REGISTRY_URL.replace(/\/$/, "");
  }
  return PRODUCTION_REGISTRY_URL;
}

export function getShadcnAddCommand(component: string) {
  return `npx shadcn@latest add ${component} --registry ${getRegistryBaseUrl()}`;
}

export function getShadcnAddAllCommand() {
  return `npx shadcn@latest add button badge card input avatar separator --registry ${getRegistryBaseUrl()}`;
}
