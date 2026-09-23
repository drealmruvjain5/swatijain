import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-3xl font-serif text-[#2B3A2C] mb-4">404 - Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#2B3A2C] text-white rounded hover:bg-[#1f2920] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
