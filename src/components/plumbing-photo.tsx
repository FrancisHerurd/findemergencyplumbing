// src/components/plumbing-photo.tsx
//
// Imagen genérica de fontanería, reutilizada en home, /cities y
// /city/[stateSlug] (las páginas que no representan una ciudad
// concreta). Requiere que exista public/images/plumbing-hero.jpg.

import Image from "next/image";

type PlumbingPhotoProps = {
    size?: "md" | "lg";
    className?: string;
};

const SIZES = {
    md: "h-32 w-56 sm:h-36 sm:w-64",
    lg: "h-48 w-72 lg:h-56 lg:w-96",
};

export default function PlumbingPhoto({ size = "md", className = "" }: PlumbingPhotoProps) {
    return (
        <div
            className={`relative shrink-0 overflow-hidden rounded-2xl shadow-lg ${SIZES[size]} ${className}`}
        >
            <Image
                src="/images/plumbing-hero.jpg"
                alt="Plumber repairing a pipe"
                fill
                sizes="(min-width: 1024px) 384px, (min-width: 640px) 260px, 100vw"
                className="object-cover"
                priority={size === "lg"}
            />
        </div>
    );
}
