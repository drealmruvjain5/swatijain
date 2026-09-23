import { notFound } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import BackButton from '@/components/ui/BackButton';
import { getWritingBySlug, mockWritings } from '@/lib/mockData';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);
  
  if (!writing) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${writing.title} | Personal Literary Website`,
  };
}

export async function generateStaticParams() {
  return mockWritings
    .filter((w) => w.status === 'published')
    .map((w) => ({
      slug: w.slug,
    }));
}

export default async function WritingPage({ params }: Props) {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);

  if (!writing || writing.status !== 'published') {
    notFound();
  }

  const isPoetry = writing.category === 'poem';
  // Check if text contains Devanagari characters
  const isHindi = /[\u0900-\u097F]/.test(writing.content);

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

      {writing.cover_image && (
        <div className="mb-12">
          <img 
            src={writing.cover_image} 
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
