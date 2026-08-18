import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Find Emergency Plumbing
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Find Emergency Plumbers in Your City
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Connect with emergency plumbing providers available 24/7 in your
            area. Browse local listings, review service information, and call
            directly for urgent plumbing help.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/plumbers"
              className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
            >
              Browse all cities
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Featured cities */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Available cities
          </h2>

          <p className="mt-3 text-slate-600">
            Browse emergency plumbing providers in these test locations. More
            cities coming soon.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/plumbers/miami-fl"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-blue-700">
                Miami, FL
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Example ZIP: 33101
              </p>
              <p className="mt-3 text-sm font-medium text-blue-700">
                View providers →
              </p>
            </Link>

            <Link
              href="/plumbers/austin-tx"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-blue-700">
                Austin, TX
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Example ZIP: 78701
              </p>
              <p className="mt-3 text-sm font-medium text-blue-700">
                View providers →
              </p>
            </Link>

            <Link
              href="/plumbers/denver-co"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-950 group-hover:text-blue-700">
                Denver, CO
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Example ZIP: 80202
              </p>
              <p className="mt-3 text-sm font-medium text-blue-700">
                View providers →
              </p>
            </Link>
          </div>

          <div className="mt-8">
            <Link
              href="/plumbers"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              View all cities →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-950">
            How it works
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                1. Choose your city
              </h3>

              <p className="mt-2 text-slate-600">
                Select your city from our directory or browse all available
                locations to find emergency plumbing providers in your area.
              </p>
            </div>

            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                2. Review providers
              </h3>

              <p className="mt-2 text-slate-600">
                Browse available emergency plumbing listings, check service
                details, and identify providers that match your needs.
              </p>
            </div>

            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                3. Call for help
              </h3>

              <p className="mt-2 text-slate-600">
                Contact providers directly by phone to discuss your plumbing
                emergency, availability, and service details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-950">
              Need emergency plumbing help now?
            </h2>

            <p className="mt-3 text-slate-600">
              Browse our directory of emergency plumbing providers and contact
              one directly.
            </p>

            <div className="mt-6">
              <Link
                href="/plumbers"
                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
              >
                Browse all cities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm leading-6 text-slate-500">
            This MVP uses controlled test data for development purposes.
            Provider information, availability, service areas, and phone numbers
            must be verified before publishing real listings. Do not rely on
            this data for actual emergency services.
          </p>
        </div>
      </section>
    </main>
  );
}