import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getAvailableStateSlugs,
    getCitiesByStateSlug,
} from "@/lib/plumbers-local";
import PlumbingPhoto from "@/components/plumbing-photo";

export const revalidate = 3600;

type Props = {
    params: Promise<{ stateSlug: string }>;
};

export async function generateStaticParams() {
    return getAvailableStateSlugs().map((stateSlug) => ({ stateSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { stateSlug } = await params;
    const group = getCitiesByStateSlug(stateSlug);

    if (!group) {
        return { title: "State not found | Find Emergency Plumbing" };
    }

    return {
        title: `Emergency Plumbers in ${group.stateName} | Find Emergency Plumbing`,
        description: `Browse cities in ${group.stateName} with emergency plumbing provider listings and find contact information for urgent plumbing needs.`,
        alternates: {
            canonical: `/city/${group.stateSlug}`,
        },
    };
}

export default async function StatePage({ params }: Props) {
    const { stateSlug } = await params;
    const group = getCitiesByStateSlug(stateSlug);

    if (!group) {
        notFound();
    }

    return (
        <main className="flex-1 bg-slate-50">
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                                Find Emergency Plumbing
                            </p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Emergency plumbers in {group.stateName}
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                Browse cities in {group.stateName} with emergency plumbing
                                listings and find a local provider for urgent repairs.
                            </p>
                            <p className="mt-4 text-sm">
                                <Link
                                    href="/cities"
                                    className="font-medium text-blue-700 hover:underline"
                                >
                                    ← Back to all cities
                                </Link>
                            </p>
                        </div>

                        <PlumbingPhoto size="md" className="hidden sm:block" />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-950">
                    Cities in {group.stateName} ({group.cities.length})
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.cities.map((city) => (
                        <Link
                            key={city.citySlug}
                            href={`/plumbers/${city.citySlug}`}
                            className="hover-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                        >
                            <h3 className="text-xl font-semibold text-slate-950">
                                {city.city}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {city.count} provider{city.count === 1 ? "" : "s"} listed
                            </p>
                            <span className="mt-5 inline-block text-sm font-semibold text-blue-700">
                                View providers →
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
