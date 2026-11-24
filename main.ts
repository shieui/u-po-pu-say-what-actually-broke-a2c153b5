// Say What Actually Broke — one line of honest error copy.
//
// Writes a single line to /output/entry.txt: the brutal truth about a
// disk that filled up at 3 a.m. because the logs never stop talking.
//
// Before writing, the line is validated against the competition's gate:
// UTF-8 text, 1 to 200 characters, exactly one line, and not only
// whitespace. A line that fails any of these is refused: nothing is
// written and the process exits non-zero, so a bad entry can never
// be produced silently.

import { mkdirSync, writeFileSync } from "node:fs";

const LINE =
  "The disk filled up at 3 a.m. because the logs never stop talking. Free some space \u2014 the app has nowhere to write and won't come back on its own.";

function validate(line: string): string | null {
  // Must be valid UTF-8: a round trip through UTF-8 must be identical.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    return "line is not valid UTF-8 text";
  }
  if (line.length < 1 || line.length > 200) {
    return `line is ${line.length} characters, must be 1-200`;
  }
  if (line.includes("\n") || line.includes("\r")) {
    return "line must be a single line";
  }
  if (line.trim().length === 0) {
    return "line must not be only whitespace";
  }
  return null;
}

const problem = validate(LINE);
if (problem !== null) {
  console.error(`Refusing to write entry: ${problem}.`);
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE + "\n", "utf8");
