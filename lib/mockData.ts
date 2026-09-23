export interface Writing {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: 'poem' | 'essay' | 'story' | 'blog' | 'reflection';
  status: 'published' | 'draft';
  published_at: string;
  cover_image?: string;
}

export const mockWritings: Writing[] = [
  {
    id: '1',
    title: 'The Silent Echo',
    slug: 'the-silent-echo',
    category: 'poem',
    status: 'published',
    published_at: '2026-09-23T10:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
    content: `In the quiet of the morning,
When the world is yet to wake,
The silent echo of your voice
Is the only sound I make.

It bounces off the frosted panes,
It rustles through the leaves,
A gentle ghost of memory
That my lonely heart receives.

I hold it close, this fragile sound,
Before the day begins,
And in this silent, echoing space,
My universe spins.`,
  },
  {
    id: '2',
    title: 'Reflections on the Shore',
    slug: 'reflections-on-the-shore',
    category: 'essay',
    status: 'published',
    published_at: '2026-09-20T14:30:00Z',
    cover_image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop',
    content: `Looking out at the vast expanse of the ocean, one cannot help but feel the weight of history and the fleeting nature of time. The waves crash with a rhythm that has existed long before us and will continue long after.

I find myself walking these sandy shores often, seeking solace in the rhythmic noise. There is something profoundly humbling about standing before a force of nature so immense and indifferent. It puts our daily anxieties into a sudden, sharp perspective.

When the tide recedes, it leaves behind a scattering of shells and sea glass—small treasures polished by time and tide. I sometimes wonder if our own lives are like that: roughened edges slowly smoothed out by the currents of our experiences, until we are left with something resilient and beautiful.`,
  },
  {
    id: '3',
    title: 'स्मृतियों के पन्ने (Pages of Memories)',
    slug: 'smritiyon-ke-panne',
    category: 'poem',
    status: 'published',
    published_at: '2026-09-15T08:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop',
    content: `धूल भरी इन किताबों में,
कहीं खो गए हैं वो दिन।
स्याही के धुंधले अक्षरों में,
छुपे हैं कुछ अनकहे छिन।

बचपन की वो पगडंडियां,
जिन पर दौड़ा करते थे हम।
अब तो बस यादों में हैं,
और आँखों में थोड़ा सा नम।

हर पन्ना एक कहानी है,
हर हर्फ एक एहसास।
ज़िंदगी की इस भागदौड़ में,
बस यही है अब मेरे पास।`,
  },
  {
    id: '4',
    title: 'The Old Oak Tree',
    slug: 'the-old-oak-tree',
    category: 'story',
    status: 'published',
    published_at: '2026-09-10T16:45:00Z',
    content: `It stood at the edge of the property long before the house was built. Its gnarled roots gripped the earth with the tenacity of a creature refusing to yield. The old oak was a silent witness to generations of children climbing its branches, carving their initials into its bark, and eventually growing up and leaving it behind.

One summer, a terrible storm rolled through the valley. The sky turned an angry, bruised purple, and the wind howled with a ferocity no one had ever heard. The next morning, the villagers emerged to assess the damage. Many trees had fallen, but the old oak still stood, albeit with a few broken branches. It had weathered the storm, just as it had weathered everything else.`,
  }
];

export const mockDrafts: Writing[] = [
  {
    id: 'd1',
    title: 'Morning Dew',
    slug: 'morning-dew',
    category: 'poem',
    status: 'draft',
    published_at: '',
    content: `The sun rises slow,\nPainting gold upon the green,\nA silent morning.`
  },
  {
    id: 'd2',
    title: 'Untitled Essay',
    slug: 'untitled-essay',
    category: 'essay',
    status: 'draft',
    published_at: '',
    content: `I started thinking about the way we communicate today versus twenty years ago...`
  }
];

// Helper functions for mock data
export const getPublishedWritings = () => {
  return mockWritings.filter(w => w.status === 'published').sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
};

export const getWritingBySlug = (slug: string) => {
  return mockWritings.find(w => w.slug === slug);
};
