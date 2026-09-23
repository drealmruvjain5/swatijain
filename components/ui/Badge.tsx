interface BadgeProps {
  category: string;
}

export default function Badge({ category }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-forest text-ivory">
      {category}
    </span>
  );
}
