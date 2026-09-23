import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/writings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic writing routes
  const supabase = await createClient();
  const { data: writings } = await supabase
    .from('writings')
    .select('slug, updated_at')
    .eq('status', 'published');

  if (writings) {
    const writingRoutes = writings.map((writing) => ({
      url: `${siteUrl}/writings/${writing.slug}`,
      lastModified: new Date(writing.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    
    routes.push(...writingRoutes);
  }

  return routes;
}
