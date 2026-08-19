import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const inputPath = path.resolve(
  process.cwd(),
  "data",
  "audit",
  "priority-24-7-candidates.csv",
);

const raw = fs.readFileSync(inputPath, "utf8");
const rows = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

const byCity = new Map();

for (const row of rows) {
  const city = (row.city ?? "").trim();
  const state = (row.state_code ?? "").trim();

  if (!city || !state) continue;

  const key = `${city}, ${state}`;
  byCity.set(key, (byCity.get(key) ?? 0) + 1);
}

const sorted = [...byCity.entries()]
  .map(([city, count]) => ({ city, count }))
  .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));

console.log("Top cities by priority 24/7 candidates:\n");

for (const { city, count } of sorted.slice(0, 20)) {
  console.log(`${count.toString().padStart(4, " ")} | ${city}`);
}

console.log(`\nTotal cities: ${sorted.length}`);
console.log(`Total priority candidates: ${sorted.reduce((s, c) => s + c.count, 0)}`);