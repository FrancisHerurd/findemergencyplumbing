"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type CityEntry = {
    name: string;
    stateCode: string;
    stateName: string;
    count: number;
    slug: string;
};

type CitiesDirectoryProps = {
    cities: CityEntry[];
};

const STATE_ORDER = ["AZ", "CA", "FL", "MA", "TX"];

export default function CitiesDirectory({ cities }: CitiesDirectoryProps) {
    const [query, setQuery] = useState("");

    const groupedByState = useMemo(() => {
        const groups: Record<string, CityEntry[]> = {};
        for (const city of cities) {
            groups[city.stateCode] = groups[city.stateCode] || [];
            groups[city.stateCode].push(city);
        }
        return groups;
    }, [cities]);

    const filteredGroups = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return groupedByState;

        const result: Record<string, CityEntry[]> = {};
        for (const stateCode of Object.keys(groupedByState)) {
            const matches = groupedByState[stateCode].filter((city) =>
                city.name.toLowerCase().includes(normalized)
            );
            if (matches.length > 0) result[stateCode] = matches;
        }
        return result;
    }, [groupedByState, query]);

    const visibleStates = STATE_ORDER.filter((code) => groupedByState[code]?.length > 0);
    const activeStates = STATE_ORDER.filter((code) => filteredGroups[code]?.length > 0);
    const totalVisible = Object.values(filteredGroups).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div>
            {/* Filtro */}
            <div className="mx-auto max-w-md">
                <div className="flex items-center rounded-md border border-[#6B6560]/20 bg-white px-4 py-2.5 focus-within:border-[#1C1B1F]">
                    <svg className="mr-2 h-5 w-5 shrink-0 text-[#6B6560]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.35 4.35a7.5 7.5 0 0012.3 12.3z" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Filter cities..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoComplete="off"
                        className="w-full bg-transparent text-[#1C1B1F] placeholder-[#6B6560] outline-none"
                    />
                </div>
                {query.trim().length > 0 && (
                    <p className="mt-2 text-center text-sm text-[#6B6560]">
                        {totalVisible} {totalVisible === 1 ? "city" : "cities"} matching filter
                    </p>
                )}
            </div>

            {/* Chips de estado (sticky) */}
            <nav className="sticky top-0 z-30 -mx-4 mt-8 flex gap-2 overflow-x-auto border-b border-[#6B6560]/20 bg-[#FAF7F2]/95 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:justify-center sm:px-0">
                {visibleStates.map((stateCode) => {
                    const isActive = activeStates.includes(stateCode);
                    return (
                        <a
                            key={stateCode}
                            href={`#state-${stateCode}`}
                            className={`shrink-0 rounded-md border border-[#6B6560]/20 bg-white px-4 py-2 text-sm font-medium text-[#1C1B1F] transition-colors hover:border-[#D62828] hover:text-[#D62828] ${isActive ? "" : "pointer-events-none opacity-40"
                                }`}
                        >
                            {groupedByState[stateCode][0]?.stateName} ({stateCode})
                            <span className="ml-1 text-xs text-[#6B6560]">
                                &middot; {groupedByState[stateCode].length} cities
                            </span>
                        </a>
                    );
                })}
            </nav>

            {/* Secciones por estado */}
            <div className="mt-10 space-y-12">
                {activeStates.map((stateCode) => {
                    const stateCities = filteredGroups[stateCode];
                    const stateName = groupedByState[stateCode][0]?.stateName;
                    return (
                        <section key={stateCode} id={`state-${stateCode}`} className="scroll-mt-24">
                            <div className="mb-6 flex items-baseline justify-between border-b border-[#6B6560]/20 pb-2">
                                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1C1B1F]">
                                    {stateName} ({stateCode})
                                </h2>
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#6B6560]">
                                    {stateCities.length} covered cities
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {stateCities.map((city) => (
                                    <Link
                                        key={city.slug}
                                        href={`/plumbers/${city.slug}`}
                                        className="group flex flex-col justify-between rounded-md border border-[#6B6560]/20 bg-white p-6 transition-colors hover:border-[#D62828]"
                                    >
                                        <div>
                                            <div className="mb-2 flex items-center justify-between gap-2">
                                                <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#1C1B1F] group-hover:text-[#D62828]">
                                                    {city.name}
                                                </h3>
                                                <span className="rounded bg-[#FAF7F2] px-2 py-0.5 text-xs font-medium text-[#6B6560]">
                                                    {city.stateCode}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#6B6560]">
                                                {city.count} provider{city.count === 1 ? "" : "s"} listed
                                            </p>
                                        </div>
                                        <div className="mt-6">
                                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1C1B1F] group-hover:text-[#D62828]">
                                                View Plumbers &rarr;
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                })}

                {activeStates.length === 0 && (
                    <p className="text-center text-[#6B6560]">
                        No cities found for &quot;{query}&quot;.
                    </p>
                )}
            </div>
        </div>
    );
}