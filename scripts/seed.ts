import { db } from "../src/db/index";
import * as schema from "../src/db/schema";

async function main() {
  const [miami] = await db
    .insert(schema.cities)
    .values({
      name: "Miami",
      slug: "miami-fl",
      state: "FL",
      zipExample: "33101",
    })
    .returning();

  await db.insert(schema.plumbers).values({
    name: "Miami Emergency Plumbing",
    phone: "+1 305-000-0000",
    slug: "miami-emergency-plumbing",
    cityId: miami.id,
    is24h: true,
    hasEmergencyService: true,
    shortDescription: "24/7 emergency plumbing services across Miami.",
    addressLabel: "Serving all neighborhoods in Miami.",
  });

  console.log("Seed OK");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });