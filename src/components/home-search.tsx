"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

export type CitySummary = {
    name: string;
    state: string;
    stateCode: string;
    count: number;
    slug: string;
};

type HomeSearchProps = {
    cities: CitySummary[];
};

export default function HomeSearch({ cities }: HomeSearchProps) {
    const [query, setQuery] = useState("");

    const filteredCities = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (normalized.length < 2) return [];

        return cities
            .filter((city) => {
                const cityText = `${city.name}, ${city.stateCode}`.toLowerCase();
                const nameOnly = city.name.toLowerCase();
                const nameState = `${city.name} ${city.stateCode}`.toLowerCase();
                return (
                    cityText.includes(normalized) ||
                    nameOnly.includes(normalized) ||
                    nameState.includes(normalized)
                );
            })
            .slice(0, 8);
    }, [cities, query]);

    const showEmptyState = query.trim().length >= 2 && filteredCities.length === 0;

    const selectedCity = useMemo(() => {
        if (!query) return null;
        const normalized = query.trim().toLowerCase();
        return (
            cities.find(
                (city) =>
                    `${city.name}, ${city.stateCode}`.toLowerCase() === normalized ||
                    city.name.toLowerCase() === normalized ||
                    `${city.name} ${city.stateCode}`.toLowerCase() === normalized,
            ) || null
        );
    }, [cities, query]);

    useEffect(() => {
        if (selectedCity) {
            window.location.href = `/plumbers/${selectedCity.slug}`;
        }
    }, [selectedCity]);

    return (
        <div className="rounded-md bg-white p-2 sm:p-3">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row">
                <div className="flex flex-1 items-center rounded-md bg-[#FAF7F2] px-4 py-3">
                    <svg className="mr-3 h-5 w-5 shrink-0 text-[#6B6560]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.35 4.35a7.5 7.5 0 0012.3 12.3z" />
                    </svg>
                    <input
                        id="city-search"
                        type="text"
                        placeholder="Search by city or ZIP code (e.g. Phoenix, Miami, San Diego...)"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        autoComplete="off"
                        className="w-full bg-transparent text-base text-[#1C1B1F] placeholder-[#6B6560]/80 outline-none"
                    />
                </div>
                <Link
                    href="/cities"
                    className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#D62828] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#B8231F]"
                >
                    Search Directory
                </Link>
            </div>

            {filteredCities.length > 0 && (
                <div className="mt-3 divide-y divide-[#6B6560]/10 overflow-hidden rounded-md border border-[#6B6560]/20 bg-white">
                    {filteredCities.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/plumbers/${city.slug}`}
                            className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-[#FAF7F2]"
                        >
                            <div>
                                <p className="font-semibold text-[#1C1B1F]">
                                    {city.name}, {city.stateCode}
                                </p>
                                <p className="text-sm text-[#6B6560]">
                                    {city.count} provider{city.count === 1 ? "" : "s"}
                                </p>
                            </div>
                            <span className="ml-3 rounded-full bg-[#D62828] px-4 py-1.5 text-sm font-semibold text-white">
                                View
                            </span>
                        </Link>
                    ))}
                </div>
            )}

            {showEmptyState && (
                <div className="mt-3 rounded-md border border-[#6B6560]/20 bg-[#FAF7F2] px-4 py-4 text-center text-sm text-[#6B6560]">
                    No cities found for &quot;{query}&quot;.{" "}
                    <Link href="/cities" className="font-semibold text-[#D62828] hover:underline">
                        Browse all cities
                    </Link>{" "}
                    instead.
                </div>
            )}
        </div>
    );
}