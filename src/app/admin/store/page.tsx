'use client';

import { useEffect, useState } from 'react';
import { ShoppingBagIcon, TrashIcon, PencilIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  rating?: number;
  reviews?: number;
  students?: number;
  tags: string[];
  format?: string;
  downloadable?: boolean;
  updates?: string;
  bestseller: boolean;
  new: boolean;
  featured: boolean;
  order: number;
  active: boolean;
  createdAt: string;
};

export default function AdminStorePage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    category: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    rating: '',
    reviews: '',
    students: '',
    tags: '',
    format: '',
    downloadable: true,
    updates: '',
    bestseller: false,
    new: false,
    featured: false,
    order: 0,
    active: true,
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      const res = await fetch(`/api/admin/store?${params.toString()}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [searchQuery, categoryFilter]);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function openNew() {
    setEditing(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      longDescription: '',
      category: '',
      price: '',
      originalPrice: '',
      discount: '',
      image: '',
      rating: '',
      reviews: '',
      students: '',
      tags: '',
      format: '',
      downloadable: true,
      updates: '',
      bestseller: false,
      new: false,
      featured: false,
      order: 0,
      active: true,
    });
    setShowForm(true);
  }

  function openEdit(item: Product) {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description,
      longDescription: item.longDescription || '',
      category: item.category,
      price: item.price.toString(),
      originalPrice: (item.originalPrice || 0).toString(),
      discount: (item.discount || 0).toString(),
      image: item.image || '',
      rating: (item.rating || 0).toString(),
      reviews: (item.reviews || 0).toString(),
      students: (item.students || 0).toString(),
      tags: item.tags.join(', '),
      format: item.format || '',
      downloadable: item.downloadable ?? true,
      updates: item.updates || '',
      bestseller: item.bestseller,
      new: item.new,
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
      const slug = form.slug || generateSlug(form.name);
      const payload = {
        name: form.name,
        slug,
        description: form.description,
        longDescription: form.longDescription || undefined,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        image: form.image || '',
        rating: form.rating ? Number(form.rating) : undefined,
        reviews: form.reviews ? Number(form.reviews) : undefined,
        students: form.students ? Number(form.students) : undefined,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        format: form.format || undefined,
        downloadable: form.downloadable,
        updates: form.updates || undefined,
        bestseller: form.bestseller,
        new: form.new,
        featured: form.featured,
        order: Number(form.order) || 0,
        active: form.active,
      };
      const res = await fetch(editing ? `/api/admin/store/${editing._id}` : '/api/admin/store', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        const errorMsg = j?.message || j?.errors?.map((e: any) => `${e.path?.join('.') || 'field'}: ${e.message}`).join(', ') || 'Save failed';
        throw new Error(errorMsg);
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
    if (!confirm('Delete this product?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/store/${id}`, { method: 'DELETE' });
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

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">Store Products</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your digital products and courses</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Product
        </button>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-sm text-red-200 backdrop-blur-sm">{error}</div>}
      {success && <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-sm text-green-200 backdrop-blur-sm">{success}</div>}

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option className="bg-gray-900" value="all">All Categories</option>
          {categories.map((cat) => (
            <option className="bg-gray-900" key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && items.length === 0 && <div className="text-center py-12 text-gray-400">Loading products...</div>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-gray-900/60 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <ShoppingBagIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No products yet. Create your first one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={`rounded-2xl border ${item.active ? 'border-green-500/40 bg-green-500/5' : 'border-gray-700'} bg-gray-900/60 backdrop-blur-sm p-5 shadow-lg`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  {item.featured && <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-200 border border-blue-500/30">Featured</span>}
                  {item.bestseller && <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-200 border border-yellow-500/30">Bestseller</span>}
                  {item.new && <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-200 border border-green-500/30">New</span>}
                  {!item.active && <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-200 border border-red-500/30">Inactive</span>}
                </div>
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span className="font-semibold text-green-300">ETB {item.price.toLocaleString()}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <>
                      <span>•</span>
                      <span className="line-through text-gray-500">ETB {item.originalPrice.toLocaleString()}</span>
                    </>
                  )}
                  {item.rating && (
                    <>
                      <span>•</span>
                      <span>⭐ {item.rating}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.active && (
                  <Link
                    href={`/store/${item.slug || item._id}`}
                    target="_blank"
                    className="p-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-200 transition-colors"
                    title="View"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                )}
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(item._id)}
                  className="p-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setEditing(null); setShowForm(false); }}>
          <div className="bg-gray-900 w-full max-w-4xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-6">{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (!editing && !form.slug) {
                        setForm((f) => ({ ...f, slug: generateSlug(e.target.value) }));
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                    pattern="[a-z0-9-]+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Long Description</label>
                <textarea
                  rows={6}
                  value={form.longDescription}
                  onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Course, Template, Asset"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (ETB) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Original Price (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reviews}
                    onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Students</label>
                  <input
                    type="number"
                    min="0"
                    value={form.students}
                    onChange={(e) => setForm({ ...form, students: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                  <input
                    type="text"
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Video Course, Template, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="React, Next.js, TypeScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Updates</label>
                  <input
                    type="text"
                    value={form.updates}
                    onChange={(e) => setForm({ ...form, updates: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Lifetime, 1 Year, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    min={0}
                  />
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.bestseller} onChange={(e) => setForm({ ...form, bestseller: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    Bestseller
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.new} onChange={(e) => setForm({ ...form, new: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    New
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    Featured
                  </label>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.downloadable} onChange={(e) => setForm({ ...form, downloadable: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    Downloadable
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    Active
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
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30">
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

