import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REVIEW_DIR = path.join(rootDir, 'data', 'review');
const PROVIDERS_DIR = path.join(rootDir, 'data', 'providers');

if (!fs.existsSync(REVIEW_DIR)) {
  console.error('Directorio review no encontrado:', REVIEW_DIR);
  console.log('Ejecuta primero: npm run data:audit');
  process.exit(1);
}

if (!fs.existsSync(PROVIDERS_DIR)) {
  fs.mkdirSync(PROVIDERS_DIR, { recursive: true });
}

const files = fs.readdirSync(REVIEW_DIR).filter(f => f.endsWith('-candidates.csv'));

console.log(`\n=== Aprobando todas las ciudades ===\n`);
console.log(`Total ciudades: ${files.length}\n`);

let totalApproved = 0;

for (const file of files) {
  const citySlug = file.replace('-candidates.csv', '');
  const filePath = path.join(REVIEW_DIR, file);
  
  const csvText = fs.readFileSync(filePath, 'utf-8');
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
  
  const providers = [];
  
  for (const row of rows) {
    const provider = {
      id: getField(row, 'place_id'),
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
    
    providers.push(provider);
  }
  
  const outputPath = path.join(PROVIDERS_DIR, `${citySlug}.json`);
  const output = {
    citySlug,
    generatedAt: new Date().toISOString(),
    providers
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  
  console.log(`${citySlug}: ${providers.length} proveedores aprobados`);
  totalApproved += providers.length;
}

console.log(`\n=== Resumen ===`);
console.log(`Ciudades procesadas: ${files.length}`);
console.log(`Total proveedores aprobados: ${totalApproved}`);
console.log(`\nArchivos generados en: ${PROVIDERS_DIR}`);
