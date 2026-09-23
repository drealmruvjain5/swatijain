import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-parchment mt-auto bg-ivory">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-charcoal-light text-sm">
        <p>© {year} Swati Jain.</p>
        <nav className="mt-4 md:mt-0 flex gap-4">
          <Link href="/login" className="hover:text-forest transition-colors">
            Author Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
