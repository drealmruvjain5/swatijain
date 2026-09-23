import Link from 'next/link';
import { mockDrafts, mockWritings } from '@/lib/mockData';

export default function DashboardOverview() {
  const publishedCount = mockWritings.filter(w => w.status === 'published').length;
  const draftCount = mockDrafts.length;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif text-forest mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-parchment p-8 rounded-lg border border-[#eae2d3]">
          <h2 className="text-xl font-serif text-charcoal mb-2">Published Writings</h2>
          <p className="text-5xl font-bold text-forest mb-4">{publishedCount}</p>
          <Link href="/dashboard/published" className="text-forest font-medium hover:underline">
            Manage Published &rarr;
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg border border-parchment shadow-sm">
          <h2 className="text-xl font-serif text-charcoal mb-2">Current Drafts</h2>
          <p className="text-5xl font-bold text-forest mb-4">{draftCount}</p>
          <Link href="/dashboard/drafts" className="text-forest font-medium hover:underline">
            Manage Drafts &rarr;
          </Link>
        </div>
      </div>

      <div className="bg-forest text-ivory p-8 rounded-lg text-center">
        <h2 className="text-2xl font-serif mb-4">Ready to write something new?</h2>
        <Link 
          href="/dashboard/editor" 
          className="inline-block bg-ivory text-forest text-xl font-medium px-8 py-4 rounded hover:bg-parchment transition-colors"
        >
          Create New Writing
        </Link>
      </div>
    </div>
  );
}
