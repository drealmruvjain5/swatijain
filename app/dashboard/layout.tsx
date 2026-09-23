import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-ivory">
      {/* Dashboard Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-forest text-ivory flex-shrink-0 p-6 md:min-h-screen">
        <h2 className="text-2xl font-serif font-bold mb-8 text-parchment">Author Dashboard</h2>
        <nav className="flex flex-col gap-4 text-lg">
          <Link href="/dashboard" className="hover:text-parchment transition-colors p-2 -mx-2 rounded hover:bg-forest-dark">
            Overview
          </Link>
          <Link href="/dashboard/editor" className="hover:text-parchment transition-colors p-2 -mx-2 rounded hover:bg-forest-dark font-medium text-yellow-100">
            + Create New Writing
          </Link>
          <hr className="border-forest-dark my-2" />
          <Link href="/dashboard/drafts" className="hover:text-parchment transition-colors p-2 -mx-2 rounded hover:bg-forest-dark">
            Drafts
          </Link>
          <Link href="/dashboard/published" className="hover:text-parchment transition-colors p-2 -mx-2 rounded hover:bg-forest-dark">
            Published
          </Link>
          <hr className="border-forest-dark my-2" />
          <Link href="/dashboard/settings" className="hover:text-parchment transition-colors p-2 -mx-2 rounded hover:bg-forest-dark">
            Settings
          </Link>
          <Link href="/" className="hover:text-parchment transition-colors p-2 -mx-2 rounded hover:bg-forest-dark">
            View Public Site
          </Link>
          <button className="text-left hover:text-red-300 transition-colors p-2 -mx-2 rounded hover:bg-forest-dark mt-auto">
            Log Out (Mock)
          </button>
        </nav>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
