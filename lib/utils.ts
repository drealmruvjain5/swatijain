import { createClient } from '@/lib/supabase/client';

export function getImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path; // Already a URL
  
  const supabase = createClient();
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}
