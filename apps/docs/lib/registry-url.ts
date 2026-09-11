export const REGISTRY_NAME = "livedocs";
export const PRODUCTION_REGISTRY_URL = "https://livedocs.xyz/r";

export function getRegistryBaseUrl() {
  if (process.env.NEXT_PUBLIC_REGISTRY_URL) {
    return process.env.NEXT_PUBLIC_REGISTRY_URL.replace(/\/$/, "");
  }
  return PRODUCTION_REGISTRY_URL;
}

export function getRegistryItemUrl(component: string) {
  return `${getRegistryBaseUrl()}/${component}.json`;
}

export function getShadcnAddCommand(component: string) {
  return `npx shadcn@latest add ${getRegistryItemUrl(component)}`;
}

export function getShadcnAddAllCommand() {
  const items = ["button", "badge", "card", "input", "avatar", "separator"];
  return `npx shadcn@latest add ${items.map(getRegistryItemUrl).join(" ")}`;
}

export function getNamespaceSetupCommand() {
  return `npx shadcn@latest registry add @livedocs=${getRegistryBaseUrl()}/{name}.json`;
}

export function getNamespacedAddCommand(component: string) {
  return `npx shadcn@latest add @livedocs/${component}`;
}
