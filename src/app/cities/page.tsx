import type { Metadata } from "next";
import Link from "next/link";
import { getAvailableCitySlugs, getCityInfoBySlug } from "@/lib/plumbers-local";
import CitiesDirectory, { type CityEntry } from "@/components/cities-directory";

export const revalidate = 3600;

const STATE_NAMES: Record<string, string> = {
  AZ: "Arizona",
  CA: "California",
  FL: "Florida",
  MA: "Massachusetts",
  TX: "Texas",
};

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

function deriveStateCode(slug: string): string {
  return slug.split("-").pop()?.toUpperCase() || "";
}

export default async function CitiesPage() {
  const slugs = await getAvailableCitySlugs();

  const citiesWithInfo = await Promise.all(
    slugs.map(async (slug) => {
      const city = await getCityInfoBySlug(slug);
      if (!city) return null;

      const stateCode = deriveStateCode(slug);

      return {
        name: city.city,
        stateCode,
        stateName: STATE_NAMES[stateCode] || stateCode,
        count: city.count,
        slug,
      } satisfies CityEntry;
    }),
  );

  const cities = citiesWithInfo.filter((city): city is CityEntry => city !== null);

  return (
    <main className="flex-1 bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-[#6B6560]">
          <Link href="/" className="hover:text-[#1C1B1F] hover:underline">Home</Link>
          <span>/</span>
          <span className="font-medium text-[#1C1B1F]">Browse Cities</span>
        </nav>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold text-[#1C1B1F] sm:text-5xl">
            Browse All Cities
          </h1>
          <p className="mt-4 text-lg text-[#6B6560]">
            Find emergency plumbers across every covered metropolitan area and municipality.
          </p>
        </div>

        <div className="mt-8">
          <CitiesDirectory cities={cities} />
        </div>
      </div>
    </main>
  );
}