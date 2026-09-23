import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  
  if (!pathArray || pathArray.length === 0) {
    return new NextResponse('Missing path', { status: 400 });
  }

  const filePath = pathArray.join('/');
  
  // Use the server client (which automatically passes the session cookie if the user is logged in).
  // If the user is not logged in, it acts as an anonymous request, and the Supabase Storage RLS will enforce
  // that the image can only be downloaded if the parent writing is published.
  const supabase = await createClient();
  
  const { data, error } = await supabase.storage.from('images').download(filePath);

  if (error || !data) {
    return new NextResponse('Image not found or unauthorized', { status: 404 });
  }

  // Determine content type
  const ext = filePath.split('.').pop()?.toLowerCase();
  let contentType = 'image/jpeg';
  if (ext === 'png') contentType = 'image/png';
  if (ext === 'webp') contentType = 'image/webp';
  if (ext === 'gif') contentType = 'image/gif';
  if (ext === 'svg') contentType = 'image/svg+xml';

  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // Cache aggressively in the CDN, but allow it to be revalidated if necessary
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
