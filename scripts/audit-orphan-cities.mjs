// Ejecutar desde la raíz del proyecto: node audit-orphan-cities.mjs
// Genera data/audit/orphan-cities-audit.csv con un resumen de todos los
// proveedores en data/providers/*.json, listo para revisión externa.

import fs from "fs";
import path from "path";

const providersDir = path.join(process.cwd(), "data", "providers");
const files = fs.readdirSync(providersDir).filter((f) => f.endsWith(".json"));

const rows = [];
const header = [
    "citySlugFile",
    "citySlug",
    "name",
    "phone",
    "category",
    "is24Hours",
    "id",
    "website",
    "postalCode",
];
rows.push(header.join(","));

function csvEscape(value) {
    if (value === undefined || value === null) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

for (const file of files) {
    const filePath = path.join(providersDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        console.error(`ERROR parseando ${file}: ${e.message}`);
        continue;
    }
    const citySlug = data.citySlug || file.replace(".json", "");
    const providers = Array.isArray(data.providers) ? data.providers : [];
    for (const p of providers) {
        rows.push(
            [
                file,
                citySlug,
                p.name,
                p.phone,
                p.category,
                p.is24Hours,
                p.id,
                p.website,
                p.postalCode,
            ]
                .map(csvEscape)
                .join(",")
        );
    }
}

const outDir = path.join(process.cwd(), "data", "audit");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "orphan-cities-audit.csv");
fs.writeFileSync(outPath, rows.join("\n"), "utf-8");

console.log(`Escrito: ${outPath}`);
console.log(`Total filas de proveedores: ${rows.length - 1}`);
console.log(`Total archivos de ciudad procesados: ${files.length}`);
