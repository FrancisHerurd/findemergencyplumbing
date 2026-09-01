import Link from "next/link";

export default function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-base font-bold tracking-tight text-slate-950">
                            Find Emergency Plumbing
                        </p>
                        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                            A directory to help you find local emergency plumbing providers by city, with
                            direct contact information.
                        </p>
                    </div>

                    <nav aria-label="Footer navigation">
                        <p className="text-sm font-semibold text-slate-950">Directory</p>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/cities"
                                    className="text-slate-600 transition hover:text-blue-700 hover:underline"
                                >
                                    Browse all cities
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-slate-600 transition hover:text-blue-700 hover:underline"
                                >
                                    Home
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <nav aria-label="Company navigation">
                        <p className="text-sm font-semibold text-slate-950">Company</p>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-slate-600 transition hover:text-blue-700 hover:underline"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-slate-600 transition hover:text-blue-700 hover:underline"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="text-slate-600 transition hover:text-blue-700 hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                    <p className="text-xs leading-5 text-slate-500">
                        This directory is in active development and currently uses controlled test data.
                        Provider information should be verified directly with each business before contacting
                        them for service.
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                        &copy; {year} Find Emergency Plumbing. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}