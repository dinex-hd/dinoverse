'use client';

import { useEffect, useState } from 'react';
import { PhotoIcon, EyeIcon, CodeBracketIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

const postTypes = {
  web: {
    label: 'Web App',
    category: 'Web Development',
    descriptionPlaceholder: 'High-level summary of the web project...',
    longLabel: 'Case Study',
    techLabel: 'Tech Stack (comma separated)',
    techPlaceholder: 'Next.js, TypeScript, Tailwind CSS',
  },
  mobile: {
    label: 'Mobile App',
    category: 'Mobile Development',
    descriptionPlaceholder: 'Describe the mobile experience and value...',
    longLabel: 'Product Story',
    techLabel: 'Tech Stack / Frameworks',
    techPlaceholder: 'React Native, Expo, Firebase',
  },
  graphics: {
    label: 'Graphics / Branding',
    category: 'Graphics & Branding',
    descriptionPlaceholder: 'Describe the design goal and impact...',
    longLabel: 'Design Narrative',
    techLabel: 'Tools & Formats',
    techPlaceholder: 'Figma, Illustrator, Photoshop, PNG, PDF',
  },
  marketing: {
    label: 'Marketing / Content',
    category: 'Marketing & Content',
    descriptionPlaceholder: 'Summarize the campaign or content initiative...',
    longLabel: 'Campaign Details',
    techLabel: 'Channels & Tools',
    techPlaceholder: 'YouTube, TikTok, Premiere Pro, Canva',
  },
  other: {
    label: 'Other',
    category: 'Custom Project',
    descriptionPlaceholder: 'Describe the project...',
    longLabel: 'Details',
    techLabel: 'Tools / Stack',
    techPlaceholder: 'List key tools or stack',
  },
};

type PostTypeKey = keyof typeof postTypes;

type PortfolioItem = {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  category: string;
  technologies: string[];
  status: 'Completed' | 'In Progress' | 'Planning';
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  active: boolean;
  createdAt: string;
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    image: '',
    category: '',
    postType: 'web' as PostTypeKey,
    technologies: '',
    status: 'Completed' as 'Completed' | 'In Progress' | 'Planning',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    order: 0,
    active: true,
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/admin/portfolio${query}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
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
      title: '',
      description: '',
      longDescription: '',
      image: '',
      category: postTypes.web.category,
      postType: 'web',
      technologies: '',
      status: 'Completed',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      order: 0,
      active: true,
    });
    setShowForm(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditing(item);
    const matchedType = (Object.entries(postTypes).find(([, cfg]) => cfg.category === item.category)?.[0] ||
      'other') as PostTypeKey;

    setForm({
      title: item.title,
      description: item.description,
      longDescription: item.longDescription || '',
      image: item.image || '',
      category: item.category,
      postType: matchedType,
      technologies: item.technologies.join(', '),
      status: item.status,
      liveUrl: item.liveUrl || '',
      githubUrl: item.githubUrl || '',
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
    const typeConfig = postTypes[form.postType];
    try {
      const payload = {
        title: form.title,
        description: form.description,
        longDescription: form.longDescription || undefined,
        image: form.image || undefined,
        category: typeConfig.category,
        technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
        status: form.status,
        liveUrl: form.liveUrl || undefined,
        githubUrl: form.githubUrl || undefined,
        featured: form.featured,
        order: Number(form.order) || 0,
        active: form.active,
      };
      const res = await fetch(editing ? `/api/admin/portfolio/${editing._id}` : '/api/admin/portfolio', {
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
    if (!confirm('Delete this portfolio item?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSuccess('Deleted successfully!');
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">Portfolio Manager</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your projects and showcase your work</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Project
        </button>
      </div>

      {/* Status Messages */}
      {error && <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-sm text-red-200 backdrop-blur-sm">{error}</div>}
      {success && <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-sm text-green-200 backdrop-blur-sm">{success}</div>}

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Portfolio Grid */}
      {loading && items.length === 0 && (
        <div className="text-center py-12 text-gray-400">Loading projects...</div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-gray-900/60 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <PhotoIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No projects yet. Create your first one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item._id}
            className={`rounded-2xl border ${
              item.featured ? 'border-blue-500/40 bg-blue-500/5' : 'border-gray-700'
            } bg-gray-900/60 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-shadow`}
          >
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-[#0a0e27] via-gray-900 to-[#0a0e27] flex items-center justify-center relative">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-90" />
              ) : (
                <PhotoIcon className="h-16 w-16 text-gray-600" />
              )}
              {item.featured && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded text-xs font-semibold shadow">
                  Featured
                </div>
              )}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${
                item.status === 'Completed' ? 'bg-green-500/30 text-green-100 border border-green-500/30' :
                item.status === 'In Progress' ? 'bg-blue-500/30 text-blue-100 border border-blue-500/30' :
                'bg-yellow-500/30 text-yellow-100 border border-yellow-500/30'
              }`}>
                {item.status}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                </div>
                {!item.active && (
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300 border border-gray-600">Inactive</span>
                )}
              </div>

              <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.description}</p>

              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-200 border border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-200 border border-gray-700">
                      +{item.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-2">
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 transition-colors"
                      title="View Live"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </a>
                  )}
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
                      title="View Code"
                    >
                      <CodeBracketIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setEditing(null); setShowForm(false); }}>
          <div className="bg-gray-900 w-full max-w-3xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-6">{editing ? 'Edit Project' : 'New Project'}</h2>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Choose a project type</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(postTypes) as PostTypeKey[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        postType: type,
                        category: postTypes[type].category,
                        description: editing ? prev.description : '',
                        longDescription: editing ? prev.longDescription : '',
                        technologies: editing ? prev.technologies : '',
                      }))
                    }
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      form.postType === type
                        ? 'border-blue-500 bg-blue-500/20 text-blue-200 shadow-blue-500/20 shadow'
                        : 'border-gray-700 text-gray-300 hover:border-gray-600 bg-gray-800/60'
                    }`}
                  >
                    {postTypes[type].label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Fields adjust based on the selected type. Graphics emphasize deliverables/tools; apps focus on stack and deployment.
            </p>
            <form onSubmit={save} className="space-y-4">
              {form.postType === 'graphics' && (
                <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800/60 p-4 text-xs text-gray-300">
                  Tip: Include file formats (PNG, PDF, SVG) and tools (Figma, Illustrator). Use description to explain the brief.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order (display order)</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {form.postType === 'graphics' ? 'Project Story *' : 'Description *'}
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder={postTypes[form.postType].descriptionPlaceholder}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {postTypes[form.postType].longLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={form.longDescription}
                    onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder={
                      form.postType === 'graphics'
                        ? 'Explain the brief, concept, and visual direction...'
                        : 'Outline the process, challenges, and impact...'
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {postTypes[form.postType].techLabel}
                  </label>
                  <input
                    type="text"
                    value={form.technologies}
                    onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder={postTypes[form.postType].techPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    />
                    Featured (shown on homepage)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    />
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setEditing(null); setShowForm(false); }}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                  {loading ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

