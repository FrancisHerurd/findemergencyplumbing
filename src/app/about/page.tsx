import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Find Emergency Plumbing',
    description: 'Learn how Find Emergency Plumbing helps you locate local emergency plumbers by city.',
};

export default function AboutPage() {
    return (
        <div className="flex-1 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">About Find Emergency Plumbing</h1>

                <div className="mt-6 space-y-5 text-base leading-7 text-gray-700">
                    <p>
                        Find Emergency Plumbing is a directory that helps people locate local plumbing
                        providers by city, so they can find contact information quickly during a plumbing
                        emergency instead of scrolling through generic search results.
                    </p>
                    <p>
                        We list each provider&apos;s name, phone number, address, and published business
                        hours. When a provider&apos;s hours explicitly confirm 24-hour service, we mark that
                        listing as 24/7 available. We do not guess or assume availability that isn&apos;t
                        documented.
                    </p>
                    <p>
                        This site is currently in an early development stage and uses controlled test data
                        while we build out coverage city by city across the United States. We do not accept
                        payment from providers to appear in the directory, and listings are not endorsements
                        or guarantees of service quality.
                    </p>
                    <p>
                        If you are a plumbing business and want to update or correct your listing, please
                        reach out through our <a href="/contact" className="font-medium text-blue-600 hover:underline">contact page</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}