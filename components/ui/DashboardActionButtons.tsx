'use client';

import { deleteWriting, unpublishWriting } from '@/app/dashboard/actions';
import { useTransition } from 'react';

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('WARNING: Are you sure you want to delete this writing? This cannot be undone.')) {
      startTransition(async () => {
        const result = await deleteWriting(id);
        if (result.error) {
          alert('Error deleting: ' + result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function UnpublishButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleUnpublish = () => {
    if (window.confirm('Are you sure you want to unpublish this? It will be moved back to your drafts.')) {
      startTransition(async () => {
        const result = await unpublishWriting(id);
        if (result.error) {
          alert('Error unpublishing: ' + result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleUnpublish}
      disabled={isPending}
      className="px-4 py-2 border border-yellow-500 text-yellow-700 rounded hover:bg-yellow-50 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Unpublishing...' : 'Unpublish'}
    </button>
  );
}
