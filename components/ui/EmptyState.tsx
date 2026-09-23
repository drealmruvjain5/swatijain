interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = 'Nothing to show here yet.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-parchment rounded-lg">
      <div className="text-4xl mb-4 text-parchment">🍃</div>
      <h3 className="text-xl font-serif text-forest mb-2">It&apos;s quiet here</h3>
      <p className="text-charcoal-light max-w-sm">
        {message}
      </p>
    </div>
  );
}
