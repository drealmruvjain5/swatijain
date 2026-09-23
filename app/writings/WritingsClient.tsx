'use client';

import { useState, useMemo } from 'react';
import WritingCard from '@/components/ui/WritingCard';
import EmptyState from '@/components/ui/EmptyState';

export interface Writing {
  id: string;
  title: string;
  slug: string;
  category: string;
  published_at: string;
  created_at: string;
  coverImageUrl?: string;
  content?: string;
}

export default function WritingsClient({ writings }: { writings: Writing[] }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(writings.map(w => w.category)));
    return ['all', ...cats];
  }, [writings]);

  // Extract unique years from published_at
  const years = useMemo(() => {
    const y = writings
      .map(w => w.published_at ? new Date(w.published_at).getFullYear().toString() : '')
      .filter(y => y !== '');
    return ['all', ...Array.from(new Set(y)).sort().reverse()]; // Sort descending
  }, [writings]);

  // Filter and Sort Data
  const filteredWritings = useMemo(() => {
    let result = writings.filter(w => {
      // 1. Text Search (title or content)
      const searchTerm = search.toLowerCase().trim();
      const matchesSearch = !searchTerm || 
        w.title.toLowerCase().includes(searchTerm) || 
        (w.content && w.content.toLowerCase().includes(searchTerm));
      
      // 2. Category Filter
      const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;

      // 3. Year Filter
      let matchesYear = true;
      if (yearFilter !== 'all') {
        const postYear = w.published_at ? new Date(w.published_at).getFullYear().toString() : '';
        matchesYear = postYear === yearFilter;
      }

      return matchesSearch && matchesCategory && matchesYear;
    });

    // 4. Sort Order
    result = result.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [writings, search, categoryFilter, yearFilter, sortOrder]);

  const visibleWritings = filteredWritings.slice(0, visibleCount);
  const hasMore = visibleCount < filteredWritings.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 w-full flex-1">
      <h1 className="text-4xl font-serif text-forest mb-8">All Writings</h1>
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-10 bg-ivory p-4 rounded-lg border border-parchment shadow-sm">
        {/* Search */}
        <input 
          aria-label="Search writings"
          type="text" 
          placeholder="Search titles or content..." 
          className="flex-1 min-w-[250px] px-4 py-2.5 bg-white border border-parchment rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest text-charcoal font-sans transition-shadow"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(12); // Reset pagination on new search
          }}
        />
        
        {/* Category */}
        <div className="relative">
          <select 
            aria-label="Filter by category"
            className="appearance-none w-full md:w-auto pl-4 pr-10 py-2.5 bg-white border border-parchment rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest text-charcoal capitalize cursor-pointer transition-shadow"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setVisibleCount(12);
            }}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-light">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Year */}
        <div className="relative">
          <select 
            aria-label="Filter by year"
            className="appearance-none w-full md:w-auto pl-4 pr-10 py-2.5 bg-white border border-parchment rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest text-charcoal cursor-pointer transition-shadow"
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setVisibleCount(12);
            }}
          >
            <option value="all">All Years</option>
            {years.filter(y => y !== 'all').map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-light">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Sort */}
        <div className="relative">
          <select 
            aria-label="Sort by date"
            className="appearance-none w-full md:w-auto pl-4 pr-10 py-2.5 bg-white border border-parchment rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest text-charcoal cursor-pointer transition-shadow"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'newest' | 'oldest');
              setVisibleCount(12);
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-light">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredWritings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleWritings.map((w) => (
               <WritingCard 
                 key={w.id}
                 title={w.title} 
                 slug={w.slug} 
                 category={w.category} 
                 date={w.published_at} 
                 coverImage={w.coverImageUrl}
                 snippet={w.content ? (w.content.substring(0, 100) + '...') : ''} 
               />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={handleLoadMore}
                className="px-8 py-3 bg-forest text-ivory rounded-full hover:bg-forest-dark transition-colors font-medium shadow-sm hover:shadow"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState message="No writings found matching your filters. Try adjusting your search or removing some filters." />
      )}
    </div>
  );
}
