import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROVIDERS_DIR = path.join(DATA_DIR, 'providers');

export type Provider = {
  id: string;
  name: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  stateCode: string;
  postalCode: string;
  category: string;
  workingHours?: string;
  is24Hours: boolean;
  mapUrl?: string;
  plusCode?: string;
  latitude?: string;
  longitude?: string;
  status: 'approved';
  sourceCheckedAt: string;
};

export type ProvidersFile = {
  citySlug: string;
  generatedAt: string;
  providers: Provider[];
};

export function loadProviders(citySlug: string): ProvidersFile | null {
  // Intentar primero con el slug completo (ej: mesa-az.json)
  let filePath = path.join(PROVIDERS_DIR, `${citySlug}.json`);

  if (!fs.existsSync(filePath)) {
    // Si falla, intentar sin el estado (ej: mesa.json)
    const slugSinEstado = citySlug.split('-').slice(0, -1).join('-');
    filePath = path.join(PROVIDERS_DIR, `${slugSinEstado}.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as ProvidersFile;
}

export function getAvailableCities(): string[] {
  if (!fs.existsSync(PROVIDERS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(PROVIDERS_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => f.replace('.json', ''));
}
