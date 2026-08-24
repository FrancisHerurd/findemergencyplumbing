import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REVIEW_DIR = path.join(rootDir, 'data', 'review');
const PROVIDERS_DIR = path.join(rootDir, 'data', 'providers');

const citySlug = process.argv[2];
const approvedIds = process.argv.slice(3);

if (!citySlug) {
  console.error('Uso: node scripts/approve-providers.mjs <citySlug> <place_id_1> [place_id_2] ...');
  console.error('Ejemplo: node scripts/approve-providers.mjs san-diego place_id_1 place_id_2');
  process.exit(1);
}

if (approvedIds.length === 0) {
  console.error('Debes pasar al menos un place_id de negocio a aprobar.');
  process.exit(1);
}

const candidatesFile = path.join(REVIEW_DIR, `${citySlug}-candidates.csv`);
if (!fs.existsSync(candidatesFile)) {
  console.error('CSV de candidatos no encontrado:', candidatesFile);
  console.log('Ejecuta primero: npm run data:audit');
  process.exit(1);
}

if (!fs.existsSync(PROVIDERS_DIR)) {
  fs.mkdirSync(PROVIDERS_DIR, { recursive: true });
}

const csvText = fs.readFileSync(candidatesFile, 'utf-8');
const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
const headers = parseCSVLine(lines[0]);
const rows = lines.slice(1).map(l => parseCSVLine(l));

function parseCSVLine(line) {
  const result = [];
  let current = '';
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
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function getField(row, field) {
  const index = headers.indexOf(field);
  return index >= 0 ? row[index] : '';
}

const approvedProviders = [];
const notFound = [];

for (const placeId of approvedIds) {
  const row = rows.find(r => getField(r, 'place_id') === placeId);
  if (!row) {
    notFound.push(placeId);
    continue;
  }

  const provider = {
    id: placeId,
    name: getField(row, 'name'),
    phone: getField(row, 'phone'),
    website: getField(row, 'website'),
    address: getField(row, 'address'),
    city: getField(row, 'city'),
    stateCode: getField(row, 'state_code'),
    postalCode: getField(row, 'postal_code'),
    category: getField(row, 'category'),
    workingHours: getField(row, 'working_hours'),
    is24Hours: getField(row, 'is_24_hours') === 'true',
    mapUrl: getField(row, 'map_url'),
    plusCode: getField(row, 'plus_code'),
    latitude: getField(row, 'latitude'),
    longitude: getField(row, 'longitude'),
    status: 'approved',
    sourceCheckedAt: new Date().toISOString()
  };

  approvedProviders.push(provider);
}

if (notFound.length > 0) {
  console.warn('\nPlace IDs no encontrados en el CSV:');
  for (const id of notFound) {
    console.warn(' -', id);
  }
  console.log('');
}

if (approvedProviders.length === 0) {
  console.error('No se aprobó¡¡¡ ningún proveedor. Revisa los place_id.');
  process.exit(1);
}

const outputPath = path.join(PROVIDERS_DIR, `${citySlug}.json`);
const output = {
  citySlug,
  generatedAt: new Date().toISOString(),
  providers: approvedProviders
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`\n=== Proveedores aprobados ===`);
console.log(`Ciudad: ${citySlug}`);
console.log(`Aprobados: ${approvedProviders.length}`);
console.log(`Archivo: ${outputPath}`);
console.log('\nProveedores:');
for (const p of approvedProviders) {
  console.log(`- ${p.name} (${p.place_id})`);
}
