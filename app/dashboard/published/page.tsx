import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/server';
import { UnpublishButton } from '@/components/ui/DashboardActionButtons';

interface Writing {
  id: string;
  title: string;
  category: string;
  published_at: string;
}

export default async function PublishedPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('writings')
    .select('id, title, category, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
    
  const published = data as Writing[] | null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif text-forest">Published Writings</h1>
        <Link 
          href="/dashboard/editor" 
          className="bg-forest text-ivory px-6 py-3 rounded hover:bg-forest-dark transition-colors font-medium"
        >
          Create New
        </Link>
      </div>

      {published && published.length > 0 ? (
        <div className="bg-white rounded-lg border border-parchment overflow-hidden shadow-sm">
          <ul className="divide-y divide-parchment">
            {published.map((writing: Writing) => (
              <li key={writing.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-serif text-forest font-semibold mb-2">{writing.title}</h3>
                  <div className="flex items-center gap-3">
                    <Badge category={writing.category} />
                    <span className="text-sm text-charcoal-light">
                      Published: {new Date(writing.published_at).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/dashboard/editor?id=${writing.id}`}
                    className="px-4 py-2 border border-forest text-forest rounded hover:bg-forest hover:text-ivory transition-colors"
                  >
                    Edit
                  </Link>
                  <UnpublishButton id={writing.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState message="You haven't published anything yet." />
      )}
    </div>
  );
}
