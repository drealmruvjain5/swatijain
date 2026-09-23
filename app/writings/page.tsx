import WritingsClient from './WritingsClient';
import { createClient } from '@/lib/supabase/server';
import { getImageUrl } from '@/lib/utils';

export default async function WritingsPage() {
  const supabase = await createClient();
  const { data: writings } = await supabase
    .from('writings')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Map to include the public URL for the images
  const processedWritings = (writings || []).map((w: any) => ({
    ...w,
    coverImageUrl: getImageUrl(w.cover_image)
  }));

  return <WritingsClient writings={processedWritings} />;
}
