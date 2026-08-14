// src/db/schema.ts
import { pgTable, serial, varchar, text, integer, boolean } from "drizzle-orm/pg-core";

// Tabla de ciudades (para SEO y agrupación)
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(), // ej: "miami-fl"
  state: varchar("state", { length: 2 }).notNull(), // ej: "FL"
  zipExample: varchar("zip_example", { length: 10 }),       // ej: "33101"
});

// Tabla de fontaneros (plumbers)
export const plumbers = pgTable("plumbers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(), // ej: "miami-emergency-plumbing"
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id, { onDelete: "cascade" }),

  // Datos de negocio simulados (no reales)
  is24h: boolean("is_24h").notNull().default(true),
  hasEmergencyService: boolean("has_emergency_service").notNull().default(true),

  // Campos para SEO / ficha
  shortDescription: text("short_description"),
  addressLabel: varchar("address_label", { length: 200 }), // texto genérico tipo "Servicio en toda la ciudad"
});