import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/ui/DashboardActionButtons';

export default async function DraftsPage() {
  const supabase = await createClient();
  const { data: drafts } = await supabase
    .from('writings')
    .select('id, title, category, updated_at')
    .eq('status', 'draft')
    .order('updated_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif text-forest">Your Drafts</h1>
        <Link 
          href="/dashboard/editor" 
          className="bg-forest text-ivory px-6 py-3 rounded hover:bg-forest-dark transition-colors font-medium"
        >
          Create New
        </Link>
      </div>

      {drafts && drafts.length > 0 ? (
        <div className="bg-white rounded-lg border border-parchment overflow-hidden shadow-sm">
          <ul className="divide-y divide-parchment">
            {drafts.map((draft: any) => (
              <li key={draft.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-serif text-forest font-semibold mb-2">{draft.title || 'Untitled'}</h3>
                  <div className="flex items-center gap-3">
                    <Badge category={draft.category} />
                    <span className="text-sm text-charcoal-light">Last saved: {new Date(draft.updated_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/dashboard/editor?id=${draft.id}`}
                    className="px-4 py-2 border border-forest text-forest rounded hover:bg-forest hover:text-ivory transition-colors"
                  >
                    Continue Editing
                  </Link>
                  <DeleteButton id={draft.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState message="You have no drafts currently." />
      )}
    </div>
  );
}
