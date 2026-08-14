CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"state" varchar(2) NOT NULL,
	"zip_example" varchar(10),
	CONSTRAINT "cities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "plumbers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"city_id" integer NOT NULL,
	"is_24h" boolean DEFAULT true NOT NULL,
	"has_emergency_service" boolean DEFAULT true NOT NULL,
	"short_description" text,
	"address_label" varchar(200),
	CONSTRAINT "plumbers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "plumbers" ADD CONSTRAINT "plumbers_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;