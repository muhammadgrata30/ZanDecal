import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Measure unique server-trace files, not the cache or browser chunks in .next.
const build = path.resolve(process.argv[2] || ".next");
const files = new Set();
let traces = 0;
function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "cache" && entry.name !== "static") scan(filename);
    else if (entry.isFile() && entry.name.endsWith(".nft.json")) {
      traces++;
      files.add(filename);
      for (const file of JSON.parse(fs.readFileSync(filename, "utf8")).files) {
        files.add(path.resolve(directory, file));
      }
    }
  }
}
scan(path.join(build, "server"));
for (const name of ["next-server.js.nft.json", "next-minimal-server.js.nft.json"]) {
  const filename = path.join(build, name);
  if (fs.existsSync(filename)) {
    traces++;
    for (const file of JSON.parse(fs.readFileSync(filename, "utf8")).files) files.add(path.resolve(build, file));
  }
}
assert(traces > 0, "No production server traces found; run next build first.");
const sizes = [...files].map(file => ({ file, bytes: fs.statSync(file).size }));
const bytes = sizes.reduce((total, item) => total + item.bytes, 0);
const largest = sizes.sort((a, b) => b.bytes - a.bytes).slice(0, 8);
const mib = value => +(value / 1024 ** 2).toFixed(2);
console.log(JSON.stringify({ traces, files: files.size, serverTraceMiB: mib(bytes), budgetMiB: 200, largest: largest.map(item => ({ file: path.relative(process.cwd(), item.file), MiB: mib(item.bytes) })) }, null, 2));
assert(!sizes.some(item => /[\\/]public[\\/](models|videos|design-preview)[\\/]/.test(item.file)), "Static media must stay outside server traces.");
assert(bytes < 200 * 1024 ** 2, "Server traces exceed the 200 MiB budget; leave headroom for Netlify's handler and dependencies.");
