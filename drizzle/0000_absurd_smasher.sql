CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"state_code" varchar(2) NOT NULL,
	"state_name" varchar(50) NOT NULL,
	"postal_code_example" varchar(10),
	CONSTRAINT "cities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "plumbers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"city_id" integer NOT NULL,
	"phone" varchar(20) NOT NULL,
	"website" varchar(255),
	"address" text,
	"postal_code" varchar(10),
	"is_24_hours" boolean DEFAULT true NOT NULL,
	"has_emergency_service" boolean DEFAULT true NOT NULL,
	"short_description" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"is_test_data" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plumbers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "plumbers" ADD CONSTRAINT "plumbers_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;