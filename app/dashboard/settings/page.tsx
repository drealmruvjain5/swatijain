export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-serif text-forest mb-8">Author Settings</h1>
      
      <div className="bg-white p-8 rounded-lg border border-parchment shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-serif text-charcoal mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-charcoal-light mb-1">Display Name</label>
              <input type="text" defaultValue="Author Name" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-forest text-charcoal bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block text-charcoal-light mb-1">Email (Used for Login)</label>
              <input type="email" defaultValue="author@example.com" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-forest text-charcoal bg-gray-50" readOnly />
            </div>
            <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200">
              Note: This is a mock settings page. Profile updates are not yet functional.
            </p>
          </div>
        </div>

        <hr className="border-parchment" />

        <div>
          <h2 className="text-2xl font-serif text-charcoal mb-4">Security</h2>
          <button className="px-4 py-2 bg-charcoal text-ivory rounded hover:bg-black transition-colors font-medium">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
