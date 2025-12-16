'use client';

import { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';

type Quote = {
  _id: string;
  text: string;
  author?: string;
  tag?: string;
  active?: boolean;
};

const emptyQuote: Omit<Quote, '_id'> = {
  text: '',
  author: '',
  tag: '',
  active: true,
};

export default function QuotesPage() {
  const [items, setItems] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [form, setForm] = useState<Omit<Quote, '_id'>>(emptyQuote);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/life/quotes', { cache: 'no-store' });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Failed to load quotes');
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyQuote);
    setShowForm(true);
  }

  function openEdit(q: Quote) {
    setEditing(q);
    setForm({
      text: q.text,
      author: q.author || '',
      tag: q.tag || '',
      active: q.active ?? true,
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = editing ? `/api/admin/life/quotes/${editing._id}` : '/api/admin/life/quotes';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to save quote');
      setSuccess(editing ? 'Quote updated' : 'Quote added');
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save quote');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this quote?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/life/quotes/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to delete quote');
      setSuccess('Quote deleted');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete quote');
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(q: Quote, active: boolean) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/life/quotes/${q._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to update');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Quotes
          </h1>
          <p className="mt-1 text-sm text-gray-400">Keep your best discipline reminders and motivational lines.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600"
        >
          <PlusIcon className="h-5 w-5" />
          Add Quote
        </button>
      </div>

      {error && <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-sm text-red-200">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-500/20 border border-green-500/30 text-sm text-green-200">{success}</div>}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((q) => (
          <div key={q._id} className="rounded-xl border border-gray-800 bg-gray-800/50 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30">
                <SparklesIcon className="h-5 w-5 text-cyan-200" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(q)}
                  className="p-2 rounded-lg border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(q._id)}
                  className="p-2 rounded-lg border border-red-500/30 text-red-200 hover:bg-red-500/20 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-100">{q.text}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{q.author || 'Unknown'}</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-200 border border-gray-600/60">{q.tag || 'general'}</span>
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={q.active !== false}
                onChange={(e) => toggleActive(q, e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              Active
            </label>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-sm text-gray-400">No quotes yet. Add one to inspire yourself.</div>}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setEditing(null);
            setShowForm(false);
          }}
        >
          <div
            className="bg-gray-900 w-full max-w-2xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              {editing ? 'Edit Quote' : 'New Quote'}
            </h2>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Text</label>
                <textarea
                  rows={3}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Tag</label>
                  <input
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    placeholder="discipline, patience..."
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setShowForm(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                  {loading ? 'Saving...' : editing ? 'Update Quote' : 'Create Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

