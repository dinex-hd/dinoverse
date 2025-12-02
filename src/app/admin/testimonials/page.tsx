'use client';

import { useEffect, useState } from 'react';
import { StarIcon, UserCircleIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  rating: number;
  featured: boolean;
  order: number;
  active: boolean;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    quote: '',
    name: '',
    role: '',
    company: '',
    avatar: '',
    rating: 5,
    featured: false,
    order: 0,
    active: true,
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/admin/testimonials${query}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [searchQuery]);

  function openNew() {
    setEditing(null);
    setForm({
      quote: '',
      name: '',
      role: '',
      company: '',
      avatar: '',
      rating: 5,
      featured: false,
      order: 0,
      active: true,
    });
    setShowForm(true);
  }

  function openEdit(item: Testimonial) {
    setEditing(item);
    setForm({
      quote: item.quote,
      name: item.name,
      role: item.role,
      company: item.company || '',
      avatar: item.avatar || '',
      rating: item.rating,
      featured: item.featured,
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
        quote: form.quote,
        name: form.name,
        role: form.role,
        company: form.company || undefined,
        avatar: form.avatar || undefined,
        rating: Number(form.rating) || 5,
        featured: form.featured,
        order: Number(form.order) || 0,
        active: form.active,
      };
      const res = await fetch(editing ? `/api/admin/testimonials/${editing._id}` : '/api/admin/testimonials', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.message || 'Save failed');
      }
      setEditing(null);
      setShowForm(false);
      setSuccess('Saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSuccess('Deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#010333]">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-600">Showcase client feedback on the homepage</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-[#2642fe] text-white text-sm font-medium hover:bg-[#1e35d8] transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Testimonial
        </button>
      </div>

      {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">{success}</div>}

      <div>
        <input
          type="text"
          placeholder="Search testimonials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400"
        />
      </div>

      {loading && items.length === 0 && <div className="text-center py-12 text-gray-500">Loading testimonials...</div>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No testimonials yet. Add your first one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item._id}
            className={`rounded-2xl border-2 ${item.featured ? 'border-[#2642fe]' : 'border-gray-200'} bg-white p-6 flex flex-col gap-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <UserCircleIcon className="h-12 w-12 text-gray-300" />
                )}
                <div>
                  <div className="font-semibold text-[#010333]">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.role}{item.company ? ` • ${item.company}` : ''}</div>
                </div>
              </div>
              {!item.active && <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">Inactive</span>}
            </div>

            <p className="text-sm text-gray-600 line-clamp-4">“{item.quote}”</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${star <= item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">Order #{item.order}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(item._id)}
                  className="p-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                  title="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              {item.featured && (
                <span className="px-2 py-1 rounded text-xs bg-blue-50 text-[#2642fe] border border-blue-100">Homepage</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => { setEditing(null); setShowForm(false); }}>
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#010333] mb-6">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quote *</label>
                <textarea
                  rows={4}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="Client feedback..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    min={0}
                  />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                    Featured on homepage
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                    Active (visible)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setShowForm(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                  {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

