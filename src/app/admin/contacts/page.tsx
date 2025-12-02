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
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#010333]">Contact Submissions</h1>
        <button onClick={logout} className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-gray-700 hover:bg-gray-800">Logout</button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-72 max-w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400 focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe]"
          />
          <button onClick={() => load(1, limit, q)} className="px-3 py-2 rounded-lg bg-[#2642fe] text-white text-sm font-medium">Search</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Per page</span>
          <select
            value={limit}
            onChange={(e) => load(1, parseInt(e.target.value, 10), q)}
            className="px-2 py-2 bg-white border border-gray-200 rounded-lg text-[#010333]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">When</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Subject</th>
              <th className="px-4 py-3 text-left font-semibold">Service</th>
              <th className="px-4 py-3 text-left font-semibold">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((it) => (
              <tr key={it._id} className="align-top">
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-[#010333]">{it.name}</td>
                <td className="px-4 py-3"><a href={`mailto:${it.email}`} className="text-[#2642fe] hover:underline">{it.email}</a></td>
                <td className="px-4 py-3 text-gray-700">{it.subject}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{it.service || '-'}</td>
                <td className="px-4 py-3 text-gray-700 max-w-[420px]"><div className="line-clamp-4">{it.message}</div></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>{loading ? 'Loading...' : 'No submissions found'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Page {page} of {totalPages} • {total} total
        </div>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}


