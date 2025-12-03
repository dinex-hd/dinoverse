'use client';

import { useEffect, useState } from 'react';
import { DocumentTextIcon, TrashIcon, PencilIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  tags: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime?: string;
  featured: boolean;
  published: boolean;
  order: number;
  active: boolean;
  createdAt: string;
};

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: '',
    authorName: 'Dinoverse',
    authorAvatar: '',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    featured: false,
    published: false,
    order: 0,
    active: true,
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/blog?${params.toString()}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [searchQuery, statusFilter]);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function openNew() {
    setEditing(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      category: '',
      tags: '',
      authorName: 'Dinoverse',
      authorAvatar: '',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      featured: false,
      published: false,
      order: 0,
      active: true,
    });
    setShowForm(true);
  }

  function openEdit(item: BlogPost) {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      image: item.image || '',
      category: item.category,
      tags: item.tags.join(', '),
      authorName: item.author?.name || 'Dinoverse',
      authorAvatar: item.author?.avatar || '',
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      readTime: item.readTime || '5 min read',
      featured: item.featured,
      published: item.published,
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
      const slug = form.slug || generateSlug(form.title);
      const payload = {
        title: form.title,
        slug,
        excerpt: form.excerpt,
        content: form.content,
        image: form.image || '',
        category: form.category,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        author: {
          name: form.authorName || 'Dinoverse',
          avatar: form.authorAvatar || '',
        },
        publishedAt: form.publishedAt,
        readTime: form.readTime || '5 min read',
        featured: form.featured,
        published: form.published,
        order: Number(form.order) || 0,
        active: form.active,
      };
      const res = await fetch(editing ? `/api/admin/blog/${editing._id}` : '/api/admin/blog', {
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
    if (!confirm('Delete this blog post?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl font-bold text-[#010333]">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your blog articles and content</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-[#2642fe] text-white text-sm font-medium hover:bg-[#1e35d8] transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Post
        </button>
      </div>

      {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">{success}</div>}

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading && items.length === 0 && <div className="text-center py-12 text-gray-500">Loading blog posts...</div>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No blog posts yet. Create your first one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={`rounded-xl border-2 ${item.published ? 'border-green-200 bg-green-50/30' : 'border-gray-200'} bg-white p-5`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-[#010333]">{item.title}</h3>
                  {item.featured && (
                    <span className="px-2 py-1 rounded text-xs bg-blue-50 text-[#2642fe] border border-blue-100">Featured</span>
                  )}
                  {!item.published && (
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">Draft</span>
                  )}
                  {!item.active && (
                    <span className="px-2 py-1 rounded text-xs bg-red-50 text-red-600">Inactive</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                  {item.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{item.tags.slice(0, 3).join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.published && (
                  <Link
                    href={`/blog/${item.slug}`}
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
            <h2 className="text-xl font-bold text-[#010333] mb-6">{editing ? 'Edit Blog Post' : 'New Blog Post'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value });
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
                  <p className="mt-1 text-xs text-gray-500">URL-friendly identifier</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="Brief summary..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333] font-mono text-sm"
                  placeholder="Full blog post content..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Plain text or markdown</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="Next.js, React, TypeScript"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author Avatar URL</label>
                  <input
                    type="url"
                    value={form.authorAvatar}
                    onChange={(e) => setForm({ ...form, authorAvatar: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
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
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                    Published
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

