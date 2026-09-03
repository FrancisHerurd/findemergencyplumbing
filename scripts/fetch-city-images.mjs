// scripts/fetch-city-images.mjs
//
// Descarga una foto de skyline/paisaje urbano por ciudad usando la API
// gratuita de Pexels, y las guarda en public/images/cities/{citySlug}.jpg.
// Solo se ejecuta manualmente en tu máquina, nunca en el build de Vercel
// ni en tiempo de ejecución del sitio.
//
// Incluye un filtro automático de calidad basado en el campo "alt" de
// Pexels: rechaza fotos sin vocabulario urbano y fotos que mencionen
// lugares conocidos por dar falsos positivos (detectado en la corrida
// anterior: Portland, Pittsburgh, Jakarta, Sacramento, San Francisco,
// Scotland). Aun así, revisa manualmente el manifiesto antes de subir.
//
// Uso:
//   node --env-file=.env.local scripts/fetch-city-images.mjs
//   node --env-file=.env.local scripts/fetch-city-images.mjs --force   (re-descarga todas)


import fs from "node:fs";
import path from "node:path";


const PROVIDERS_DIR = path.resolve(process.cwd(), "data", "providers");
const IMAGES_DIR = path.resolve(process.cwd(), "public", "images", "cities");
const MANIFEST_PATH = path.resolve(process.cwd(), "data", "city-images.json");


const FORCE = process.argv.includes("--force");
const API_KEY = process.env.PEXELS_API_KEY;


const STATE_NAMES = {
  AZ: "Arizona",
  CA: "California",
  FL: "Florida",
  MA: "Massachusetts",
  TX: "Texas",
};


// Al menos una de estas palabras debe aparecer en el "alt" de Pexels
// para aceptar la foto como representativa de una ciudad/paisaje urbano.
const URBAN_KEYWORDS = [
  "skyline",
  "city",
  "downtown",
  "urban",
  "cityscape",
  "buildings",
  "aerial",
  "town",
  "street",
];


// Lugares que ya sabemos que contaminaron la corrida anterior con fotos
// de sitios totalmente distintos al target (aunque el alt tenga palabra
// urbana). Amplía esta lista si detectas nuevos casos al auditar.
const EXCLUDE_TERMS = [
  "portland",
  "pittsburgh",
  "jakarta",
  "sacramento",
  "san francisco",
  "scotland",
  "indonesia",
];


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function getCities() {
  const files = fs.readdirSync(PROVIDERS_DIR).filter((f) => f.endsWith(".json"));


  return files.map((file) => {
    const citySlug = file.replace(/\.json$/, "");
    const data = JSON.parse(fs.readFileSync(path.join(PROVIDERS_DIR, file), "utf-8"));
    const first = data.providers?.[0];


    return {
      citySlug,
      city: first?.city || citySlug,
      stateCode: first?.stateCode || "",
    };
  });
}


async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;


  const res = await fetch(url, {
    headers: { Authorization: API_KEY },
  });


  if (!res.ok) {
    throw new Error(`Pexels API error ${res.status} for query "${query}"`);
  }


  const json = await res.json();
  return json.photos?.[0] || null;
}


function isValidMatch(photo, city) {
  const alt = (photo.alt || "").toLowerCase();
  const cityLower = city.toLowerCase();

  const hasUrbanKeyword = URBAN_KEYWORDS.some((kw) => alt.includes(kw));
  if (!hasUrbanKeyword) return false;

  const hasExcludedTerm = EXCLUDE_TERMS.some(
    (term) => alt.includes(term) && !cityLower.includes(term)
  );
  if (hasExcludedTerm) return false;

  return true;
}


async function findPhotoForCity(city, stateCode) {
  const stateName = STATE_NAMES[stateCode] || stateCode;


  const queries = [
    `${city}, ${stateName} skyline`,
    `${city} skyline`,
    `${city} downtown`,
    `${stateName} city skyline`,
    "american city skyline",
  ];


  for (const query of queries) {
    const photo = await searchPexels(query);
    if (photo && isValidMatch(photo, city)) {
      return { photo, queryUsed: query, isFallback: query === "american city skyline" };
    }
    await sleep(250);
  }


  return null;
}


async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}


async function main() {
  if (!API_KEY) {
    console.error("Falta PEXELS_API_KEY. Ejecuta con: node --env-file=.env.local scripts/fetch-city-images.mjs");
    process.exit(1);
  }


  fs.mkdirSync(IMAGES_DIR, { recursive: true });


  const manifest = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"))
    : {};


  const cities = getCities();
  const results = { downloaded: [], skipped: [], fallback: [], failed: [] };


  for (const { citySlug, city, stateCode } of cities) {
    const destPath = path.join(IMAGES_DIR, `${citySlug}.jpg`);


    if (!FORCE && fs.existsSync(destPath) && manifest[citySlug]) {
      results.skipped.push(citySlug);
      continue;
    }


    try {
      const match = await findPhotoForCity(city, stateCode);


      if (!match) {
        results.failed.push(citySlug);
        console.log(`SKIP ${citySlug}: sin foto que pase el filtro de calidad`);
        continue;
      }


      const imageUrl = match.photo.src.large;
      await downloadImage(imageUrl, destPath);


      manifest[citySlug] = {
        file: `${citySlug}.jpg`,
        query: match.queryUsed,
        isFallback: match.isFallback,
        alt: match.photo.alt || "",
        photographer: match.photo.photographer,
        photographerUrl: match.photo.photographer_url,
        pexelsUrl: match.photo.url,
      };


      if (match.isFallback) {
        results.fallback.push(citySlug);
      } else {
        results.downloaded.push(citySlug);
      }


      console.log(`OK  ${citySlug}  (query: "${match.queryUsed}", alt: "${match.photo.alt || ""}")`);
      await sleep(300);
    } catch (err) {
      console.error(`FAIL ${citySlug}: ${err.message}`);
      results.failed.push(citySlug);
    }
  }


  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");


  console.log("\n--- Resumen ---");
  console.log(`Descargadas con foto específica: ${results.downloaded.length}`);
  console.log(`Descargadas con foto genérica de respaldo: ${results.fallback.length}`);
  console.log(`Ya existían (saltadas): ${results.skipped.length}`);
  console.log(`Sin foto válida (usarán el fallback de plumbing-hero.jpg): ${results.failed.length}`);
  if (results.fallback.length > 0) {
    console.log("\nCiudades con foto de respaldo genérica (revisar manualmente si quieres una mejor):");
    console.log(results.fallback.join(", "));
  }
  if (results.failed.length > 0) {
    console.log("\nCiudades sin foto válida (fallo de red, API, o ninguna pasó el filtro):");
    console.log(results.failed.join(", "));
  }
}


main();