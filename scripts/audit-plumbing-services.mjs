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

const categoriesToExclude = new Set([
  'Plumbing supply store',
  'HVAC contractor',
  'General contractor',
  'Handyman',
  'Water damage restoration service',
  'Pool cleaning service',
  'Appliance repair service',
  'Electrician'
]);

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

function isExcludedCategory(category) {
  const normalized = normalizeCategory(category);
  return categoriesToExclude.has(category.trim());
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
    notOperational: 0,
    missingData: 0,
    excludedCategory: 0,
    duplicate: 0,
    suspicious: 0
  },
  candidatesByCity: {}
};

const candidatesByCity = {};

for (const row of rows) {
  const placeId = getField(row, 'place_id');
  const name = getField(row, 'name');
  const category = getField(row, 'category');
  const businessStatus = getField(row, 'business_status');
  const phone = getField(row, 'phone');
  const city = getField(row, 'city');
  const stateCode = getField(row, 'state_code');
  const postalCode = getField(row, 'postal_code');
  const address = getField(row, 'address');
  const website = getField(row, 'website');
  const workingHours = getField(row, 'working_hours');
  const plusCode = getField(row, 'plus_code');
  const latitude = getField(row, 'latitude');
  const longitude = getField(row, 'longitude');
  const time_zone = getField(row, 'time_zone');
  const cid = getField(row, 'cid');
  const data_id = getField(row, 'data_id');
  const about = getField(row, 'about');
  const address_link = getField(row, 'address_link');
  const open_state = getField(row, 'open_state');
  const reviews_link = getField(row, 'reviews_link');
  const thumbnail = getField(row, 'thumbnail');
  const type = getField(row, 'type');
  const located_in = getField(row, 'located_in');
  const working_hours_old = getField(row, 'working_hours_old');
  const reservations_link = getField(row, 'reservations_link');
  const order_links = getField(row, 'order_links');
  const menu_link = getField(row, 'menu_link');
  const owner_title = getField(row, 'owner_title');
  const owner_link = getField(row, 'owner_link');
  const booking_link = getField(row, 'booking_link');

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

  // Filtro 1: categoría Plumber
  const primaryCategory = type || category;
  if (!isPlumberCategory(primaryCategory)) {
    stats.excluded.notPlumber++;
    continue;
  }

  // Filtro 2: estado operacional
  if (businessStatus !== 'OPERATIONAL') {
    stats.excluded.notOperational++;
    continue;
  }

  stats.byCity[cityKey].plumberOperational++;

  // Filtro 3: datos mínimos
  if (!phone || !city || !stateCode || !postalCode) {
    stats.excluded.missingData++;
    continue;
  }

  // Filtro 4: categoría excluida
  if (isExcludedCategory(category)) {
    stats.excluded.excludedCategory++;
    continue;
  }

  // Filtro 5: duplicados
  const phoneNormalized = phone.replace(/[^0-9+]/g, '');
  if (seenPlaceIds.has(placeId) || seenPhones.has(phoneNormalized) || seenNameAddress.has(`${name.trim().toLowerCase()}|${address.trim().toLowerCase()}`)) {
    stats.excluded.duplicate++;
    continue;
  }
  seenPlaceIds.add(placeId);
  seenPhones.add(phoneNormalized);
  seenNameAddress.add(`${name.trim().toLowerCase()}|${address.trim().toLowerCase()}`);

  // Filtro 6: datos sospechosos
  const hasSuspiciousAddress = address.toLowerCase().includes('incorrect address') || address.toLowerCase().includes('temporarily closed');
  if (hasSuspiciousAddress) {
    stats.excluded.suspicious++;
    continue;
  }

  // Candidato válido
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
    plus_code: plusCode || '',
    latitude: latitude || '',
    longitude: longitude || ''
  };

  const citySlug = slugify(cityKey);
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

// Escribir CSV por ciudad
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

// Escribir resumen
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
console.log('- No OPERATIONAL:', stats.excluded.notOperational);
console.log('- Datos incompletos:', stats.excluded.missingData);
console.log('- Categoria excluida:', stats.excluded.excludedCategory);
console.log('- Duplicados:', stats.excluded.duplicate);
console.log('- Sospechosos:', stats.excluded.suspicious);

console.log('\nTotal candidatos por ciudad:');
for (const [citySlug, count] of Object.entries(stats.candidatesByCity)) {
  console.log(`- ${citySlug}: ${count}`);
}
