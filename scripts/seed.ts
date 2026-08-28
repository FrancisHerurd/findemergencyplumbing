// scripts/seed.ts
// Migra data/mvp/mvp-cities-priority.csv a Supabase (cities + plumbers).
// Ejecutar con: npm run db:seed

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { db, schema } from "../src/db";

interface CsvRow {
  name: string;
  city: string;
  state: string;
  state_code: string;
  postal_code: string;
  category?: string;
  type?: string;
  subtypes?: string;
  phone: string;
  website?: string;
  address?: string;
  open_24_hours?: string;
  emergency_evidence?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

async function seed() {
  const csvPath = path.join(process.cwd(), "data/mvp/mvp-cities-priority.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const rows: CsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Read ${rows.length} rows from CSV.`);

  const cityMap = new Map<string, { name: string; stateCode: string; stateName: string; postalCodeExample: string; slug: string }>();

  for (const row of rows) {
    const citySlug = `${slugify(row.city)}-${row.state_code.toLowerCase()}`;

    if (!cityMap.has(citySlug)) {
      cityMap.set(citySlug, {
        name: row.city,
        stateCode: row.state_code.toUpperCase(),
        stateName: row.state,
        postalCodeExample: row.postal_code,
        slug: citySlug,
      });
    }
  }

  console.log(`Found ${cityMap.size} unique cities.`);

  const citySlugToId = new Map<string, number>();

  for (const city of cityMap.values()) {
    const [inserted] = await db
      .insert(schema.cities)
      .values(city)
      .onConflictDoUpdate({
        target: schema.cities.slug,
        set: {
          name: city.name,
          stateCode: city.stateCode,
          stateName: city.stateName,
          postalCodeExample: city.postalCodeExample,
        },
      })
      .returning({ id: schema.cities.id, slug: schema.cities.slug });

    citySlugToId.set(inserted.slug, inserted.id);
  }

  let inserted = 0;

  for (const row of rows) {
    const citySlug = `${slugify(row.city)}-${row.state_code.toLowerCase()}`;
    const cityId = citySlugToId.get(citySlug);

    if (!cityId) {
      console.warn(`Skipping row, city not found: ${row.city}, ${row.state_code}`);
      continue;
    }

    const plumberSlug = `${slugify(row.name)}-${citySlug}`;

    await db
      .insert(schema.plumbers)
      .values({
        name: row.name,
        slug: plumberSlug,
        cityId,
        phone: row.phone,
        website: row.website || null,
        address: row.address || null,
        postalCode: row.postal_code || null,
        is24Hours: parseBoolean(row.open_24_hours),
        hasEmergencyService: parseBoolean(row.emergency_evidence) || true,
        status: "draft",
        isTestData: true,
      })
      .onConflictDoNothing({ target: schema.plumbers.slug });

    inserted += 1;
  }

  console.log(`Inserted/updated ${inserted} plumbers.`);
  console.log("Seed completed.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
