import { notFound } from 'next/navigation';
import { loadProviders, getAvailableCities } from '@/data/providers';

interface PageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateStaticParams() {
  const cities = getAvailableCities();
  return cities.map(citySlug => ({ citySlug }));
}

export default async function PlumbersPage({ params }: PageProps) {
  const { citySlug } = await params;
  const providersData = loadProviders(citySlug);
  
  if (!providersData || providersData.providers.length === 0) {
    notFound();
  }
  
  // Extraer ciudad y estado del primer proveedor
  const firstProvider = providersData.providers[0];
  const cityName = firstProvider.city || citySlug.split('-').slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateCode = firstProvider.stateCode || citySlug.split('-').pop()?.toUpperCase() || 'CA';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Emergency Plumbers in {cityName}, {stateCode}
          </h1>
          <p className="mt-2 text-gray-600">
            {providersData.providers.length} local plumbers available 24/7
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providersData.providers.map(provider => (
            <div key={provider.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {provider.name}
              </h2>
              
              {provider.is24Hours && (
                <span className="inline-block mt-2 px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded">
                  24/7 hours listed
                </span>
              )}
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${provider.phone}`} className="hover:text-gray-900">
                    {provider.phone}
                  </a>
                </div>
                
                {provider.website && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 truncate">
                      Website
                    </a>
                  </div>
                )}
                
                <div className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">
                    {provider.address}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <a
                  href={`tel:${provider.phone}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
