import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadProviders, getAvailableCities } from '@/data/providers';
import { generateCityIntro, MIN_PROVIDERS_FOR_INDEX } from '@/lib/city-content';
import CityPhoto from '@/components/city-photo';

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

  return (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Emergency Plumbers in {cityName}, {stateCode}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {providersData.providers.length} local plumbers available 24/7
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700">
                {intro}
              </p>
            </div>

            <CityPhoto citySlug={citySlug} cityName={cityName} size="md" className="hidden sm:block" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providersData.providers.map(provider => (
            <div
              key={provider.id}
              className="hover-lift bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                  {provider.name}
                </h2>

                {provider.is24Hours && (
                  <span className="inline-flex items-center gap-1 shrink-0 px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V7z" clipRule="evenodd" />
                    </svg>
                    24/7
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-3 flex-1">
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-[var(--accent)] transition-colors"
                >
                  <svg className="w-5 h-5 text-[var(--accent)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {provider.phone}
                </a>

                {provider.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 hover:underline truncate">
                      Website
                    </a>
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          className="font-medium text-blue-600 hover:underline"
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
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Common plumbing emergencies</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700 list-disc list-inside">
              <li>Burst or leaking pipes causing water damage</li>
              <li>Clogged drains or toilets that won&apos;t clear</li>
              <li>No hot water or a failed water heater</li>
              <li>Sewer line backups</li>
              <li>Gas leaks near plumbing fixtures (evacuate and call your gas utility first)</li>
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">How to choose an emergency plumber</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700 list-disc list-inside">
              <li>Confirm they answer the phone directly, even outside business hours</li>
              <li>Ask for an estimate before work begins whenever possible</li>
              <li>Check that they are licensed to work in your state</li>
              <li>Ask if the quoted price includes parts, labor, and any after-hours fee</li>
              <li>Get the total cost confirmed before authorizing repairs</li>
            </ul>
          </section>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          This directory uses controlled test data during development. Provider information should be verified directly with each business before contacting them for service.
        </p>
      </div>
    </div>
  );
}
