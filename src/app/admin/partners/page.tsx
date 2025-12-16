'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, GlobeAltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type Partner = {
  _id: string;
  name: string;
  logo?: string;
  url?: string;
  accent?: string;
  order: number;
  active: boolean;
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    url: '',
    accent: '',
    order: 0,
    active: true,
  });

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.url || '').toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/partners');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to load partners');
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm({
      name: '',
      logo: '',
      url: '',
      accent: '',
      order: items.length,
      active: true,
    });
    setShowForm(true);
  }

  function openEdit(item: Partner) {
    setEditing(item);
    setForm({
      name: item.name,
      logo: item.logo || '',
      url: item.url || '',
      accent: item.accent || '',
      order: item.order,
      active: item.active,
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: form.name,
        logo: form.logo || undefined,
        url: form.url || undefined,
        accent: form.accent || undefined,
        order: Number(form.order) || 0,
        active: form.active,
      };
      const res = await fetch(editing ? `/api/admin/partners/${editing._id}` : '/api/admin/partners', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || 'Failed to save partner');
      }
      setShowForm(false);
      setEditing(null);
      setSuccess('Saved successfully');
      setTimeout(() => setSuccess(''), 2500);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save partner');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this partner?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setSuccess('Deleted');
      setTimeout(() => setSuccess(''), 2000);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">Partners & Tools</h1>
          <p className="mt-1 text-sm text-gray-400">Control the marquee of technologies/brands showcased on the homepage.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600"
        >
          <PlusIcon className="h-4 w-4" />
          New Partner
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">{error}</div>}
      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/20 px-4 py-3 text-sm text-green-200 backdrop-blur-sm">{success}</div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search partners..."
          className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <span className="text-sm text-gray-400">{filteredItems.length} items</span>
      </div>

      {loading && items.length === 0 && <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6 text-center text-gray-400 backdrop-blur-sm">Loading...</div>}

      {!loading && filteredItems.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/60 p-8 text-center text-gray-400 backdrop-blur-sm">
          No partners yet. Click “New Partner” to add logos/tools you work with.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div key={item._id} className={`rounded-2xl border bg-gray-900/60 backdrop-blur-sm p-5 shadow-lg ${item.active ? 'border-gray-700' : 'border-gray-800 opacity-70'}`}>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                <GlobeAltIcon className="h-4 w-4 text-cyan-300" />
                <span className="text-gray-300">Order #{item.order}</span>
              </div>
              {!item.active && <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-300 border border-gray-700">Hidden</span>}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-lg font-semibold text-cyan-200 border border-gray-700">
                {item.logo || item.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{item.name}</div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-300 hover:underline">
                    {item.url.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {item.accent && <div className="text-xs uppercase tracking-wide text-gray-400">{item.accent}</div>}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => openEdit(item)}
                className="rounded-lg border border-blue-500/30 p-2 text-blue-200 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                title="Edit"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(item._id)}
                className="rounded-lg border border-red-500/30 p-2 text-red-200 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div
            className="w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">{editing ? 'Edit Partner' : 'New Partner'}</h2>
            <form onSubmit={save} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-300">Logo / Emoji</label>
                  <input
                    type="text"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="▲ or https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Accent Label</label>
                  <input
                    type="text"
                    value={form.accent}
                    onChange={(e) => setForm({ ...form, accent: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Stack, Tool"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Website URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-300">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    min={0}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    Active (show on site)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  {loading ? 'Saving…' : editing ? 'Save Changes' : 'Create Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


