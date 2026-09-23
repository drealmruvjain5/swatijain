export function getImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path; // Already a URL
  
  // Route through our secure Next.js API proxy to enforce RLS
  return `/api/images/${path}`;
}
