import WritingCard from '@/components/ui/WritingCard';
import EmptyState from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/server';
import { getImageUrl } from '@/lib/utils';

export default async function Home() {
  const supabase = await createClient();
  const { data: writings } = await supabase
    .from('writings')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);

  const featured = writings ? writings.slice(0, 2) : [];
  const recent = writings ? writings.slice(2, 6) : [];

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Hero Section with Author Photo */}
      <section className="max-w-5xl mx-auto px-6 w-full min-h-[calc(100vh-80px)] flex flex-col md:flex-row justify-center items-center gap-12 border-b border-parchment">
        <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shrink-0 border-4 border-parchment shadow-md">
          <img 
            src="/swati-jain.jpeg" 
            alt="Swati Jain" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left flex-1 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-serif text-forest mb-6">
            Swati Jain
          </h1>
          <p className="text-xl text-charcoal-light font-sans leading-relaxed">
            Welcome to my quiet corner of the internet. A place for poems, blogs, essays, and stories traversing the gentle rhythms of life.
          </p>
        </div>
      </section>

      {/* Marquee Animation */}
      <section className="bg-forest text-parchment py-4 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex flex-shrink-0 items-center gap-12 pr-12 font-serif text-xl tracking-wider">
          <span>POETRY</span> <span className="text-xs">✦</span>
          <span>ESSAYS</span> <span className="text-xs">✦</span>
          <span>STORIES</span> <span className="text-xs">✦</span>
          <span>REFLECTIONS</span> <span className="text-xs">✦</span>
          <span>हिंदी कविता</span> <span className="text-xs">✦</span>
        </div>
        <div className="animate-marquee flex flex-shrink-0 items-center gap-12 pr-12 font-serif text-xl tracking-wider" aria-hidden="true">
          <span>POETRY</span> <span className="text-xs">✦</span>
          <span>ESSAYS</span> <span className="text-xs">✦</span>
          <span>STORIES</span> <span className="text-xs">✦</span>
          <span>REFLECTIONS</span> <span className="text-xs">✦</span>
          <span>हिंदी कविता</span> <span className="text-xs">✦</span>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 w-full">
        {/* Photo Showcase (Featured) */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif text-forest">Featured Works</h2>
            <a href="/writings" className="text-forest hover:underline font-medium">View All &rarr;</a>
          </div>
          
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((w: any) => (
                <WritingCard 
                  key={w.id}
                  title={w.title} 
                  slug={w.slug} 
                  category={w.category} 
                  date={w.published_at} 
                  coverImage={getImageUrl(w.cover_image)}
                  snippet={w.content ? (w.content.substring(0, 150) + '...') : ''} 
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No featured writings yet." />
          )}
        </section>

        {/* Recent Writings List */}
        <section>
          <h2 className="text-3xl font-serif text-forest mb-10">Recent Additions</h2>
          {recent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((w: any) => (
                <WritingCard 
                  key={w.id}
                  title={w.title} 
                  slug={w.slug} 
                  category={w.category} 
                  date={w.published_at} 
                  coverImage={getImageUrl(w.cover_image)}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No more recent writings to show." />
          )}
        </section>
      </div>
    </div>
  );
}
