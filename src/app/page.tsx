"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PlumbingPhoto from "@/components/plumbing-photo";

type City = {
  name: string;
  state: string;
  stateCode: string;
  count: number;
  slug: string;
};

const CITIES: City[] = [
  { name: "Mesa", state: "Arizona", stateCode: "AZ", count: 52, slug: "mesa-az" },
  { name: "Miami", state: "Florida", stateCode: "FL", count: 38, slug: "miami-fl" },
  { name: "San Diego", state: "California", stateCode: "CA", count: 27, slug: "san-diego-ca" },
  { name: "Chula Vista", state: "California", stateCode: "CA", count: 19, slug: "chula-vista-ca" },
  { name: "Gilbert", state: "Arizona", stateCode: "AZ", count: 10, slug: "gilbert-az" },
  { name: "Irving", state: "Texas", stateCode: "TX", count: 10, slug: "irving-tx" },
  { name: "Dallas", state: "Texas", stateCode: "TX", count: 9, slug: "dallas-tx" },
  { name: "Miami Beach", state: "Florida", stateCode: "FL", count: 6, slug: "miami-beach-fl" },
  { name: "Boston", state: "Massachusetts", stateCode: "MA", count: 4, slug: "boston-ma" },
  { name: "National City", state: "California", stateCode: "CA", count: 3, slug: "national-city-ca" },
  { name: "Quincy", state: "Massachusetts", stateCode: "MA", count: 3, slug: "quincy-ma" },
  { name: "Cambridge", state: "Massachusetts", stateCode: "MA", count: 2, slug: "cambridge-ma" },
  { name: "Doral", state: "Florida", stateCode: "FL", count: 2, slug: "doral-fl" },
  { name: "Dorchester", state: "Massachusetts", stateCode: "MA", count: 2, slug: "dorchester-ma" },
  { name: "Farmers Branch", state: "Texas", stateCode: "TX", count: 2, slug: "farmers-branch-tx" },
  { name: "Fort Worth", state: "Texas", stateCode: "TX", count: 2, slug: "fort-worth-tx" },
  { name: "Grand Prairie", state: "Texas", stateCode: "TX", count: 2, slug: "grand-prairie-tx" },
  { name: "Grapevine", state: "Texas", stateCode: "TX", count: 2, slug: "grapevine-tx" },
  { name: "North Miami", state: "Florida", stateCode: "FL", count: 2, slug: "north-miami-fl" },
  { name: "Phoenix", state: "Arizona", stateCode: "AZ", count: 2, slug: "phoenix-az" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");

  const filteredCities = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (normalized.length < 2) {
      return [];
    }

    return CITIES.filter((city) => {
      const cityText = `${city.name}, ${city.stateCode}`.toLowerCase();
      const nameOnly = city.name.toLowerCase();
      const nameState = `${city.name} ${city.stateCode}`.toLowerCase();

      return (
        cityText.includes(normalized) ||
        nameOnly.includes(normalized) ||
        nameState.includes(normalized)
      );
    }).slice(0, 8);
  }, [query]);

  const showEmptyState = query.trim().length >= 2 && filteredCities.length === 0;

  const selectedCity = useMemo(() => {
    if (!query) return null;

    const normalized = query.trim().toLowerCase();

    return (
      CITIES.find(
        (city) =>
          `${city.name}, ${city.stateCode}`.toLowerCase() === normalized ||
          city.name.toLowerCase() === normalized ||
          `${city.name} ${city.stateCode}`.toLowerCase() === normalized,
      ) || null
    );
  }, [query]);

  useEffect(() => {
    if (selectedCity) {
      window.location.href = `/plumbers/${selectedCity.slug}`;
    }
  }, [selectedCity]);

  return (
    <main className="min-h-screen bg-slate-100/60">
      <section className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
                Find Emergency Plumbing
              </p>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                24/7 Emergency Plumbers Near You
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-200">
                Find local plumbing professionals available now for urgent repairs.
                Search by city and call directly.
              </p>
            </div>

            <PlumbingPhoto size="lg" className="hidden sm:block" />
          </div>
        </div>
      </section>

      <section className="-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 sm:p-8">
            <label
              htmlFor="city-search"
              className="block text-base font-bold text-slate-900"
            >
              Find plumbers by city
            </label>

            <p className="mt-1 text-sm text-slate-500">
              Start typing a city name to see suggestions.
            </p>

            <div className="mt-4">
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.35 4.35a7.5 7.5 0 0012.3 12.3z" />
                </svg>

                <input
                  id="city-search"
                  type="text"
                  placeholder="e.g. Mesa, Miami, San Diego..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 pl-11 text-base text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
              </div>

              {filteredCities.length > 0 && (
                <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  {filteredCities.map((city) => (
                    <Link
                      key={`${city.stateCode}-${city.name}`}
                      href={`/plumbers/${city.slug}`}
                      className="flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {city.name}, {city.stateCode}
                        </p>

                        <p className="text-sm text-slate-600">
                          {city.count} provider
                          {city.count === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="ml-3 inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
                        View
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {showEmptyState && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
                  No cities found for &quot;{query}&quot;.{" "}
                  <Link href="/cities" className="font-semibold text-blue-600 hover:underline">
                    Browse all cities
                  </Link>{" "}
                  instead.
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CITIES.map((city) => (
                  <Link
                    key={`${city.stateCode}-${city.name}`}
                    href={`/plumbers/${city.slug}`}
                    className="hover-lift flex min-h-20 items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-colors duration-150 hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {city.name}, {city.stateCode}
                      </p>

                      <p className="mt-0.5 text-sm text-slate-500">
                        {city.count} provider
                        {city.count === 1 ? "" : "s"}
                      </p>
                    </div>

                    <span className="ml-3 inline-flex min-h-10 items-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
                      View
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/cities"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Browse all cities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">How it works</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="hover-lift rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">
              1. Search your city
            </h3>

            <p className="mt-2 leading-relaxed text-slate-600">
              Use the search box above or select a city from the list. We show
              local emergency plumbing listings in your area.
            </p>
          </div>

          <div className="hover-lift rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">
              2. Review providers
            </h3>

            <p className="mt-2 leading-relaxed text-slate-600">
              Browse available plumbing listings, check their details, and see
              if they mention 24/7 or emergency services.
            </p>
          </div>

          <div className="hover-lift rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-slate-900">
              3. Call directly
            </h3>

            <p className="mt-2 leading-relaxed text-slate-600">
              Tap the call button to contact a provider immediately. Explain
              your emergency and get help as soon as possible.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--accent)]/20 border-l-4 border-l-[var(--accent)] bg-[var(--accent-soft)] p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-red-900">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Need a plumber right now?
          </h2>

          <p className="mt-2 leading-relaxed text-red-800">
            If you have a major leak, burst pipe, or sewage issue, do not wait.
            Select a city above and call a provider immediately.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Emergency plumbing services in the United States
          </h2>

          <p className="mt-4 leading-relaxed text-slate-600">
            This directory helps you find emergency plumbing listings in
            multiple states, including Arizona, California, Florida,
            Massachusetts, and Texas. Use the search box above to browse cities
            with available listings and contact a provider directly.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                States with listings
              </h3>

              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600 marker:text-blue-400">
                <li>Arizona</li>
                <li>California</li>
                <li>Florida</li>
                <li>Massachusetts</li>
                <li>Texas</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Types of emergencies covered
              </h3>

              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600 marker:text-blue-400">
                <li>Burst or leaking pipes</li>
                <li>Severe drain and toilet clogs</li>
                <li>Water heater failures</li>
                <li>Sewer line issues</li>
                <li>Major leaks and flooding</li>
              </ul>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Listings shown on this site are controlled test data for an MVP
            directory. Availability, service areas, and phone numbers must be
            verified before relying on any listing in a real emergency.
          </p>
        </div>
      </section>
    </main>
  );
}
