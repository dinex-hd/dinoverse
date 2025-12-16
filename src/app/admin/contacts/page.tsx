'use client';

import { useEffect, useMemo, useState } from 'react';

type ContactItem = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<ContactItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    window.location.href = '/admin/login';
  }

  async function load(p = page, l = limit, query = q) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/contacts?page=${p}&limit=${l}&q=${encodeURIComponent(query)}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      setItems(json.items || []);
      setTotal(json.total || 0);
      setPage(json.page || 1);
      setLimit(json.limit || 10);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Try loading to see if we already have a cookie
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">Contact Submissions</h1>
          <p className="mt-1 text-sm text-gray-400">Review and respond to incoming messages</p>
        </div>
        <button onClick={logout} className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30">Logout</button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-72 max-w-full px-3 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <button onClick={() => load(1, limit, q)} className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 shadow-md shadow-blue-500/30">Search</button>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-sm">Per page</span>
          <select
            value={limit}
            onChange={(e) => load(1, parseInt(e.target.value, 10), q)}
            className="px-2 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option className="bg-gray-900" value={10}>10</option>
            <option className="bg-gray-900" value={20}>20</option>
            <option className="bg-gray-900" value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-700 bg-gray-900/60 backdrop-blur-sm shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="text-gray-300 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">When</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Subject</th>
              <th className="px-4 py-3 text-left font-semibold">Service</th>
              <th className="px-4 py-3 text-left font-semibold">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((it) => (
              <tr key={it._id} className="align-top hover:bg-gray-800/60 transition-colors">
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-white">{it.name}</td>
                <td className="px-4 py-3"><a href={`mailto:${it.email}`} className="text-cyan-300 hover:underline">{it.email}</a></td>
                <td className="px-4 py-3 text-gray-300">{it.subject}</td>
                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{it.service || '-'}</td>
                <td className="px-4 py-3 text-gray-300 max-w-[420px]"><div className="line-clamp-4">{it.message}</div></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-400" colSpan={6}>{loading ? 'Loading...' : 'No submissions found'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300">
        <div>
          Page {page} of {totalPages} • {total} total
        </div>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-2 rounded-lg border border-gray-700 disabled:opacity-50 hover:bg-gray-800 transition-colors">Prev</button>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="px-3 py-2 rounded-lg border border-gray-700 disabled:opacity-50 hover:bg-gray-800 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}


