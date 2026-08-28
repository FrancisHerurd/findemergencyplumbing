import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

type CsvRow = Record<string, string>;

export type Plumber = {
  id: string;
  name: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  category: string;
  type: string;
  subtypes: string;
  phone: string;
  website: string;
  address: string;
  hasAddress: boolean;
  hasPhone: boolean;
  hasWebsite: boolean;
  open24Hours: boolean;
  emergencyEvidence: boolean;
  citySlug: string;
  photo: string;
  workingHours: string;
};

export type CityContent = {
  intro: string;
  coverage: string;
  commonIssues: string;
  localTips: string;
  howToUse: string;
  disclaimer: string;
};

function getMvpCsvPath(): string {
  return path.resolve(process.cwd(), "data", "mvp", "mvp-cities-priority.csv");
}

function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseMvpCsv(): Plumber[] {
  const csvPath = getMvpCsvPath();

  if (!fs.existsSync(csvPath)) {
    throw new Error(`MVP CSV not found: ${csvPath}`);
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  const plumbers: Plumber[] = [];

  for (const row of rows) {
    const city = (row.city ?? "").trim();
    const state = (row.state ?? "").trim();
    const stateCode = (row.state_code ?? "").trim();
    const postalCode = (row.postal_code ?? "").trim();

    if (!city || !stateCode) continue;

    const citySlug = normalizeSlug(`${city}-${stateCode}`);

    plumbers.push({
      id: row.source_record_id || `${city}-${stateCode}-${row.name}`.toLowerCase(),
      name: (row.name ?? "").trim(),
      city,
      state,
      stateCode,
      postalCode,
      category: (row.category ?? "").trim(),
      type: (row.type ?? "").trim(),
      subtypes: (row.subtypes ?? "").trim(),
      phone: (row.phone ?? "").trim(),
      website: (row.website ?? "").trim(),
      address: (row.address ?? "").trim(),
      hasAddress: Boolean(cleanText(row.address)),
      hasPhone: Boolean(cleanPhone(row.phone)),
      hasWebsite: Boolean(cleanWebsite(row.website)),
      open24Hours: row.open_24_hours === "true",
      emergencyEvidence: row.emergency_evidence === "true",
      citySlug,
      photo: (row.photo ?? "").trim(),
      workingHours: (row.working_hours ?? "").trim(),
    });
  }

  return plumbers;
}

function cleanText(value = ""): string {
  return String(value).replace(/\s+/g, " ").trim();
}

function cleanPhone(value = ""): string {
  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;

  return "";
}

function cleanWebsite(value = ""): string {
  const rawValue = cleanText(value);

  if (!rawValue) return "";

  try {
    const url = new URL(rawValue);
    return `${url.protocol}//${url.hostname}${url.pathname}`.replace(/\/$/, "");
  } catch {
    return "";
  }
}

let _cache: Plumber[] | null = null;

function getAllPlumbers(): Plumber[] {
  if (!_cache) {
    _cache = parseMvpCsv();
  }
  return _cache;
}

export function getPlumbersByCitySlug(citySlug: string): Plumber[] {
  const all = getAllPlumbers();

  // Intentar match directo primero (ej: mesa-az)
  let result = all.filter((p) => p.citySlug === citySlug);

  if (result.length > 0) {
    return result;
  }

  // Si no hay match, intentar sin el estado (ej: mesa)
  const slugSinEstado = citySlug.split('-').slice(0, -1).join('-');
  result = all.filter((p) => {
    const plumberSlugSinEstado = p.citySlug.split('-').slice(0, -1).join('-');
    return plumberSlugSinEstado === slugSinEstado;
  });

  return result;
}

export function getAvailableCitySlugs(): string[] {
  const all = getAllPlumbers();
  const slugs = new Set(all.map((p) => p.citySlug));
  return [...slugs].sort();
}

export function getCityInfoBySlug(citySlug: string): {
  city: string;
  state: string;
  stateCode: string;
  count: number;
} | null {
  const plumbers = getPlumbersByCitySlug(citySlug);
  if (plumbers.length === 0) return null;

  const first = plumbers[0];
  return {
    city: first.city,
    state: first.state,
    stateCode: first.stateCode,
    count: plumbers.length,
  };
}