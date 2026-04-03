import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white sm:bg-gray-50 flex flex-col items-center">
      {/* Top Nav (Same as Home Page) */}
      <header className="w-full sticky top-0 z-10 flex items-center justify-center border-b border-gray-200 bg-white py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Memories</h1>
      </header>

      {/* Not Found Message */}
      <div className="flex flex-col items-center justify-center flex-grow p-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Story Not Found</h2>
        <p className="text-gray-600 mb-6">
          It looks like this memory doesn&apos;t exist or was removed.
        </p>
        <Link 
          href="/" 
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}