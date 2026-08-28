// src/db/schema.ts
import { pgTable, serial, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

// Tabla de ciudades (para SEO y agrupación)
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),           // ej: "Miami"
  slug: varchar("slug", { length: 120 }).notNull().unique(),  // ej: "miami-fl"
  stateCode: varchar("state_code", { length: 2 }).notNull(),  // ej: "FL"
  stateName: varchar("state_name", { length: 50 }).notNull(), // ej: "Florida"
  postalCodeExample: varchar("postal_code_example", { length: 10 }), // ej: "33101" (dato de prueba)
});

// Tabla de fontaneros (plumbers)
export const plumbers = pgTable("plumbers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(), // ej: "miami-emergency-plumbing"
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),

  // Datos de contacto (de prueba controlados durante el MVP)
  phone: varchar("phone", { length: 20 }).notNull(),
  website: varchar("website", { length: 255 }),
  address: text("address"),
  postalCode: varchar("postal_code", { length: 10 }),

  // Señales de disponibilidad (dato de prueba, no verificado)
  is24Hours: boolean("is_24_hours").notNull().default(true),
  hasEmergencyService: boolean("has_emergency_service").notNull().default(true),

  // Campos para SEO / ficha
  shortDescription: text("short_description"),

  // Control de datos de prueba y moderación futura
  status: varchar("status", { length: 20 }).notNull().default("draft"), // "draft" | "published"
  isTestData: boolean("is_test_data").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
