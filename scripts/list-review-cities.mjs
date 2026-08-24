import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const REVIEW_DIR = path.join(rootDir, 'data', 'review');

if (!fs.existsSync(REVIEW_DIR)) {
  console.error('Directorio no encontrado:', REVIEW_DIR);
  console.log('Ejecuta primero: npm run data:audit');
  process.exit(1);
}

const files = fs.readdirSync(REVIEW_DIR).filter(f => f.endsWith('-candidates.csv'));

const cityStats = [];

for (const file of files) {
  const filePath = path.join(REVIEW_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const candidateCount = lines.length - 1; // exclude header
  const citySlug = file.replace('-candidates.csv', '');
  cityStats.push({ citySlug, file, count: candidateCount });
}

cityStats.sort((a, b) => b.count - a.count);

console.log('\n=== Ciudades con candidatos ===\n');
console.log('Total ciudades:', cityStats.length);
console.log('Total candidatos:', cityStats.reduce((sum, c) => sum + c.count, 0));

console.log('\nTop 20 ciudades por número de candidatos:\n');
for (const { citySlug, count } of cityStats.slice(0, 20)) {
  console.log(`${citySlug}: ${count}`);
}

const summaryPath = path.join(REVIEW_DIR, 'audit-summary.json');
if (fs.existsSync(summaryPath)) {
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  console.log('\n=== Estadisticas de exclusion ===\n');
  console.log('Total registros:', summary.stats.totalRows);
  console.log('Excluidos:');
  console.log('- No Plumber:', summary.stats.excluded.notPlumber);
  console.log('- No OPERATIONAL:', summary.stats.excluded.notOperational);
  console.log('- Datos incompletos:', summary.stats.excluded.missingData);
  console.log('- Categoria excluida:', summary.stats.excluded.excludedCategory);
  console.log('- Duplicados:', summary.stats.excluded.duplicate);
  console.log('- Sospechosos:', summary.stats.excluded.suspicious);
}
