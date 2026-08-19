import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const inputPath = path.resolve(
  process.cwd(),
  "data",
  "audit",
  "priority-24-7-candidates.csv",
);

const mvpCities = [
  { city: "Mesa", state_code: "AZ" },
  { city: "Miami", state_code: "FL" },
  { city: "San Diego", state_code: "CA" },
  { city: "Dallas", state_code: "TX" },
  { city: "Chula Vista", state_code: "CA" },
  { city: "Gilbert", state_code: "AZ" },
  { city: "Irving", state_code: "TX" },
  { city: "Miami Beach", state_code: "FL" },
  { city: "Boston", state_code: "MA" },
  { city: "Phoenix", state_code: "AZ" },
  { city: "Quincy", state_code: "MA" },
  { city: "Cambridge", state_code: "MA" },
  { city: "National City", state_code: "CA" },
  { city: "Doral", state_code: "FL" },
  { city: "Dorchester", state_code: "MA" },
  { city: "Fort Worth", state_code: "TX" },
  { city: "Grand Prairie", state_code: "TX" },
  { city: "Grapevine", state_code: "TX" },
  { city: "North Miami", state_code: "FL" },
  { city: "Farmers Branch", state_code: "TX" },
];

const raw = fs.readFileSync(inputPath, "utf8");
const rows = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

const mvpSet = new Set(
  mvpCities.map((c) => `${c.city}|${c.state_code}`),
);

const selected = rows.filter((row) => {
  const city = (row.city ?? "").trim();
  const state_code = (row.state_code ?? "").trim();

  return mvpSet.has(`${city}|${state_code}`);
});

const outputDir = path.resolve(process.cwd(), "data", "mvp");
fs.mkdirSync(outputDir, { recursive: true });

const csvEscape = (value) => {
  const str = typeof value === "boolean" ? String(value) : String(value ?? "");

  if (/[,"\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};

const headers = selected.length ? Object.keys(selected[0]) : [];

const content = [
  headers.join(","),
  ...selected.map((row) =>
    headers.map((h) => csvEscape(row[h])).join(","),
  ),
].join("\n");

const outputPath = path.join(outputDir, "mvp-cities-priority.csv");
fs.writeFileSync(outputPath, content, "utf8");

const byCity = new Map();

for (const row of selected) {
  const key = `${row.city}, ${row.state_code}`;
  byCity.set(key, (byCity.get(key) ?? 0) + 1);
}

console.log(`MVP cities CSV written to: ${outputPath}`);
console.log("\nRecords by city:\n");

for (const [city, count] of [...byCity.entries()].sort((a, b) =>
  b[1] - a[1] || a[0].localeCompare(b[0]),
)) {
  console.log(`${count.toString().padStart(4, " ")} | ${city}`);
}

console.log(`\nTotal MVP candidates: ${selected.length}`);