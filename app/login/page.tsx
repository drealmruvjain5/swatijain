'use client';

import { useActionState } from 'react';
import { login } from './actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-forest text-ivory text-xl font-medium rounded hover:bg-forest-dark transition-colors disabled:opacity-70 disabled:cursor-wait"
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-parchment/50">
      <div className="w-full max-w-md bg-ivory p-8 rounded-lg shadow-sm border border-[#eae2d3]">
        <h1 className="text-3xl font-serif text-forest mb-6 text-center">Author Login</h1>
        
        {state?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r text-sm font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-charcoal mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              id="email" 
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-forest text-charcoal bg-white"
              placeholder="author@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-charcoal mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              id="password" 
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-forest text-charcoal bg-white"
              placeholder="••••••••"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
