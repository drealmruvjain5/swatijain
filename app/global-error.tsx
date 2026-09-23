'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-[#FDFBF7]">
          <h2 className="text-3xl font-serif text-red-800 mb-4">Critical Error</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#2B3A2C] text-white rounded hover:bg-[#1f2920] transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
