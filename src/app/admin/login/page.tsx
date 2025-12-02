'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      const next = new URLSearchParams(window.location.search).get('next') || '/admin/dashboard';
      window.location.href = next;
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-[#010333] mb-2">Admin Login</h1>
      <p className="text-gray-600 mb-6">Enter your admin email and password to continue.</p>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-[#010333] placeholder:text-gray-400 focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-[#010333] placeholder:text-gray-400 focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe]"
        />
        <button
          type="submit"
          disabled={loading || !password || !email}
          className="w-full px-4 py-3 rounded-xl font-semibold text-white bg-[#2642fe] hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}


