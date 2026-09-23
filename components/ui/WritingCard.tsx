import Link from 'next/link';
import Badge from './Badge';

interface WritingCardProps {
  title: string;
  slug: string;
  category: string;
  date: string;
  snippet?: string;
  coverImage?: string;
}

export default function WritingCard({ title, slug, category, date, snippet, coverImage }: WritingCardProps) {
  return (
    <article className="group flex flex-col rounded-lg bg-parchment hover:bg-[#eae2d3] transition-colors duration-300 overflow-hidden h-full">
      {coverImage && (
        <Link href={`/writings/${slug}`} className="block overflow-hidden h-48 w-full shrink-0 focus:outline-none" tabIndex={-1} aria-hidden="true">
          <img 
            src={coverImage} 
            alt="" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <Badge category={category} />
          <time className="text-sm text-charcoal-light font-medium" dateTime={date}>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        
        <Link href={`/writings/${slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 rounded flex-1 flex flex-col">
          <h3 className="text-2xl font-serif font-bold text-forest group-hover:text-forest-dark mb-3 line-clamp-2">
            {title}
          </h3>
          {snippet && (
            <p className="text-charcoal-light line-clamp-3 leading-relaxed mt-auto">
              {snippet}
            </p>
          )}
        </Link>
      </div>
    </article>
  );
}
