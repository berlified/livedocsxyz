#!/usr/bin/env node

import { getComponent, searchComponents, components } from "@frostui/registry";

const REGISTRY_URL =
  process.env.LIVEDOCS_REGISTRY_URL ?? "https://livedocs.xyz/r";

const [, , command, ...args] = process.argv;

function printHelp() {
  console.log(`
livedocs

Usage:
  livedocs add <component>     Print the shadcn install command
  livedocs list                List registry components
  livedocs search <query>      Search components
  livedocs info <component>    Show component metadata

Examples:
  livedocs add button
  livedocs search card

Environment:
  LIVEDOCS_REGISTRY_URL        Override registry base URL (default: ${REGISTRY_URL})
`);
}

function shadcnCommand(name: string) {
  return `npx shadcn@latest add ${REGISTRY_URL}/${name}.json`;
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
        console.error("Missing component name. Example: livedocs add button");
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
