#!/usr/bin/env node

import { main } from "../dist/cli.js";

main(process.argv.slice(2)).catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
