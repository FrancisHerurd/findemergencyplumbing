import type { Metadata } from "next";
import { getAvailableCitySlugs, getCityInfoBySlug } from "@/lib/plumbers-local";
import CityDirectory from "./city-directory";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cities with Emergency Plumbers | Find Emergency Plumbing",
  description:
    "Browse cities with controlled emergency plumbing listings and find local providers for urgent repairs.",
  alternates: {
    canonical: "/cities",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function CitiesPage() {
  const slugs = await getAvailableCitySlugs();

  const citiesWithInfo = await Promise.all(
    slugs.map(async (slug) => {
      const city = await getCityInfoBySlug(slug);

      if (!city) return null;

      return {
        ...city,
        slug,
      };
    }),
  );

  const cities = citiesWithInfo.filter(
    (city): city is NonNullable<typeof city> => city !== null,
  );

  return (
    <main className="flex-1 bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Find Emergency Plumbing
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Find emergency plumbers by city
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Browse cities with controlled emergency plumbing listings and find
            a local provider for urgent repairs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <CityDirectory cities={cities} />
      </section>
    </main>
  );
}
