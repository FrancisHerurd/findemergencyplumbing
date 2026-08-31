"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type City = {
  city: string;
  state: string;
  stateCode: string;
  count: number;
  slug: string;
};

type CityDirectoryProps = {
  cities: City[];
};

const STATE_CODE_TO_SLUG: Record<string, string> = {
  AZ: "arizona",
  CA: "california",
  FL: "florida",
  MA: "massachusetts",
  TX: "texas",
};

export default function CityDirectory({ cities }: CityDirectoryProps) {
  const [query, setQuery] = useState("");

  const states = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filteredCities = cities.filter((city) => {
      if (!normalizedQuery) return true;

      return (
        city.city.toLowerCase().includes(normalizedQuery) ||
        city.state.toLowerCase().includes(normalizedQuery) ||
        city.stateCode.toLowerCase().includes(normalizedQuery)
      );
    });

    const grouped = new Map<string, City[]>();

    for (const city of filteredCities) {
      const stateKey = `${city.state}|${city.stateCode}`;
      const currentCities = grouped.get(stateKey) ?? [];

      grouped.set(stateKey, [...currentCities, city]);
    }

    return [...grouped.entries()]
      .map(([stateKey, stateCities]) => {
        const [state, stateCode] = stateKey.split("|");

        return {
          state,
          stateCode,
          cities: stateCities.sort((a, b) =>
            a.city.localeCompare(b.city),
          ),
        };
      })
      .sort((a, b) => a.state.localeCompare(b.state));
  }, [cities, query]);

  const totalProviders = cities.reduce((total, city) => total + city.count, 0);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <label
          htmlFor="city-directory-search"
          className="block text-sm font-semibold text-slate-900"
        >
          Search cities or states
        </label>

        <div className="relative mt-3">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.35 4.35a7.5 7.5 0 0012.3 12.3z" />
          </svg>

          <input
            id="city-directory-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Mesa, Miami, Arizona, or AZ"
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pl-11 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>
            {cities.length} cities listed
          </span>
          <span>
            {totalProviders} providers in the directory
          </span>
        </div>
      </div>

      <div className="mt-8">
        {states.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">No cities found</h2>
            <p className="mt-2 text-sm leading-6">
              Try searching for another city or state, or{" "}
              <button
                type="button"
                onClick={() => setQuery("")}
                className="font-semibold text-blue-600 hover:underline"
              >
                clear the search
              </button>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {states.map((state) => {
              const stateSlug = STATE_CODE_TO_SLUG[state.stateCode];

              return (
                <section
                  key={state.stateCode}
                  aria-labelledby={`state-${state.stateCode}`}
                >
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2
                      id={`state-${state.stateCode}`}
                      className="text-2xl font-bold text-slate-950"
                    >
                      {state.state}
                    </h2>

                    <div className="flex items-center gap-4">
                      {stateSlug && (
                        <Link
                          href={`/city/${stateSlug}`}
                          className="text-sm font-semibold text-blue-700 hover:underline"
                        >
                          View {state.state} hub →
                        </Link>
                      )}
                      <span className="text-sm font-medium text-slate-500">
                        {state.cities.length}{" "}
                        {state.cities.length === 1 ? "city" : "cities"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {state.cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/plumbers/${city.slug}`}
                        className="hover-lift group flex min-h-20 items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-slate-950 group-hover:text-blue-800">
                            {city.city}
                          </span>

                          <span className="mt-1 block text-sm text-slate-600">
                            {city.count}{" "}
                            {city.count === 1 ? "provider" : "providers"}
                          </span>
                        </span>

                        <span
                          aria-hidden="true"
                          className="ml-4 text-xl text-blue-700 transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-10 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
        This MVP directory uses controlled test data. Provider information,
        availability, service areas, and phone numbers must be verified before
        publishing real listings.
      </p>
    </>
  );
}