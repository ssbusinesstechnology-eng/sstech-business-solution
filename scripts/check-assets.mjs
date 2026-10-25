// Fails the build if any "/assets/..." reference in src/ points to a missing file in public/assets/.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const exts = /\.(tsx?|jsx?|css|html|md)$/;
const ref = /["'`(]\/assets\/([A-Za-z0-9._\-\/]+)/g;
const missing = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.test(name)) {
      const text = readFileSync(p, "utf8");
      for (const m of text.matchAll(ref)) {
        if (!existsSync(join(root, "public/assets", m[1]))) {
          missing.push(`${p.replace(root, "")}: /assets/${m[1]}`);
        }
      }
    }
  }
}

walk(join(root, "src"));

if (missing.length) {
  console.error("Missing files in public/assets/:\n" + missing.map((m) => "  " + m).join("\n"));
  process.exit(1);
}
console.log("Asset check passed: all /assets/ references exist.");
