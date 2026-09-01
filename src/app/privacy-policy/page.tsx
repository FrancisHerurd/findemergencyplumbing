import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Find Emergency Plumbing',
    description: 'Privacy policy for Find Emergency Plumbing.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="flex-1 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
                {/* TODO: sustituye por la fecha real de la última actualización */}
                <p className="mt-2 text-sm text-gray-500">Last updated: September 2026</p>

                <div className="mt-6 space-y-6 text-base leading-7 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">Information we collect</h2>
                        <p className="mt-2">
                            Find Emergency Plumbing does not require account creation to browse the directory.
                            We may collect basic, non-personally-identifying information such as browser type,
                            pages visited, and general location (city/region) through standard analytics tools,
                            to understand how visitors use the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">Cookies and advertising</h2>
                        <p className="mt-2">
                            This site may use cookies and similar technologies, including third-party
                            advertising services such as Google AdSense, to display ads and measure site
                            performance. These services may use cookies to serve ads based on a user&apos;s
                            prior visits to this or other websites. Users can opt out of personalized
                            advertising by visiting Google&apos;s Ads Settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">Third-party listings</h2>
                        <p className="mt-2">
                            Provider listings (name, phone number, address, business hours) are sourced from
                            publicly available business information. We do not sell or share personal user
                            data with the businesses listed in the directory.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
                        <p className="mt-2">
                            If you have questions about this privacy policy, please reach out through our{' '}
                            <a href="/contact" className="font-medium text-blue-600 hover:underline">contact page</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}