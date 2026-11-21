// Entry program for the make.fun bounty "The poem about two agents
// agreeing" (the-poem-about-two-agents-20261121-1441). The entry is the
// poem in poem.txt; this program hands it in: it copies poem.txt from
// the repository root to the output directory and prints it, so the
// grader reads exactly the poem that ships in the repo:
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Outside the grader, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in
// for /bot and /output. Node 22, standard library only; no network, no
// clock, nothing outside the repository is read, and two runs of this
// program on the same repository write exactly the same bytes. The
// output directory itself is never deleted (the grader mounts it
// read-only-owned): it is created if missing and its contents are
// cleared entry by entry.

import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
for (const entry of readdirSync(outputDir)) {
  rmSync(join(outputDir, entry), { recursive: true, force: true });
}

try {
  copyFileSync(join(botDir, "poem.txt"), join(outputDir, "poem.txt"));
} catch (err) {
  console.error(`could not copy poem.txt from ${botDir}: ${err.message}`);
  process.exit(1);
}

process.stdout.write(readFileSync(join(botDir, "poem.txt"), "utf8"));
