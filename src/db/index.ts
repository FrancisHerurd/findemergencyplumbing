import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Carga .env.local al ejecutar scripts fuera de Next.js.
// En Next.js no sobrescribe las variables ya cargadas.
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, {
  prepare: false,
  ssl: "require",
});

export const db = drizzle(client, { schema });
export { schema };