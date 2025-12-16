'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  SparklesIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

type Feature = {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  emphasis?: string;
  order: number;
  active: boolean;
};

const iconOptions = [
  'SparklesIcon',
  'BoltIcon',
  'CheckBadgeIcon',
  'ShieldCheckIcon',
  'RocketLaunchIcon',
  'CodeBracketIcon',
  'PaintBrushIcon',
  'DevicePhoneMobileIcon',
  'ChartBarIcon',
];

export default function AdminFeaturesPage() {
  const [items, setItems] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: 'SparklesIcon',
    emphasis: '',
    order: 0,
    active: true,
  });

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/features');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to load features');
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load features');
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
      title: '',
      description: '',
      icon: 'SparklesIcon',
      emphasis: '',
      order: items.length,
      active: true,
    });
    setShowForm(true);
  }

  function openEdit(item: Feature) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      icon: item.icon || 'SparklesIcon',
      emphasis: item.emphasis || '',
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
        title: form.title,
        description: form.description,
        icon: form.icon,
        emphasis: form.emphasis || undefined,
        order: Number(form.order) || 0,
        active: form.active,
      };
      const res = await fetch(editing ? `/api/admin/features/${editing._id}` : '/api/admin/features', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || 'Failed to save feature');
      }
      setShowForm(false);
      setEditing(null);
      setSuccess('Saved successfully');
      setTimeout(() => setSuccess(''), 2500);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save feature');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this feature?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/features/${id}`, { method: 'DELETE' });
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">Site Features</h1>
          <p className="mt-1 text-sm text-gray-400">Control the “Everything in one place” section on the homepage.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600"
        >
          <PlusIcon className="h-4 w-4" />
          New Feature
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
          placeholder="Search features..."
          className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <span className="text-sm text-gray-400">{filteredItems.length} items</span>
      </div>

      {loading && items.length === 0 && <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6 text-center text-gray-400 backdrop-blur-sm">Loading...</div>}

      {!loading && filteredItems.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/60 p-8 text-center text-gray-400 backdrop-blur-sm">
          No features yet. Click “New Feature” to add your first highlight.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className={`rounded-2xl border-2 bg-white p-5 shadow-sm ${item.active ? 'border-gray-200' : 'border-gray-200 opacity-70'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <SparklesIcon className="h-4 w-4 text-[#2642fe]" />
                Order #{item.order}
              </div>
              {!item.active && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Hidden</span>}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-[#010333]">{item.title}</h3>
            {item.emphasis && <p className="text-xs uppercase tracking-wide text-[#2642fe]">{item.emphasis}</p>}
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>

            <div className="mt-4 flex items-center justify-between gap-2 text-sm text-gray-500">
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {item.icon || 'SparklesIcon'}
              </div>
              <div className="flex items-center gap-2">
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
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-[#010333]">{editing ? 'Edit Feature' : 'New Feature'}</h2>
            <form onSubmit={save} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                  >
                    {iconOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
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
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Label (optional)</label>
                <input
                  type="text"
                  value={form.emphasis}
                  onChange={(e) => setForm({ ...form, emphasis: e.target.value })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm"
                  placeholder="e.g. New, Popular"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Active (visible on site)
              </label>
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
                  {loading ? 'Saving…' : editing ? 'Save Changes' : 'Create Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


