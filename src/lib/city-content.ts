// src/lib/city-content.ts
//
// Contenido SEO generado a partir de datos reales del directorio.
// Regla del proyecto: nunca inventar hechos sobre negocios reales.
// Este texto solo describe cifras verificables (conteo de proveedores,
// cuántos confirman 24h en su workingHours ya auditado).

export type ProviderLike = {
    is24Hours?: boolean;
};

export function generateCityIntro(
    cityName: string,
    stateCode: string,
    providers: ProviderLike[]
): string {
    const count = providers.length;
    const confirmed24h = providers.filter((p) => p.is24Hours).length;
    const providerWord = count === 1 ? "provider" : "providers";

    let availabilityNote: string;
    if (confirmed24h === 0) {
        availabilityNote =
            "None of them have confirmed 24-hour availability in their published business hours yet, so call ahead to check current availability.";
    } else if (confirmed24h === count) {
        availabilityNote = `All ${count} confirm 24-hour availability in their published business hours.`;
    } else {
        availabilityNote = `${confirmed24h} of them confirm 24-hour availability in their published business hours.`;
    }

    return `Looking for an emergency plumber in ${cityName}, ${stateCode}? We've listed ${count} local plumbing ${providerWord} serving the ${cityName} area. ${availabilityNote} Browse the list below to find contact information and call directly.`;
}