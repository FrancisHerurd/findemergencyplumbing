import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Find Emergency Plumbing',
    description: 'Get in touch with Find Emergency Plumbing to report a correction or ask a question.',
};

export default function ContactPage() {
    return (
        <div className="flex-1 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Us</h1>

                <div className="mt-6 space-y-5 text-base leading-7 text-gray-700">
                    <p>
                        Have a question about a listing, want to report incorrect information, or want your
                        business added to the directory? Send us a message and we&apos;ll get back to you.
                    </p>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="text-sm text-gray-600">Email</p>
                        {/* TODO: sustituye por la dirección de correo real que quieras usar */}
                        <a href="mailto:contact@findemergencyplumbing.com" className="text-lg font-semibold text-gray-900 hover:text-[var(--accent)]">
                            contact@findemergencyplumbing.com
                        </a>
                    </div>

                    <p className="text-sm text-gray-500">
                        We aim to respond within a few business days. This directory currently uses
                        controlled test data during development, so listing corrections are especially
                        helpful while we expand city coverage.
                    </p>
                </div>
            </div>
        </div>
    );
}