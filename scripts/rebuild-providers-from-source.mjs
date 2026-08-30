// Ejecutar desde la raíz del proyecto: node rebuild-providers-from-source.mjs
//
// Regenera data/providers/*.json a partir de data/plumbing-services.csv (los 500
// negocios originales), aplicando el criterio acordado:
//   - INCLUIR si category/type = "Plumber" exacto, O subtypes contiene el token
//     exacto "Plumber" (no solo la palabra "plumbing" en el nombre).
//   - INCLUIR también los 8 casos revisados manualmente donde el nombre indica
//     claramente que es una empresa de fontanería aunque Google los clasificó mal.
//   - NO se filtra por 24/7: se incluye igual, solo se marca is24Hours true/false.
//   - EXCLUIR tiendas de suministros, sindicatos, escuelas, agencias de marketing,
//     gestión de propiedades, talleres de coches, fabricantes, etc.
//   - Phoenix (phoenix-az) y Fort Worth (fort-worth-tx) se EXCLUYEN de este
//     proceso porque ya están regenerados aparte con datos más completos (xlsx).
//
// Salidas:
//   - data/providers/{citySlug}.json   (uno por ciudad, sobrescribe si existe)
//   - data/audit/excluded-88.csv       (lista de descartados con motivo)
//   - Elimina automáticamente los data/providers/{ciudad-sin-estado}.json
//     que quedan reemplazados por su versión con estado (ciudad-estado.json).

import fs from "fs";
import path from "path";

const SOURCE_CSV = path.join(process.cwd(), "data", "plumbing-services.csv");
const PROVIDERS_DIR = path.join(process.cwd(), "data", "providers");
const AUDIT_DIR = path.join(process.cwd(), "data", "audit");

const EXCLUDE_CITIES_SLUG = new Set(["phoenix-az", "fort-worth-tx"]);

const MANUAL_INCLUDE_NAMES = new Set([
  "GGG Plumbing Co Inc",
  "Big Lou's Quality Plumbing, Inc",
  "East Cambridge Plumbing & Heating",
  "John's Plumbing & Heating",
  "Mark Ondras Plumbing",
  "The Perfect Chula Vista Plumbing & Drain Cleaning Pro",
  "Matrix Plumbing And Mechanical",
  "All Season Plumbing And Air",
]);

function parseCSV(raw) {
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  const header = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const row = {};
    header.forEach((h, i) => (row[h] = values[i] ?? ""));
    return row;
  });
}

function parseLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function csvEscape(value) {
  if (value === undefined || value === null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const raw = fs.readFileSync(SOURCE_CSV, "utf-8");
const rows = parseCSV(raw);
console.log(`Filas leídas de plumbing-services.csv: ${rows.length}`);

const included = [];
const excluded = [];

for (const row of rows) {
  const subtypesTokens = (row.subtypes || "")
    .split(",")
    .map((s) => s.trim().toLowerCase());
  const isPlumberSubtype = subtypesTokens.includes("plumber");
  const isPlumberType = (row.type || "").trim().toLowerCase() === "plumber";
  const isPlumberCategory =
    (row.category || "").trim().toLowerCase() === "plumber";
  const manualInclude = MANUAL_INCLUDE_NAMES.has(row.name);

  const shouldInclude =
    isPlumberSubtype || isPlumberType || isPlumberCategory || manualInclude;

  if (shouldInclude) {
    included.push(row);
  } else {
    excluded.push({
      ...row,
      exclude_reason: `No es servicio de plomería (categoría: ${row.category})`,
    });
  }
}

console.log(`Incluidos: ${included.length} | Excluidos: ${excluded.length}`);

// Agrupar por citySlug (ciudad-estado)
const byCity = new Map();
for (const row of included) {
  const citySlug = `${slugify(row.city)}-${(row.state_code || "").toLowerCase()}`;
  if (EXCLUDE_CITIES_SLUG.has(citySlug)) continue; // Phoenix/Fort Worth ya gestionados aparte
  if (!byCity.has(citySlug)) byCity.set(citySlug, []);
  byCity.get(citySlug).push(row);
}

fs.mkdirSync(PROVIDERS_DIR, { recursive: true });
fs.mkdirSync(AUDIT_DIR, { recursive: true });

const now = new Date().toISOString();
let filesWritten = 0;
let oldFilesRemoved = 0;

for (const [citySlug, providersRaw] of byCity.entries()) {
  const providers = providersRaw.map((row) => {
    const workingHours = row.working_hours || "";
    const is24Hours = workingHours.includes("Open 24 hours");
    return {
      id: row.place_id,
      name: row.name,
      phone: row.phone,
      website: row.website || "",
      address: row.address,
      city: row.city,
      stateCode: row.state_code,
      postalCode: row.postal_code,
      category: row.category,
      workingHours,
      is24Hours,
      mapUrl: "",
      plusCode: "",
      latitude: String(row.latitude || "").replace(".", ","),
      longitude: String(row.longitude || "").replace(".", ","),
      status: "approved",
      sourceCheckedAt: now,
    };
  });

  const cityBaseSlug = citySlug.replace(/-[a-z]{2}$/, "");
  const oldPath = path.join(PROVIDERS_DIR, `${cityBaseSlug}.json`);
  if (fs.existsSync(oldPath) && cityBaseSlug !== citySlug) {
    fs.unlinkSync(oldPath);
    oldFilesRemoved++;
  }

  const outPath = path.join(PROVIDERS_DIR, `${citySlug}.json`);
  fs.writeFileSync(
    outPath,
    JSON.stringify({ citySlug, generatedAt: now, providers }, null, 2),
    "utf-8"
  );
  filesWritten++;
}

// Guardar CSV de excluidos para revisión
const exclHeader = [
  "name",
  "city",
  "state_code",
  "category",
  "type",
  "phone",
  "exclude_reason",
];
const exclLines = [exclHeader.join(",")];
for (const row of excluded) {
  exclLines.push(exclHeader.map((h) => csvEscape(row[h])).join(","));
}
fs.writeFileSync(
  path.join(AUDIT_DIR, "excluded-88.csv"),
  exclLines.join("\n"),
  "utf-8"
);

console.log(`\nArchivos de ciudad escritos: ${filesWritten}`);
console.log(`Archivos antiguos sin estado eliminados: ${oldFilesRemoved}`);
console.log(`CSV de excluidos: data/audit/excluded-88.csv`);
console.log("\nNo se hizo commit ni push. Revisa los cambios con git status/git diff antes de subir.");
