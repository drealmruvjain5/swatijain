'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // MOCK LOGIN: Just redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-parchment/50">
      <div className="w-full max-w-md bg-ivory p-8 rounded-lg shadow-sm border border-[#eae2d3]">
        <h1 className="text-3xl font-serif text-forest mb-2 text-center">Author Login</h1>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r text-sm">
          <strong>Notice:</strong> This is a mock login for UI demonstration. Authentication is not yet connected. Any credentials will work.
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-charcoal mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
              placeholder="author@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-charcoal mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-forest text-ivory text-xl font-medium rounded hover:bg-forest-dark transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
