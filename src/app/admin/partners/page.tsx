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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#010333]">Partners & Tools</h1>
          <p className="mt-1 text-sm text-gray-600">Control the marquee of technologies/brands showcased on the homepage.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2642fe] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1f36d1]"
        >
          <PlusIcon className="h-4 w-4" />
          New Partner
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search partners..."
          className="w-full max-w-sm rounded-lg border-2 border-gray-200 px-4 py-2 text-sm"
        />
        <span className="text-sm text-gray-500">{filteredItems.length} items</span>
      </div>

      {loading && items.length === 0 && <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">Loading...</div>}

      {!loading && filteredItems.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          No partners yet. Click “New Partner” to add logos/tools you work with.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div key={item._id} className={`rounded-2xl border-2 bg-white p-5 shadow-sm ${item.active ? 'border-gray-200' : 'border-gray-200 opacity-70'}`}>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                <GlobeAltIcon className="h-4 w-4 text-[#2642fe]" />
                Order #{item.order}
              </div>
              {!item.active && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Hidden</span>}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-lg font-semibold text-[#2642fe]">
                {item.logo || item.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-semibold text-[#010333]">{item.name}</div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2642fe] hover:underline">
                    {item.url.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {item.accent && <div className="text-xs uppercase tracking-wide text-gray-500">{item.accent}</div>}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => openEdit(item)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                title="Edit"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(item._id)}
                className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-[#010333]">{editing ? 'Edit Partner' : 'New Partner'}</h2>
            <form onSubmit={save} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Logo / Emoji</label>
                  <input
                    type="text"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                    placeholder="▲ or https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Accent Label</label>
                  <input
                    type="text"
                    value={form.accent}
                    onChange={(e) => setForm({ ...form, accent: e.target.value })}
                    className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                    placeholder="e.g. Stack, Tool"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Website URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                  placeholder="https://"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                    min={0}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    />
                    Active (show on site)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" className="rounded-lg border border-gray-200 px-4 py-2" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2642fe] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
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


