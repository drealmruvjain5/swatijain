import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-parchment bg-ivory/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-2xl font-serif text-forest font-semibold hover:opacity-80 transition-opacity"
        >
          Author Name
        </Link>
        <nav>
          <ul className="flex items-center gap-6 text-charcoal font-medium">
            <li>
              <Link href="/writings" className="hover:text-forest transition-colors">
                Writings
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-forest transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-forest transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
