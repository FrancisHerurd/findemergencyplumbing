import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { db, schema } from "@/db";

type CityPageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;

  const city = await db.query.cities.findFirst({
    where: eq(schema.cities.slug, citySlug),
  });

  if (!city) {
    return {
      title: "City Not Found | Find Emergency Plumbing",
    };
  }

  return {
    title: `Emergency Plumbers in ${city.name}, ${city.state} | Find Emergency Plumbing`,
    description: `Find emergency plumbing services in ${city.name}, ${city.state}. Browse available providers and call for help.`,
  };
}

export default async function CityPlumbersPage({
  params,
}: CityPageProps) {
  const { citySlug } = await params;

  const city = await db.query.cities.findFirst({
    where: eq(schema.cities.slug, citySlug),
  });

  if (!city) {
    notFound();
  }

  const cityPlumbers = await db
    .select()
    .from(schema.plumbers)
    .where(
      and(
        eq(schema.plumbers.cityId, city.id),
        eq(schema.plumbers.hasEmergencyService, true),
      ),
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Find Emergency Plumbing
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Emergency Plumbers in {city.name}, {city.state}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Browse emergency plumbing providers available in {city.name}.
            Contact a provider directly to discuss your plumbing emergency.
          </p>

          {city.zipExample && (
            <p className="mt-4 text-sm text-slate-500">
              Example ZIP code:{" "}
              <span className="font-medium text-slate-700">
                {city.zipExample}
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Emergency plumbing providers
            </h2>

            <p className="mt-2 text-slate-600">
              {cityPlumbers.length} provider
              {cityPlumbers.length === 1 ? "" : "s"} listed for this area.
            </p>
          </div>
        </div>

        {cityPlumbers.length === 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h2 className="text-lg font-semibold">
              No providers are currently listed
            </h2>

            <p className="mt-2 text-sm leading-6">
              We do not currently have a verified provider listing for this
              location.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {cityPlumbers.map((plumber) => (
              <article
                key={plumber.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-950">
                      {plumber.name}
                    </h3>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Test listing
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {plumber.is24h && (
                      <span className="rounded-md bg-blue-50 px-3 py-1 font-medium text-blue-800">
                        24/7 availability
                      </span>
                    )}

                    {plumber.hasEmergencyService && (
                      <span className="rounded-md bg-blue-50 px-3 py-1 font-medium text-blue-800">
                        Emergency service
                      </span>
                    )}
                  </div>

                  {plumber.shortDescription && (
                    <p className="mt-5 leading-7 text-slate-600">
                      {plumber.shortDescription}
                    </p>
                  )}

                  {plumber.addressLabel && (
                    <p className="mt-4 text-sm text-slate-500">
                      Service area:{" "}
                      <span className="font-medium text-slate-700">
                        {plumber.addressLabel}
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <a
                    href={`tel:${plumber.phone}`}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                  >
                    Call provider
                  </a>

                  <p className="mt-3 text-center text-sm text-slate-500">
                    {plumber.phone}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
          This MVP page uses controlled test data. Provider information,
          availability, service areas, and phone numbers must be verified
          before publishing real listings.
        </p>
      </section>

      {/* Sección informativa orientada a SEO y conversión */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-950">
            What to do during a plumbing emergency
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Immediate steps to take
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                <li>
                  Shut off the main water valve if you have a major leak or
                  burst pipe.
                </li>
                <li>
                  Turn off the water heater if there is no water supply or if
                  you suspect a problem.
                </li>
                <li>
                  Use buckets and towels to contain water and minimize damage.
                </li>
                <li>
                  Avoid using chemical drain cleaners, which can worsen some
                  plumbing issues.
                </li>
                <li>
                  Contact an emergency plumbing provider as soon as possible.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Common plumbing emergencies
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                <li>Burst or leaking pipes.</li>
                <li>Severely clogged drains or toilets.</li>
                <li>Water heater failures or leaks.</li>
                <li>Gas line leaks (evacuate and call emergency services).</li>
                <li>Sewer line backups or foul odors.</li>
                <li>
                  Overflowing toilets or fixtures that will not stop running.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              When to call an emergency plumber
            </h3>

            <p className="mt-3 text-slate-600">
              Call an emergency plumbing service immediately if you notice
              significant water leakage, loss of water pressure, sewage odors,
              or any situation that could cause property damage or health risks.
              Many providers in {city.name} offer 24/7 availability for urgent
              situations.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              How to choose a provider
            </h3>

            <p className="mt-3 text-slate-600">
              When selecting an emergency plumber, consider their response time,
              service area, availability outside regular business hours, and
              whether they handle your specific type of emergency. Always
              confirm pricing, service fees, and payment methods before work
              begins.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}