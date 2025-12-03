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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#010333]">Store Products</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your digital products and courses</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-[#2642fe] text-white text-sm font-medium hover:bg-[#1e35d8] transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Product
        </button>
      </div>

      {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">{success}</div>}

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && items.length === 0 && <div className="text-center py-12 text-gray-500">Loading products...</div>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No products yet. Create your first one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={`rounded-xl border-2 ${item.active ? 'border-green-200 bg-green-50/30' : 'border-gray-200'} bg-white p-5`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-[#010333]">{item.name}</h3>
                  {item.featured && <span className="px-2 py-1 rounded text-xs bg-blue-50 text-[#2642fe] border border-blue-100">Featured</span>}
                  {item.bestseller && <span className="px-2 py-1 rounded text-xs bg-yellow-50 text-yellow-700 border border-yellow-100">Bestseller</span>}
                  {item.new && <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 border border-green-100">New</span>}
                  {!item.active && <span className="px-2 py-1 rounded text-xs bg-red-50 text-red-600">Inactive</span>}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span className="font-semibold text-green-600">ETB {item.price.toLocaleString()}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <>
                      <span>•</span>
                      <span className="line-through">ETB {item.originalPrice.toLocaleString()}</span>
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
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                    title="View"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                )}
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
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => { setEditing(null); setShowForm(false); }}>
          <div className="bg-white w-full max-w-4xl rounded-2xl p-6 border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#010333] mb-6">{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (!editing && !form.slug) {
                        setForm((f) => ({ ...f, slug: generateSlug(e.target.value) }));
                      }
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    required
                    pattern="[a-z0-9-]+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
                <textarea
                  rows={6}
                  value={form.longDescription}
                  onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="Course, Template, Asset"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reviews}
                    onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Students</label>
                  <input
                    type="number"
                    min="0"
                    value={form.students}
                    onChange={(e) => setForm({ ...form, students: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <input
                    type="text"
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="Video Course, Template, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="React, Next.js, TypeScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Updates</label>
                  <input
                    type="text"
                    value={form.updates}
                    onChange={(e) => setForm({ ...form, updates: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="Lifetime, 1 Year, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="flex flex-col justify-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.bestseller} onChange={(e) => setForm({ ...form, bestseller: e.target.checked })} />
                    Bestseller
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.new} onChange={(e) => setForm({ ...form, new: e.target.checked })} />
                    New
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                    Featured
                  </label>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.downloadable} onChange={(e) => setForm({ ...form, downloadable: e.target.checked })} />
                    Downloadable
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
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

