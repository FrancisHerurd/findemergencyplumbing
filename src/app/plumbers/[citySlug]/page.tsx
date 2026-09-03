import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadProviders, getAvailableCities } from '@/data/providers';
import { generateCityIntro, MIN_PROVIDERS_FOR_INDEX } from '@/lib/city-content';
import CityPhoto from '@/components/city-photo';
import FeaturedProvider from '@/components/featured-provider';


interface PageProps {
  params: Promise<{ citySlug: string }>;
}


export async function generateStaticParams() {
  const cities = getAvailableCities();
  return cities.map(citySlug => ({ citySlug }));
}


function resolveCityAndState(citySlug: string, city?: string, stateCode?: string) {
  const cityName = city || citySlug.split('-').slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const resolvedStateCode = stateCode || citySlug.split('-').pop()?.toUpperCase() || 'CA';
  return { cityName, resolvedStateCode };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const providersData = loadProviders(citySlug);


  if (!providersData || providersData.providers.length === 0) {
    return { title: 'City not found | Find Emergency Plumbing' };
  }


  const firstProvider = providersData.providers[0];
  const { cityName, resolvedStateCode } = resolveCityAndState(citySlug, firstProvider.city, firstProvider.stateCode);
  const count = providersData.providers.length;
  const shouldIndex = count >= MIN_PROVIDERS_FOR_INDEX;


  return {
    title: `Emergency Plumbers in ${cityName}, ${resolvedStateCode} | Find Emergency Plumbing`,
    description: `Find ${count} local emergency plumbing providers in ${cityName}, ${resolvedStateCode}. Call directly for urgent plumbing repairs.`,
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}


export default async function PlumbersPage({ params }: PageProps) {
  const { citySlug } = await params;
  const providersData = loadProviders(citySlug);


  if (!providersData || providersData.providers.length === 0) {
    notFound();
  }


  const firstProvider = providersData.providers[0];
  const { cityName, resolvedStateCode: stateCode } = resolveCityAndState(citySlug, firstProvider.city, firstProvider.stateCode);


  const intro = generateCityIntro(cityName, stateCode, providersData.providers);
  const totalCount = providersData.providers.length;
  const confirmed24h = providersData.providers.filter(p => p.is24Hours).length;

  const featured =
    providersData.providers.find(p => p.is24Hours && p.website) ||
    providersData.providers.find(p => p.website) ||
    providersData.providers[0];

  const restOfProviders = providersData.providers.filter(p => p.id !== featured.id);

  const mitigationSteps = [
    {
      number: '01',
      title: 'Shut off the main water valve',
      description: 'Locate your main shutoff valve (usually near the water meter or where the main line enters the building) and turn it clockwise until fully closed. This stops the flow of water and limits damage while you wait for a plumber.',
    },
    {
      number: '02',
      title: 'Turn off the water heater',
      description: 'If your water supply is cut, switch off the water heater breaker (electric) or set the gas control to "pilot"/"vacation" mode. Running a water heater without incoming water can damage the unit or create a fire risk.',
    },
    {
      number: '03',
      title: 'Ask about licensing before work begins',
      description: 'Before authorizing any repair, ask the plumber to confirm they are licensed to work in your state and request a cost estimate. A legitimate business will not hesitate to answer.',
    },
    {
      number: '04',
      title: 'Document the damage',
      description: 'Take photos or video of any affected areas before cleanup begins. This helps if you need to file an insurance claim later, and gives the plumber clear context on arrival.',
    },
  ];


  return (
    <div className="flex-1 bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#6B6560]">
          <Link href="/cities" className="hover:text-[#1C1B1F] hover:underline">Home</Link>
          <span>/</span>
          <Link href={`/city/${stateCode.toLowerCase()}`} className="hover:text-[#1C1B1F] hover:underline">{stateCode}</Link>
          <span>/</span>
          <span className="font-medium text-[#1C1B1F]">{cityName}</span>
        </nav>

        {/* Hero asimétrico 60/40 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-7">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#1C1B1F]">
              {totalCount} plumbers listed &middot; {confirmed24h} confirm 24/7
            </div>

            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-tight text-[#1C1B1F] sm:text-5xl">
              Emergency Plumbers in {cityName}, {stateCode}
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-7 text-[#6B6560]">
              {intro}
            </p>
          </div>

          <div className="order-1 min-h-[280px] lg:order-2 lg:col-span-5">
            <CityPhoto citySlug={citySlug} cityName={cityName} size="hero" />
          </div>
        </div>

        {/* Franja de proveedor destacado */}
        <div className="mt-10">
          <FeaturedProvider provider={featured} />
        </div>

        {/* Grid del resto de proveedores */}
        {restOfProviders.length > 0 && (
          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1C1B1F]">
              All emergency plumbers in {cityName}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {restOfProviders.map(provider => (
                <div
                  key={provider.id}
                  className="flex flex-col rounded-md border border-[#6B6560]/20 bg-white p-6 transition-colors hover:border-[#D62828]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold leading-tight text-[#1C1B1F]">
                      {provider.name}
                    </h3>

                    {provider.is24Hours && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#2F6B4F] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        24/7
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex-1 space-y-3">
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex items-center gap-2 text-lg font-bold text-[#1C1B1F] transition-colors hover:text-[#D62828]"
                    >
                      <svg className="h-5 w-5 shrink-0 text-[#D62828]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {provider.phone}
                    </a>

                    {provider.website && (
                      <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a href={provider.website} target="_blank" rel="noopener noreferrer" className="truncate hover:text-[#1C1B1F] hover:underline">
                          Website
                        </a>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-sm text-[#6B6560]">
                      <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {provider.address}
                        {provider.address && (
                          <>
                            {' · '}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#1C1B1F] hover:underline"
                            >
                              View map
                            </a>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#D62828] px-4 py-3 font-semibold text-white transition-all hover:bg-[#B8231F] active:scale-[0.98]"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bloque educativo numerado */}
        <div className="mt-14 rounded-md bg-white p-6 md:p-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#6B6560]">
            Immediate mitigation guide
          </span>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1C1B1F]">
            What to do while waiting for an emergency plumber
          </h2>

          <div className="mt-8 space-y-8">
            {mitigationSteps.map(step => (
              <div key={step.number} className="flex flex-col gap-3 md:flex-row md:items-baseline">
                <span className="font-[family-name:var(--font-fraunces)] shrink-0 text-3xl font-bold text-[#D62828]/70 md:w-16">
                  {step.number}
                </span>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#1C1B1F]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-base leading-7 text-[#6B6560]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Franja de confianza oscura */}
        <div className="mt-14 rounded-md bg-[#1C1B1F] p-6 md:p-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
            How this directory works
          </span>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-white">
            Why we list plumbers this way
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded bg-white/5 p-4">
              <span className="font-[family-name:var(--font-fraunces)] block text-3xl font-bold text-white">
                {totalCount}
              </span>
              <h3 className="mt-1 font-semibold text-white">Plumbers listed in {cityName}</h3>
              <p className="mt-1 text-sm text-white/70">
                Every listing is manually audited by business category before publication.
              </p>
            </div>

            <div className="rounded bg-white/5 p-4">
              <span className="font-[family-name:var(--font-fraunces)] block text-3xl font-bold text-white">
                {confirmed24h}
              </span>
              <h3 className="mt-1 font-semibold text-white">Confirm 24/7 availability</h3>
              <p className="mt-1 text-sm text-white/70">
                Only counted when a provider&apos;s published business hours explicitly state 24-hour availability, every day.
              </p>
            </div>

            <div className="rounded bg-white/5 p-4">
              <span className="font-[family-name:var(--font-fraunces)] block text-3xl font-bold text-white">
                Direct
              </span>
              <h3 className="mt-1 font-semibold text-white">No referral middleman</h3>
              <p className="mt-1 text-sm text-white/70">
                Every call connects straight to the plumbing business — this directory does not take a referral fee.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-[#6B6560]">
          This directory uses controlled test data during development. Provider information should be verified directly with each business before contacting them for service.
        </p>
      </div>
    </div>
  );
}