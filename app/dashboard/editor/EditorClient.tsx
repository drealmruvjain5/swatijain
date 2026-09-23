'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveDraft, publishWriting } from '@/app/dashboard/actions';
import { createClient } from '@/lib/supabase/client';

export default function EditorClient({ initialData }: { initialData: any }) {
  const router = useRouter();

  // If we have initialData, we start with its ID. Otherwise null.
  const [id, setId] = useState<string | null>(initialData?.id || null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'poem');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState<string>(initialData?.cover_image || '');
  
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  
  // To track dirty state effectively, we keep the last saved version
  const [lastSavedState, setLastSavedState] = useState({ title, category, content, cover_image: coverImage });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const currentState = { title, category, content, cover_image: coverImage };
    setIsDirty(JSON.stringify(currentState) !== JSON.stringify(lastSavedState));
    if (isDirty) setSaveStatus('idle');
  }, [title, category, content, coverImage, lastSavedState]);

  // Leave page warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Save logic
  const handleSave = useCallback(async (isAuto = false) => {
    if (!title && !content) return;
    if (!isDirty && isAuto) return; // Don't autosave if clean
    
    setSaveStatus('saving');
    const result = await saveDraft({
      id: id || undefined,
      title,
      category,
      content,
      cover_image: coverImage
    });

    if (result.error) {
      setSaveStatus('error');
      if (!isAuto) alert('Error saving draft: ' + result.error);
    } else {
      setSaveStatus('saved');
      setLastSavedState({ title, category, content, cover_image: coverImage });
      setIsDirty(false);
      
      if (!id && result.id) {
        setId(result.id);
        // Replace URL without reload so subsequent saves update the same ID
        window.history.replaceState(null, '', `/dashboard/editor?id=${result.id}`);
      }
    }
  }, [id, title, category, content, coverImage, isDirty]);

  // Autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDirty) {
        handleSave(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isDirty, handleSave]);

  const handlePublish = async () => {
    if (isDirty) {
      alert('Please wait for the draft to save first, or click Save Draft.');
      return;
    }
    if (!id) {
      alert('Cannot publish an empty draft. Please write something and let it save first.');
      return;
    }
    
    if (window.confirm('Are you sure you want to publish this writing? It will immediately become visible to the public.')) {
      setSaveStatus('saving');
      const result = await publishWriting(id);
      if (result.error) {
        setSaveStatus('error');
        alert('Error publishing: ' + result.error);
      } else {
        alert('Published successfully!');
        router.push('/dashboard/published');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    
    // Ensure we have an ID first so we can namespace the storage. 
    // If we don't have one, we must create the draft first.
    let writingId = id;
    if (!writingId) {
      setSaveStatus('saving');
      const result = await saveDraft({ title: title || 'Untitled', category, content, cover_image: '' });
      if (result.error || !result.id) {
        alert('Could not save draft before uploading image.');
        setIsUploading(false);
        return;
      }
      writingId = result.id;
      setId(result.id);
      window.history.replaceState(null, '', `/dashboard/editor?id=${result.id}`);
      setLastSavedState({ title: title || 'Untitled', category, content, cover_image: '' });
      setIsDirty(false);
      setSaveStatus('saved');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${writingId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert('Error uploading image: ' + error.message);
    } else {
      // Store the path. UI will resolve it using getPublicUrl
      setCoverImage(fileName);
    }
    setIsUploading(false);
  };

  const coverImageUrl = coverImage 
    ? (coverImage.startsWith('http') 
        ? coverImage 
        : `/api/images/${coverImage}`)
    : '';

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-serif text-forest">
          {id ? 'Edit Writing' : 'New Writing'}
        </h1>
        
        <div className="flex items-center gap-4">
          <span className={`text-sm italic hidden md:inline-block w-24 text-right ${saveStatus === 'error' ? 'text-red-600' : 'text-charcoal-light'}`}>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Error saving' : isDirty ? 'Unsaved' : ''}
          </span>
          <button 
            onClick={() => handleSave(false)}
            disabled={!isDirty || saveStatus === 'saving'}
            className="px-4 py-2 border border-charcoal rounded hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Draft
          </button>
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="px-4 py-2 border border-charcoal rounded hover:bg-zinc-100 transition-colors"
          >
            {isPreview ? 'Back to Edit' : 'Preview'}
          </button>
          <button 
            onClick={handlePublish}
            disabled={saveStatus === 'saving' || isDirty}
            className="px-6 py-2 bg-forest text-ivory rounded hover:bg-forest-dark transition-colors font-medium disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="flex-1 bg-white p-8 md:p-12 rounded border border-parchment overflow-y-auto">
           {coverImageUrl && (
             <div className="mb-8">
               <img src={coverImageUrl} alt="Cover Preview" className="w-full h-[400px] object-cover rounded-lg shadow-sm" />
             </div>
           )}
           <h1 className="text-4xl font-serif text-forest mb-6 text-center">{title || 'Untitled'}</h1>
           <div className={`
             mx-auto text-lg leading-relaxed text-charcoal whitespace-pre-wrap
             ${category === 'poem' ? 'text-center italic max-w-xl' : 'text-left max-w-2xl'}
             ${/[\u0900-\u097F]/.test(content) ? 'font-hindi-serif' : 'font-serif'}
           `}>
             {content || 'Start writing...'}
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6 bg-white p-6 md:p-8 rounded border border-parchment shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="title" className="sr-only">Title</label>
              <input 
                id="title"
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title..." 
                className="w-full text-3xl font-serif text-forest placeholder:text-gray-400 border-none focus:outline-none focus:ring-0 bg-transparent"
              />
            </div>
            <div className="w-full md:w-48">
              <label htmlFor="category" className="sr-only">Category</label>
              <select 
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-parchment rounded text-charcoal bg-ivory focus:outline-none focus:ring-2 focus:ring-forest capitalize"
              >
                <option value="poem">Poem</option>
                <option value="essay">Essay</option>
                <option value="story">Story</option>
                <option value="blog">Blog</option>
                <option value="reflection">Reflection</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className={`text-sm font-medium text-forest bg-parchment px-4 py-2 rounded transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#eae2d3]'}`}>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={isUploading}
                onChange={handleImageUpload}
              />
              {isUploading ? 'Uploading...' : coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
            </label>
            {coverImage && !isUploading && (
               <button 
                 onClick={() => setCoverImage('')} 
                 className="text-sm text-red-600 hover:underline"
               >
                 Remove
               </button>
            )}
          </div>

          <hr className="border-parchment" />

          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here. Line breaks and paragraphs will be preserved exactly as you type them..."
            className="flex-1 w-full text-lg font-sans text-charcoal leading-relaxed resize-none border-none focus:outline-none focus:ring-0 bg-transparent"
            spellCheck="false"
          />
        </div>
      )}
    </>
  );
}
