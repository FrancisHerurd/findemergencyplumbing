import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900">City not found</h1>
      <p className="mt-2 text-gray-600">
        We don&apos;t have emergency plumbers listed for this location yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        Go back home
      </Link>
    </main>
  );
}