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
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your blog articles and content</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Post
        </button>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-sm text-red-200 backdrop-blur-sm">{error}</div>}
      {success && <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-sm text-green-200 backdrop-blur-sm">{success}</div>}

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option className="bg-gray-900" value="all">All Status</option>
          <option className="bg-gray-900" value="published">Published</option>
          <option className="bg-gray-900" value="draft">Draft</option>
        </select>
      </div>

      {loading && items.length === 0 && <div className="text-center py-12 text-gray-400">Loading blog posts...</div>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-gray-900/60 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <DocumentTextIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No blog posts yet. Create your first one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={`rounded-2xl border ${item.published ? 'border-green-500/40 bg-green-500/5' : 'border-gray-700'} bg-gray-900/60 backdrop-blur-sm p-5 shadow-lg`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  {item.featured && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-200 border border-blue-500/30">Featured</span>
                  )}
                  {!item.published && (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-200 border border-gray-600">Draft</span>
                  )}
                  {!item.active && (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-200 border border-red-500/30">Inactive</span>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
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
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-6">{editing ? 'Edit Blog Post' : 'New Blog Post'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value });
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
                  <p className="mt-1 text-xs text-gray-500">URL-friendly identifier</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt *</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Brief summary..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono text-sm"
                  placeholder="Full blog post content..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Plain text or markdown</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Next.js, React, TypeScript"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author Name</label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author Avatar URL</label>
                  <input
                    type="url"
                    value={form.authorAvatar}
                    onChange={(e) => setForm({ ...form, authorAvatar: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
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
                <div className="flex flex-col justify-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    Published
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

