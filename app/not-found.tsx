import Header from "@/components/Header";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Top Nav (Same as Home Page) */}
      <Header />
      
      {/* Not Found Message */}
      <div className="flex flex-col items-center justify-center flex-grow p-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Story Not Found</h2>
        <p className="text-gray-600 mb-6">
          It looks like the thing you wanted doesn&apos;t exist or was removed.
        </p>
        <Link 
          href="/" 
          className="rounded-full bg-theme-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}