#!/usr/bin/env node
/**
 * FrostUI CLI — Phase 1 scaffold
 *
 * Usage:
 *   npx frostui add button
 *   npx frostui list
 *   npx frostui search "metric"
 *
 * Full file-copy install lands in Phase 4. This stub wires registry discovery.
 */

import { components, getComponent, searchComponents } from "@frostui/registry";

const [, , command, ...args] = process.argv;

function printHelp() {
  console.log(`
FrostUI CLI

Usage:
  frostui add <component>     Install a component into your project
  frostui list                List registry components
  frostui search <query>      Search components
  frostui info <component>    Show component metadata

Examples:
  frostui add button
  frostui search card
`);
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
      console.log(`Phase 1: registry ready for "${component.name}".`);
      console.log(`Would install files:`);
      for (const file of component.files) {
        console.log(`  - ${file}`);
      }
      console.log(`\nDependencies: ${component.dependencies.join(", ") || "none"}`);
      console.log(`\nFull copy-install ships in Phase 4. For now, import from @frostui/ui.`);
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
