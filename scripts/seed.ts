import { eq } from "drizzle-orm";

import { db } from "../src/db/index";
import * as schema from "../src/db/schema";

async function main() {
  const cityData = {
    name: "Miami",
    slug: "miami-fl",
    state: "FL",
    zipExample: "33101",
  };

  const existingCities = await db
    .select()
    .from(schema.cities)
    .where(eq(schema.cities.slug, cityData.slug))
    .limit(1);

  const city =
    existingCities[0] ??
    (
      await db.insert(schema.cities).values(cityData).returning()
    )[0];

  const plumberData = {
    name: "Miami Emergency Plumbing",
    phone: "+1 305-000-0000",
    slug: "miami-emergency-plumbing",
    cityId: city.id,
    is24h: true,
    hasEmergencyService: true,
    shortDescription: "24/7 emergency plumbing services across Miami.",
    addressLabel: "Serving all neighborhoods in Miami.",
  };

  const existingPlumbers = await db
    .select()
    .from(schema.plumbers)
    .where(eq(schema.plumbers.slug, plumberData.slug))
    .limit(1);

  if (existingPlumbers.length === 0) {
    await db.insert(schema.plumbers).values(plumberData);
  }

  console.log("Seed OK");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });