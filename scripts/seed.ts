import { eq } from "drizzle-orm";

import { db } from "../src/db/index";
import * as schema from "../src/db/schema";

const testCities = [
  {
    city: {
      name: "Miami",
      slug: "miami-fl",
      state: "FL",
      zipExample: "33101",
    },
    plumber: {
      name: "Miami Emergency Plumbing",
      phone: "+1 305-000-0000",
      slug: "miami-emergency-plumbing",
      is24h: true,
      hasEmergencyService: true,
      shortDescription: "24/7 emergency plumbing services across Miami.",
      addressLabel: "Serving all neighborhoods in Miami.",
    },
  },
  {
    city: {
      name: "Austin",
      slug: "austin-tx",
      state: "TX",
      zipExample: "78701",
    },
    plumber: {
      name: "Austin Emergency Plumbing",
      phone: "+1 512-000-0000",
      slug: "austin-emergency-plumbing",
      is24h: true,
      hasEmergencyService: true,
      shortDescription: "Test emergency plumbing coverage for Austin.",
      addressLabel: "Test service area covering Austin.",
    },
  },
  {
    city: {
      name: "Denver",
      slug: "denver-co",
      state: "CO",
      zipExample: "80202",
    },
    plumber: {
      name: "Denver Emergency Plumbing",
      phone: "+1 303-000-0000",
      slug: "denver-emergency-plumbing",
      is24h: true,
      hasEmergencyService: true,
      shortDescription: "Test emergency plumbing coverage for Denver.",
      addressLabel: "Test service area covering Denver.",
    },
  },
] as const;

async function getOrCreateCity(cityData: (typeof testCities)[number]["city"]) {
  const existingCities = await db
    .select()
    .from(schema.cities)
    .where(eq(schema.cities.slug, cityData.slug))
    .limit(1);

  return (
    existingCities[0] ??
    (
      await db.insert(schema.cities).values(cityData).returning()
    )[0]
  );
}

async function createPlumberIfMissing(
  plumberData: (typeof testCities)[number]["plumber"],
  cityId: number,
) {
  const existingPlumbers = await db
    .select()
    .from(schema.plumbers)
    .where(eq(schema.plumbers.slug, plumberData.slug))
    .limit(1);

  if (existingPlumbers.length === 0) {
    await db.insert(schema.plumbers).values({
      ...plumberData,
      cityId,
    });
  }
}

async function main() {
  for (const testCity of testCities) {
    const city = await getOrCreateCity(testCity.city);

    await createPlumberIfMissing(testCity.plumber, city.id);
  }

  console.log("Seed OK");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });