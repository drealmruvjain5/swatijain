'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockDrafts, mockWritings } from '@/lib/mockData';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('poem');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isDirty, setIsDirty] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Mock loading existing data
  useEffect(() => {
    if (id) {
      const existing = [...mockDrafts, ...mockWritings].find(w => w.id === id);
      if (existing) {
        setTitle(existing.title);
        setCategory(existing.category);
        setContent(existing.content);
        setCoverImage(existing.cover_image || '');
        // Timeout to allow state to settle before tracking dirty state
        setTimeout(() => setInitialLoad(false), 100);
      } else {
        setInitialLoad(false);
      }
    } else {
      setInitialLoad(false);
    }
  }, [id]);

  // Dirty state tracking
  useEffect(() => {
    if (!initialLoad) {
      setIsDirty(true);
      setSaveStatus('idle');
    }
  }, [title, content, category, initialLoad]);

  // Leave page warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Standard way to trigger browser warning
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Mock Autosave
  useEffect(() => {
    if (!title && !content) return;
    if (!isDirty) return;
    
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setSaveStatus('saved');
      setIsDirty(false); // Assume autosave clears dirty state
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, category, isDirty]);

  const handleManualSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setIsDirty(false);
      alert('Draft saved manually!');
    }, 500);
  };

  const handlePublish = () => {
    if (window.confirm('Are you sure you want to publish this writing? It will immediately become visible to the public.')) {
      alert('Mock Publish Successful!');
      router.push('/dashboard/published');
    }
  };

  const handleDelete = () => {
    if (window.confirm('WARNING: Are you sure you want to delete this writing? This cannot be undone.')) {
      alert('Mock Delete Successful!');
      router.push('/dashboard/drafts');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-serif text-forest">
          {id ? 'Edit Writing' : 'New Writing'}
        </h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-charcoal-light italic hidden md:inline-block w-24 text-right">
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : isDirty ? 'Unsaved' : ''}
          </span>
          <button 
            onClick={handleManualSave}
            disabled={!isDirty}
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
            className="px-6 py-2 bg-forest text-ivory rounded hover:bg-forest-dark transition-colors font-medium"
          >
            Publish
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="flex-1 bg-white p-8 md:p-12 rounded border border-parchment overflow-y-auto">
           {coverImage && (
             <div className="mb-8">
               <img src={coverImage} alt="Cover Preview" className="w-full h-[400px] object-cover rounded-lg shadow-sm" />
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
            <label className="text-sm font-medium text-forest bg-parchment px-4 py-2 rounded cursor-pointer hover:bg-[#eae2d3] transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCoverImage(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
              {coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
            </label>
            {coverImage && (
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

          <div className="flex justify-end pt-4 border-t border-parchment">
            <button 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 transition-colors font-medium"
            >
              Delete Draft
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function EditorPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[85vh]">
      <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
        <EditorContent />
      </Suspense>
    </div>
  );
}
