// src/components/featured-provider.tsx
//
// Franja destacada para el proveedor con más datos confirmados
// (teléfono + web + 24h). Solo usa campos reales del proveedor,
// nunca datos inventados como licencias o tiempos de llegada.

import type { Provider } from "@/data/providers";

type FeaturedProviderProps = {
    provider: Provider;
};

export default function FeaturedProvider({ provider }: FeaturedProviderProps) {
    return (
        <div className="relative overflow-hidden rounded-md bg-white p-6 md:p-8">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[#D62828]" />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded bg-[#FAF7F2] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#1C1B1F]">
                            Featured listing
                        </span>
                        {provider.is24Hours && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#2F6B4F] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                24/7 Available
                            </span>
                        )}
                    </div>

                    <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1C1B1F]">
                        {provider.name}
                    </h2>

                    {provider.address && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#6B6560]">
                            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {provider.address}
                        </p>
                    )}

                    {provider.website && (
                        <a
                            href={provider.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#1C1B1F] hover:underline"
                        >
                            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Website
                        </a>
                    )}
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#6B6560]">
                        Direct line
                    </span>
                    <a
                        href={`tel:${provider.phone}`}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#D62828] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#B8231F] lg:w-auto"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {provider.phone}
                    </a>
                </div>
            </div>
        </div>
    );
}