import Link from "next/link";
import PlumbingPhoto from "@/components/plumbing-photo";
import HomeSearch, { type CitySummary } from "@/components/home-search";
import { getAvailableCities, loadProviders } from "@/data/providers";

const STATE_NAMES: Record<string, string> = {
  AZ: "Arizona",
  CA: "California",
  FL: "Florida",
  MA: "Massachusetts",
  TX: "Texas",
};

const STATE_DESCRIPTIONS: Record<string, string> = {
  AZ: "Phoenix, Mesa, Chandler & metro corridors",
  CA: "San Diego, Chula Vista & nearby areas",
  FL: "Miami, Miami Beach & South Florida",
  MA: "Greater Boston, Quincy & surrounding towns",
  TX: "Dallas-Fort Worth metro area",
};

function getAllCitySummaries(): CitySummary[] {
  return getAvailableCities()
    .map((slug) => {
      const data = loadProviders(slug);
      const first = data?.providers?.[0];
      if (!data || !first) return null;

      const stateCode = first.stateCode || slug.split("-").pop()?.toUpperCase() || "";
      const name =
        first.city ||
        slug.split("-").slice(0, -1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

      return {
        name,
        state: STATE_NAMES[stateCode] || stateCode,
        stateCode,
        count: data.providers.length,
        slug,
      };
    })
    .filter((c): c is CitySummary => c !== null);
}

export default function HomePage() {
  const cities = getAllCitySummaries();
  const totalProviders = cities.reduce((sum, c) => sum + c.count, 0);
  const totalCities = cities.length;

  const citiesByState = cities.reduce<Record<string, { count: number }>>((acc, city) => {
    acc[city.stateCode] = acc[city.stateCode] || { count: 0 };
    acc[city.stateCode].count += 1;
    return acc;
  }, {});

  const popularCities = [...cities].sort((a, b) => b.count - a.count).slice(0, 5);

  const howItWorks = [
    {
      number: "01",
      title: "Search your city",
      description:
        "Use the search box above or browse the full directory. We show local emergency plumbing listings in your area.",
    },
    {
      number: "02",
      title: "Review providers",
      description:
        "Browse available listings, check contact details, and see which providers confirm 24/7 availability.",
    },
    {
      number: "03",
      title: "Call directly",
      description:
        "Tap the call button to contact a provider immediately. Explain your emergency and get help as soon as possible.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* HERO asimétrico */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-tight text-[#1C1B1F] sm:text-5xl">
              Find a 24/7 Emergency Plumber Near You
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-[#6B6560]">
              Independent directory connecting you directly with local emergency plumbing
              providers. Search by city and call directly &mdash; no middleman.
            </p>

            <div className="mt-6">
              <HomeSearch cities={cities} />
            </div>

            {popularCities.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#6B6560]">
                <span className="text-xs font-semibold uppercase tracking-wide">Popular:</span>
                {popularCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/plumbers/${city.slug}`}
                    className="rounded-md bg-white px-2.5 py-1 hover:text-[#D62828]"
                  >
                    {city.name}, {city.stateCode}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <PlumbingPhoto size="lg" className="w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* ESTADOS CUBIERTOS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1C1B1F]">
              Covered States
            </h2>
            <p className="mt-1 text-[#6B6560]">
              Select your state to find local emergency plumbers in your area
            </p>
          </div>
          <Link href="/cities" className="text-sm font-semibold text-[#D62828] hover:underline">
            View full directory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(STATE_NAMES).map(([stateCode, stateName]) => (
            <Link
              key={stateCode}
              href={`/city/${stateCode.toLowerCase()}`}
              className="group flex h-52 flex-col justify-between rounded-md border border-[#6B6560]/20 bg-white p-5 transition-colors hover:border-[#D62828]"
            >
              <div className="flex items-start justify-between">
                <span className="font-[family-name:var(--font-fraunces)] text-3xl font-bold leading-none text-[#6B6560]/30 group-hover:text-[#D62828]">
                  {stateCode}
                </span>
                <span className="rounded bg-[#FAF7F2] px-2 py-0.5 text-xs font-medium text-[#6B6560]">
                  {citiesByState[stateCode]?.count || 0} cities
                </span>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#1C1B1F] group-hover:text-[#D62828]">
                  {stateName}
                </h3>
                <p className="text-sm text-[#6B6560]">{STATE_DESCRIPTIONS[stateCode]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1C1B1F]">
          How Find Emergency Plumbing Works
        </h2>
        <p className="mt-2 max-w-2xl text-[#6B6560]">
          Designed for speed during an active plumbing emergency &mdash; no registration walls,
          no phone trees.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {howItWorks.map((step) => (
            <div key={step.number} className="rounded-md border border-[#6B6560]/20 bg-white p-6">
              <div className="font-[family-name:var(--font-fraunces)] text-3xl font-bold leading-none text-[#D62828]">
                {step.number}
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#1C1B1F]">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[#6B6560]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FRANJA DE CONFIANZA OSCURA */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-md bg-[#1C1B1F] p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <span className="font-[family-name:var(--font-fraunces)] block text-3xl font-bold text-white">
                {totalProviders}
              </span>
              <h3 className="mt-1 font-semibold text-white">Plumbers listed</h3>
              <p className="mt-1 text-sm text-white/70">
                Every listing is manually audited by business category before publication.
              </p>
            </div>
            <div>
              <span className="font-[family-name:var(--font-fraunces)] block text-3xl font-bold text-white">
                {totalCities}
              </span>
              <h3 className="mt-1 font-semibold text-white">Cities covered</h3>
              <p className="mt-1 text-sm text-white/70">
                Across Arizona, California, Florida, Massachusetts and Texas.
              </p>
            </div>
            <div>
              <span className="font-[family-name:var(--font-fraunces)] block text-3xl font-bold text-white">
                Direct
              </span>
              <h3 className="mt-1 font-semibold text-white">No referral middleman</h3>
              <p className="mt-1 text-sm text-white/70">
                Every call connects straight to the plumbing business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-md border border-[#6B6560]/20 bg-white p-8 md:flex-row md:p-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1C1B1F]">
              Need to explore all covered locations?
            </h2>
            <p className="mt-2 text-[#6B6560]">
              Browse the complete directory of emergency plumbing listings across every covered
              state and city.
            </p>
          </div>
          <Link
            href="/cities"
            className="shrink-0 rounded-md bg-[#1C1B1F] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-black"
          >
            Browse All Cities
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#6B6560]">
          Listings shown on this site are controlled test data for an MVP directory. Availability,
          service areas, and phone numbers must be verified before relying on any listing in a
          real emergency.
        </p>
      </section>
    </main>
  );
}