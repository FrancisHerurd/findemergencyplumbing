import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAvailableCitySlugs,
  getCityInfoBySlug,
  getPlumbersByCitySlug,
  type Plumber,
} from "@/lib/plumbers-local";
import cityContent from "@/data/city-content.json";

type CityPageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

export function generateStaticParams() {
  return getAvailableCitySlugs().map((citySlug) => ({
    citySlug,
  }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const cityInfo = getCityInfoBySlug(citySlug);

  if (!cityInfo) {
    return {
      title: "City Not Found | Find Emergency Plumbing",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title: `Emergency Plumbers in ${cityInfo.city}, ${cityInfo.state} | Find Emergency Plumbing`,
    description: `Browse ${cityInfo.count} controlled emergency plumbing listings in ${cityInfo.city}, ${cityInfo.state}. Review available details and call a provider directly.`,
    alternates: {
      canonical: `/plumbers/${citySlug}`,
    },
  };
}

export default async function CityPlumbersPage({
  params,
}: CityPageProps) {
  const { citySlug } = await params;
  const cityInfo = getCityInfoBySlug(citySlug);

  if (!cityInfo) {
    notFound();
  }

  const plumbers = getPlumbersByCitySlug(citySlug);
  const content = cityContent[citySlug as keyof typeof cityContent];
  const exampleZip = plumbers.find(
    (plumber) => plumber.postalCode.trim().length > 0,
  )?.postalCode;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Find Emergency Plumbing
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Emergency Plumbers in {cityInfo.city}, {cityInfo.state}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Browse emergency plumbing listings available in {cityInfo.city}.
            Review each listing and contact a provider directly about your
            plumbing emergency.
          </p>

          {exampleZip && (
            <p className="mt-4 text-sm text-slate-500">
              Example ZIP code:{" "}
              <span className="font-medium text-slate-700">{exampleZip}</span>
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
              {plumbers.length} provider
              {plumbers.length === 1 ? "" : "s"} listed for this area.
            </p>
          </div>
        </div>

        {plumbers.length === 0 ? (
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
            {plumbers.map((plumber) => (
              <PlumberCard key={plumber.id} plumber={plumber} />
            ))}
          </div>
        )}

        <p className="mt-10 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
          This MVP page uses controlled test data from a local CSV. Provider
          information, availability, service areas, and phone numbers must be
          verified before publishing real listings.
        </p>
      </section>

      {content && (
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950">
              About plumbing services in {cityInfo.city}
            </h2>

            <div className="mt-6 space-y-6 text-slate-700">
              <p>{content.intro}</p>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Areas covered
                </h3>
                <p className="mt-2">{content.coverage}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Common emergencies
                </h3>
                <p className="mt-2">{content.commonIssues}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Local tips
                </h3>
                <p className="mt-2">{content.localTips}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  How to use this directory
                </h3>
                <p className="mt-2">{content.howToUse}</p>
              </div>

              <p className="text-sm text-slate-500">{content.disclaimer}</p>
            </div>
          </div>
        </section>
      )}

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
                <li>
                  Gas line leaks. Leave the area and contact emergency services
                  if you smell gas.
                </li>
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
              Consider contacting an emergency plumbing service if you notice
              significant water leakage, loss of water pressure, sewage odors,
              or a situation that could cause property damage or health risks.
              Check each provider&apos;s current availability before relying on
              the listing.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              How to choose a provider
            </h3>

            <p className="mt-3 text-slate-600">
              When selecting an emergency plumber, ask about response time,
              service area, after-hours availability, pricing, service fees, and
              payment methods before work begins.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function PlumberCard({ plumber }: { plumber: Plumber }) {
  const mapUrl = plumber.hasAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plumber.address)}`
    : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {plumber.photo && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <img
            src={plumber.photo}
            alt={`${plumber.name} photo`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-950">
            {plumber.name}
          </h3>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Test listing
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {plumber.open24Hours && (
            <span className="rounded-md bg-blue-50 px-3 py-1 font-medium text-blue-800">
              24/7 evidence
            </span>
          )}

          {plumber.emergencyEvidence && !plumber.open24Hours && (
            <span className="rounded-md bg-blue-50 px-3 py-1 font-medium text-blue-800">
              Emergency evidence
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-600">
          {plumber.category || "Plumbing service"}
          {plumber.type && plumber.type !== plumber.category
            ? ` · ${plumber.type}`
            : ""}
        </p>

        {plumber.hasAddress && (
          <p className="mt-4 text-sm text-slate-500">
            Service area:{" "}
            <span className="font-medium text-slate-700">
              {plumber.address}
            </span>
          </p>
        )}

        {plumber.workingHours && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900">Hours</h4>
            <p className="mt-1 text-sm text-slate-600">{plumber.workingHours}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {plumber.hasPhone && (
            <a
              href={`tel:${plumber.phone}`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
            >
              Call provider
            </a>
          )}

          <div className="flex flex-wrap gap-3">
            {plumber.hasWebsite && (
              <a
                href={plumber.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Visit website
              </a>
            )}

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                View map
              </a>
            )}
          </div>

          {plumber.hasPhone && (
            <p className="text-center text-sm text-slate-500">
              {plumber.phone}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}