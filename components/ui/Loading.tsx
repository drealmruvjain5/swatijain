export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-parchment border-t-forest rounded-full animate-spin"></div>
      <p className="mt-4 text-charcoal-light font-serif text-lg animate-pulse">Loading...</p>
    </div>
  );
}
