import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(scriptDir, "../../..");
const registryPath = path.join(monorepoRoot, "registry/registry.json");
const outDir = path.join(monorepoRoot, "apps/docs/public/r");

const uiComponents = [
  "button",
  "badge",
  "card",
  "input",
  "avatar",
  "separator",
  "chart",
  "sparkline",
  "area-chart",
  "line-chart",
  "bar-chart",
  "composed-chart",
  "pie-chart",
  "radar-chart",
  "radial-chart",
  "sankey-chart",
  "trend-card",
  "metric-chart",
  "comparison-chart",
  "breakdown-chart",
  "range-chart",
  "country-chart",
  "ring-metric",
  "cashflow-chart",
  "spotlight-chart",
  "lane-chart",
  "usage-meter",
];

function syncDocsToRegistry() {
  const docsUiDir = path.join(monorepoRoot, "apps/docs/components/ui");
  const registryUiDir = path.join(monorepoRoot, "registry/frostui/ui");
  const docsUtils = path.join(monorepoRoot, "apps/docs/lib/utils.ts");
  const registryUtils = path.join(monorepoRoot, "registry/frostui/lib/utils.ts");

  fs.mkdirSync(registryUiDir, { recursive: true });
  fs.mkdirSync(path.dirname(registryUtils), { recursive: true });

  for (const name of uiComponents) {
    fs.copyFileSync(
      path.join(docsUiDir, `${name}.tsx`),
      path.join(registryUiDir, `${name}.tsx`)
    );
  }

  fs.copyFileSync(docsUtils, registryUtils);
}

function readSource(relativePath) {
  const absolute = path.join(monorepoRoot, relativePath);
  return fs.readFileSync(absolute, "utf8");
}

function buildItem(item) {
  const files = item.files.map((file) => ({
    path: file.target ?? file.path,
    type: file.type,
    content: readSource(file.path),
  }));

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
    files,
  };
}

function main() {
  syncDocsToRegistry();

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

  fs.mkdirSync(outDir, { recursive: true });

  const indexItems = registry.items.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
  }));

  fs.writeFileSync(
    path.join(outDir, "registry.json"),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        name: registry.name,
        homepage: registry.homepage,
        items: indexItems,
      },
      null,
      2
    )
  );

  for (const item of registry.items) {
    fs.writeFileSync(
      path.join(outDir, `${item.name}.json`),
      JSON.stringify(buildItem(item), null, 2)
    );
  }

  console.log(`Built ${registry.items.length} registry items → ${outDir}`);
}

main();
