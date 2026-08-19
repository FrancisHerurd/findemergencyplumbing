import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-base font-bold tracking-tight text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:text-lg"
        >
          Find Emergency Plumbing
        </Link>

        <nav aria-label="Main navigation">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Home
            </Link>

            <Link
              href="/cities"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Cities
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}