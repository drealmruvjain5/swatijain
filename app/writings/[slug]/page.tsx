import { notFound } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import BackButton from '@/components/ui/BackButton';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getImageUrl } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: writing } = await supabase
    .from('writings')
    .select('title, content, cover_image, category')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  
  if (!writing) {
    return { title: 'Not Found' };
  }
  
  const snippet = writing.content ? (writing.content.substring(0, 150).replace(/\n/g, ' ') + '...') : '';
  const coverUrl = getImageUrl(writing.cover_image);

  return {
    title: `${writing.title} | Swati Jain`,
    description: snippet || `Read this ${writing.category} by Swati Jain.`,
    alternates: {
      canonical: `/writings/${slug}`,
    },
    openGraph: {
      title: writing.title,
      description: snippet,
      type: 'article',
      url: `/writings/${slug}`,
      ...(coverUrl && { images: [coverUrl] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: writing.title,
      description: snippet,
      ...(coverUrl && { images: [coverUrl] }),
    }
  };
}

export async function generateStaticParams() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: writings } = await supabaseAdmin
    .from('writings')
    .select('slug')
    .eq('status', 'published');

  return (writings || []).map((w) => ({
    slug: w.slug,
  }));
}

export default async function WritingPage({ params }: Props) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: writing } = await supabase
    .from('writings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!writing) {
    notFound();
  }

  const isPoetry = writing.category === 'poem';
  // Check if text contains Devanagari characters
  const isHindi = /[\u0900-\u097F]/.test(writing.content || '');
  const coverImageUrl = getImageUrl(writing.cover_image);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
      <BackButton />
      <header className="mb-12 text-center">
        <div className="mb-6 flex justify-center">
          <Badge category={writing.category} />
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold text-forest mb-6 ${isHindi ? 'font-hindi-serif' : 'font-serif'}`}>
          {writing.title}
        </h1>
        <time className="text-charcoal-light font-medium block border-b border-parchment pb-8" dateTime={writing.published_at}>
          {new Date(writing.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>

      {coverImageUrl && (
        <div className="mb-12">
          <img 
            src={coverImageUrl} 
            alt={writing.title} 
            className="w-full h-[400px] object-cover rounded-lg shadow-sm" 
          />
        </div>
      )}

      <div 
        className={`
          mx-auto text-lg leading-relaxed text-charcoal
          whitespace-pre-wrap
          ${isPoetry ? 'text-center italic max-w-xl' : 'text-left max-w-2xl'}
          ${isHindi ? 'font-hindi-serif' : 'font-serif'}
        `}
      >
        {writing.content}
      </div>
    </article>
  );
}
