'use client';

import { useState } from 'react';
import WritingCard from '@/components/ui/WritingCard';
import EmptyState from '@/components/ui/EmptyState';
import { mockWritings } from '@/lib/mockData';

export default function WritingsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  const writings = mockWritings.filter(w => w.status === 'published').sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const categories = ['all', ...Array.from(new Set(writings.map(w => w.category)))];

  const filteredWritings = writings.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) || 
                          w.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === 'all' || w.category === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full flex-1">
      <h1 className="text-4xl font-serif text-forest mb-8">All Writings</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input 
          type="text" 
          placeholder="Search titles or content..." 
          className="flex-1 px-4 py-2 bg-white border border-parchment rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="px-4 py-2 bg-white border border-parchment rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-charcoal capitalize"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filteredWritings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWritings.map((w) => (
             <WritingCard 
               key={w.id}
               title={w.title} 
               slug={w.slug} 
               category={w.category} 
               date={w.published_at} 
               coverImage={w.cover_image}
               snippet={w.content.substring(0, 100) + '...'} 
             />
          ))}
        </div>
      ) : (
        <EmptyState message="No writings found matching your criteria." />
      )}
    </div>
  );
}
