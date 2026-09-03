// src/components/city-photo.tsx
//
// Foto de skyline/paisaje urbano específica de cada ciudad, generada por
// scripts/fetch-city-images.mjs. Si no existe entrada en el manifiesto
// (ciudad nueva sin ejecutar el script todavía), cae en la imagen
// genérica de fontanería para no romper el layout.


import fs from "node:fs";
import path from "node:path";
import Image from "next/image";


type CityImageManifest = Record<
  string,
  { file: string; photographer?: string; photographerUrl?: string }
>;


function getCityImageManifest(): CityImageManifest {
  const manifestPath = path.resolve(process.cwd(), "data", "city-images.json");
  if (!fs.existsSync(manifestPath)) return {};


  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as CityImageManifest;
  } catch {
    return {};
  }
}


type CityPhotoProps = {
  citySlug: string;
  cityName: string;
  size?: "md" | "lg" | "xl" | "hero";
  className?: string;
};


const SIZES = {
  md: "h-32 w-56 sm:h-36 sm:w-64",
  lg: "h-48 w-72 lg:h-56 lg:w-96",
  xl: "h-64 w-full max-w-3xl sm:h-80 lg:h-96",
  hero: "h-full w-full min-h-[280px]",
};


export default function CityPhoto({ citySlug, cityName, size = "md", className = "" }: CityPhotoProps) {
  const manifest = getCityImageManifest();
  const entry = manifest[citySlug];
  const src = entry ? `/images/cities/${entry.file}` : "/images/plumbing-hero.jpg";


  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg ${SIZES[size]} ${className}`}
    >
      <Image
        src={src}
        alt={`${cityName} skyline`}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}