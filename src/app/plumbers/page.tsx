import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";

import { db, schema } from "@/db";

export const metadata: Metadata = {
  title: "Emergency Plumbers by City | Find Emergency Plumbing",
  description:
    "Browse emergency plumbing providers by city and find help for urgent plumbing problems.",
};

export default async function PlumbersDirectoryPage() {
  const cities = await db
    .select()
    .from(schema.cities)
    .orderBy(asc(schema.cities.name));

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Find Emergency Plumbing
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Find emergency plumbers by city
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Browse cities with emergency plumbing provider listings and find
            contact information for urgent plumbing needs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-950">
          Available cities
        </h2>

        {cities.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h3 className="text-lg font-semibold">
              No cities are currently listed
            </h3>

            <p className="mt-2 text-sm leading-6">
              We are adding verified emergency plumbing listings to this
              directory.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/plumbers/${city.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  Emergency plumbers in {city.name}
                </h3>

                <p className="mt-2 text-slate-600">
                  {city.name}, {city.state}
                </p>

                {city.zipExample && (
                  <p className="mt-4 text-sm text-slate-500">
                    Example ZIP:{" "}
                    <span className="font-medium text-slate-700">
                      {city.zipExample}
                    </span>
                  </p>
                )}

                <span className="mt-5 inline-block text-sm font-semibold text-blue-700">
                  View providers →
                </span>
              </Link>
            ))}
          </div>
        )}

        <p className="mt-10 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
          This MVP directory uses controlled test data. Provider details must
          be verified before any real listing is published.
        </p>
      </section>
    </main>
  );
}