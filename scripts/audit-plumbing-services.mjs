import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const INPUT_CSV = path.join(rootDir, 'data', 'plumbing-services.csv');
const OUTPUT_DIR = path.join(rootDir, 'data', 'review');

if (!fs.existsSync(INPUT_CSV)) {
  console.error('CSV no encontrado:', INPUT_CSV);
  process.exit(1);
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const csvText = fs.readFileSync(INPUT_CSV, 'utf-8');
const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
const headers = parseCSVLine(lines[0]);
const rows = lines.slice(1).map(line => parseCSVLine(line));

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

function normalizeCategory(category) {
  return category.trim().toLowerCase();
}

function isPlumberCategory(category) {
  const normalized = normalizeCategory(category);
  return normalized === 'plumber';
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const seenPlaceIds = new Set();
const seenPhones = new Set();
const seenNameAddress = new Set();

const stats = {
  totalRows: rows.length,
  byCity: {},
  excluded: {
    notPlumber: 0,
    noPhone: 0,
    duplicate: 0
  },
  candidatesByCity: {}
};

const candidatesByCity = {};

for (const row of rows) {
  const placeId = getField(row, 'place_id');
  const name = getField(row, 'name');
  const category = getField(row, 'category');
  const phone = getField(row, 'phone');
  const city = getField(row, 'city');
  const stateCode = getField(row, 'state_code');
  const postalCode = getField(row, 'postal_code');
  const address = getField(row, 'address');
  const website = getField(row, 'website');
  const workingHours = getField(row, 'working_hours');
  const type = getField(row, 'type');

  const cityKey = city ? city.trim() : 'unknown';

  if (!stats.byCity[cityKey]) {
    stats.byCity[cityKey] = {
      total: 0,
      plumberOperational: 0,
      withPhoneAndWebsite: 0,
      with24Hours: 0,
      candidates: 0
    };
  }
  stats.byCity[cityKey].total++;

  const primaryCategory = type || category;
  if (!isPlumberCategory(primaryCategory)) {
    stats.excluded.notPlumber++;
    continue;
  }

  stats.byCity[cityKey].plumberOperational++;

  if (!phone || phone.trim().length === 0) {
    stats.excluded.noPhone++;
    continue;
  }

  const phoneNormalized = phone.replace(/[^0-9+]/g, '');
  if (seenPlaceIds.has(placeId) || seenPhones.has(phoneNormalized) || seenNameAddress.has(`${name.trim().toLowerCase()}|${address.trim().toLowerCase()}`)) {
    stats.excluded.duplicate++;
    continue;
  }
  seenPlaceIds.add(placeId);
  seenPhones.add(phoneNormalized);
  seenNameAddress.add(`${name.trim().toLowerCase()}|${address.trim().toLowerCase()}`);

  const is24Hours = workingHours.toLowerCase().includes('open 24 hours');
  if (is24Hours) {
    stats.byCity[cityKey].with24Hours++;
  }

  if (phone && website) {
    stats.byCity[cityKey].withPhoneAndWebsite++;
  }

  const candidate = {
    place_id: placeId,
    name,
    phone,
    website,
    address,
    city,
    state_code: stateCode,
    postal_code: postalCode,
    category,
    working_hours: workingHours,
    is_24_hours: is24Hours ? 'true' : 'false',
    map_url: getField(row, 'map_url') || '',
    plus_code: getField(row, 'plus_code') || '',
    latitude: getField(row, 'latitude') || '',
    longitude: getField(row, 'longitude') || ''
  };

  // Slug con estado: san-diego-ca
  const citySlug = `${slugify(cityKey)}-${stateCode.toLowerCase()}`;
  if (!candidatesByCity[citySlug]) {
    candidatesByCity[citySlug] = [];
  }
  candidatesByCity[citySlug].push(candidate);
  stats.byCity[cityKey].candidates++;

  if (!stats.candidatesByCity[citySlug]) {
    stats.candidatesByCity[citySlug] = 0;
  }
  stats.candidatesByCity[citySlug]++;
}

function toCSVLine(obj, headers) {
  return headers.map(h => {
    const val = obj[h] ?? '';
    const needsQuotes = /[,"\n]/.test(String(val));
    const escaped = String(val).replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  }).join(',');
}

const candidateHeaders = [
  'place_id',
  'name',
  'phone',
  'website',
  'address',
  'city',
  'state_code',
  'postal_code',
  'category',
  'working_hours',
  'is_24_hours',
  'map_url',
  'plus_code',
  'latitude',
  'longitude'
];

for (const [citySlug, candidates] of Object.entries(candidatesByCity)) {
  const csvLines = [
    toCSVLine(candidateHeaders.reduce((acc, h) => ({ ...acc, [h]: h }), {}), candidateHeaders),
    ...candidates.map(c => toCSVLine(c, candidateHeaders))
  ];
  const csvContent = csvLines.join('\n');
  const outputPath = path.join(OUTPUT_DIR, `${citySlug}-candidates.csv`);
  fs.writeFileSync(outputPath, csvContent, 'utf-8');
  console.log(`Generado: ${outputPath} (${candidates.length} candidatos)`);
}

const summary = {
  generatedAt: new Date().toISOString(),
  inputFile: INPUT_CSV,
  stats
};

const summaryPath = path.join(OUTPUT_DIR, 'audit-summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
console.log(`\nResumen generado: ${summaryPath}`);
console.log('\nEstadisticas por ciudad:');
for (const [city, cityStats] of Object.entries(stats.byCity)) {
  console.log(`- ${city}: ${cityStats.candidates} candidatos de ${cityStats.total} registros (${cityStats.plumberOperational} plumbers operativos)`);
}

console.log('\nExcluidos:');
console.log('- No Plumber:', stats.excluded.notPlumber);
console.log('- Sin telefono:', stats.excluded.noPhone);
console.log('- Duplicados:', stats.excluded.duplicate);

console.log('\nTotal candidatos por ciudad:');
for (const [citySlug, count] of Object.entries(stats.candidatesByCity)) {
  console.log(`- ${citySlug}: ${count}`);
}
