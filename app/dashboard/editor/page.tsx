import { Suspense } from 'react';
import EditorClient from './EditorClient';
import { createClient } from '@/lib/supabase/server';

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams.id;
  let initialData = null;

  if (id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('writings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      initialData = data;
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[85vh]">
      <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
        <EditorClient initialData={initialData} />
      </Suspense>
    </div>
  );
}
