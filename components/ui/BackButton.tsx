'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="text-forest hover:text-forest-dark font-medium transition-colors group flex items-center gap-2 mb-8"
      aria-label="Go back"
    >
      <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back
    </button>
  );
}
