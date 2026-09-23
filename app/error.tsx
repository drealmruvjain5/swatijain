'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-3xl font-serif text-[#2B3A2C] mb-4">Something went wrong!</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#2B3A2C] text-white rounded hover:bg-[#1f2920] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
