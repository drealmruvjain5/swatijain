'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper for slugs preserving Hindi characters but stripping symbols
function generateSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F]+/g, '-') // Allow alphanumeric and Devanagari
    .replace(/(^-|-$)/g, '');
    
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}

// 1. Save or Update Draft
export async function saveDraft(data: {
  id?: string;
  title: string;
  category: string;
  content: string;
  cover_image: string;
}) {
  const supabase = await createClient();
  
  // Verify auth layer independently
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const payload: any = {
    title: data.title,
    category: data.category,
    content: data.content,
    cover_image: data.cover_image,
  };

  if (!data.id) {
    // New draft
    payload.slug = generateSlug(data.title);
    payload.status = 'draft';
    
    const { data: insertedData, error } = await supabase
      .from('writings')
      .insert(payload)
      .select('id')
      .single();

    if (error) return { error: error.message };
    
    revalidatePath('/dashboard');
    return { id: insertedData.id, success: true };
  } else {
    // Existing draft
    const { error } = await supabase
      .from('writings')
      .update(payload)
      .eq('id', data.id);

    if (error) return { error: error.message };
    
    revalidatePath('/dashboard');
    return { id: data.id, success: true };
  }
}

// 2. Publish Writing
export async function publishWriting(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('writings')
    .update({ 
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/writings');
  return { success: true };
}

// 3. Unpublish Writing
export async function unpublishWriting(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('writings')
    .update({ 
      status: 'draft',
      published_at: null
    })
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/writings');
  return { success: true };
}

// 4. Delete Writing
export async function deleteWriting(id: string) {
  const supabase = await createClient();
  
  // First, fetch to see if there's a cover image to delete
  const { data: writing } = await supabase
    .from('writings')
    .select('cover_image')
    .eq('id', id)
    .single();

  if (writing?.cover_image) {
    // Extract file path from URL or if it's stored directly as path
    // If it's a URL, we need to parse it. If we store the path, we can delete directly.
    // Assuming we store the public URL, extracting path is tricky unless we only store the path.
    // For now, let's assume we store the path. If it starts with 'http', it's tricky.
    // Wait, the prompt requested: "Store the storage path in the database rather than relying only on a hardcoded public URL."
    const path = writing.cover_image;
    if (!path.startsWith('http')) {
      await supabase.storage.from('images').remove([path]);
    }
  }

  const { error } = await supabase
    .from('writings')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/dashboard');
  return { success: true };
}
