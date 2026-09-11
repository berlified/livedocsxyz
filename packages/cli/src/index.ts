#!/usr/bin/env node

import { getComponent, searchComponents, components } from "@frostui/registry";

const REGISTRY_URL =
  process.env.FROSTUI_REGISTRY_URL ?? "https://livedocs.xyz/r";

const [, , command, ...args] = process.argv;

function printHelp() {
  console.log(`
FrostUI CLI

Usage:
  frostui add <component>     Print shadcn install command
  frostui list                List registry components
  frostui search <query>      Search components
  frostui info <component>    Show component metadata

Examples:
  frostui add button
  frostui search card

Environment:
  FROSTUI_REGISTRY_URL        Override registry base URL (default: ${REGISTRY_URL})
`);
}

function shadcnCommand(name: string) {
  return `npx shadcn@latest add ${name} --registry ${REGISTRY_URL}`;
}

function main() {
  switch (command) {
    case "list": {
      for (const c of components) {
        console.log(`${c.name.padEnd(14)} ${c.category.padEnd(14)} ${c.description}`);
      }
      break;
    }
    case "search": {
      const query = args.join(" ");
      const results = searchComponents(query);
      if (!results.length) {
        console.log(`No components found for "${query}"`);
        process.exitCode = 1;
        break;
      }
      for (const c of results) {
        console.log(`${c.name} — ${c.description}`);
      }
      break;
    }
    case "info": {
      const name = args[0];
      if (!name) {
        console.error("Missing component name");
        process.exitCode = 1;
        break;
      }
      const component = getComponent(name);
      if (!component) {
        console.error(`Unknown component: ${name}`);
        process.exitCode = 1;
        break;
      }
      console.log(JSON.stringify(component, null, 2));
      break;
    }
    case "add": {
      const name = args[0];
      if (!name) {
        console.error("Missing component name. Example: frostui add button");
        process.exitCode = 1;
        break;
      }
      const component = getComponent(name);
      if (!component) {
        console.error(`Unknown component: ${name}`);
        process.exitCode = 1;
        break;
      }
      console.log(shadcnCommand(component.name));
      console.log(`\nInstalls into @/components/ui/${component.name}.tsx`);
      break;
    }
    case "help":
    case "--help":
    case "-h":
    case undefined:
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exitCode = 1;
  }
}

main();
