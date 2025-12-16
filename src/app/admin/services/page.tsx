'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Service = {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  section?: 'homepage' | 'packages' | 'both' | 'none';
  priceETB: number;
  features: string[];
  badge?: string;
  active: boolean;
  createdAt: string;
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'all' | 'homepage' | 'packages' | 'both' | 'none'>('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'web',
    icon: 'web',
    section: 'none' as 'homepage' | 'packages' | 'both' | 'none',
    priceETB: 0,
    features: '' as string | string[],
    badge: '',
    active: true,
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/services');
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
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ title: '', description: '', category: 'web', icon: 'web', section: 'none', priceETB: 0, features: '', badge: '', active: true });
    setShowForm(true);
  }

  function openEdit(it: Service) {
    setEditing(it);
    setForm({
      title: it.title,
      description: it.description,
      category: it.category,
      icon: it.icon || 'web',
      section: it.section || 'none',
      priceETB: it.priceETB,
      features: it.features.join(', '),
      badge: it.badge || '',
      active: it.active,
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        icon: form.icon,
        section: form.section,
        priceETB: Number(form.priceETB),
        features: (typeof form.features === 'string' ? form.features : '').split(',').map((s) => s.trim()).filter(Boolean),
        badge: form.badge || undefined,
        active: form.active,
      };
      const res = await fetch(editing ? `/api/admin/services/${editing._id}` : '/api/admin/services', {
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
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this service?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  // Group services by section
  const servicesBySection = {
    homepage: items.filter(s => s.section === 'homepage' || s.section === 'both'),
    packages: items.filter(s => s.section === 'packages' || s.section === 'both'),
    both: items.filter(s => s.section === 'both'),
    none: items.filter(s => !s.section || s.section === 'none'),
  };

  const filteredItems = selectedSection === 'all' 
    ? items 
    : selectedSection === 'homepage' 
      ? servicesBySection.homepage
      : selectedSection === 'packages'
        ? servicesBySection.packages
        : selectedSection === 'both'
          ? servicesBySection.both
          : servicesBySection.none;

  const getSectionBadge = (section?: string) => {
    if (!section || section === 'none') return null;
    const colors: Record<string, string> = {
      homepage: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      packages: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      both: 'bg-green-500/20 text-green-300 border border-green-500/30',
    };
    return (
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${colors[section] || ''}`}>
        {section === 'homepage' ? '🏠 Homepage' : section === 'packages' ? '📦 Packages' : '🔄 Both'}
      </span>
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Services Manager
            </h1>
            <p className="mt-2 text-sm text-gray-400">Manage your services and packages</p>
          </motion.div>
          <motion.button
            onClick={openNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
          >
            <PlusIcon className="h-5 w-5" />
            New Service
          </motion.button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        {/* Section Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-sm font-medium text-gray-400">Filter by section:</span>
          {(['all', 'homepage', 'packages', 'both', 'none'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedSection === section
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              {section === 'all' ? '📋 All' : section === 'homepage' ? '🏠 Homepage' : section === 'packages' ? '📦 Packages' : section === 'both' ? '🔄 Both' : '🚫 None'}
            </button>
          ))}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-sm text-red-300 backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Services grouped by section */}
        {(selectedSection === 'all' || selectedSection === 'homepage') && servicesBySection.homepage.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">🏠</span>
              Homepage Services (Top 3 shown on homepage)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Price (ETB)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Active</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {servicesBySection.homepage.map((it) => (
                    <tr key={it._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{it.title}{getSectionBadge(it.section)}</td>
                      <td className="px-4 py-3 text-gray-300">{it.category}</td>
                      <td className="px-4 py-3 text-gray-300">{it.priceETB.toLocaleString()}</td>
                      <td className="px-4 py-3">{it.active ? <span className="text-green-400">✓</span> : <span className="text-gray-500">✗</span>}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button onClick={() => openEdit(it)} className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm hover:bg-blue-500/30 transition-colors inline-flex items-center gap-1">
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button onClick={() => remove(it._id)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-sm hover:bg-red-500/30 transition-colors inline-flex items-center gap-1">
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {(selectedSection === 'all' || selectedSection === 'packages') && servicesBySection.packages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">📦</span>
              Popular Packages (Shown in packages section)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Price (ETB)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Active</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {servicesBySection.packages.map((it) => (
                    <tr key={it._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{it.title}{getSectionBadge(it.section)}</td>
                      <td className="px-4 py-3 text-gray-300">{it.category}</td>
                      <td className="px-4 py-3 text-gray-300">{it.priceETB.toLocaleString()}</td>
                      <td className="px-4 py-3">{it.active ? <span className="text-green-400">✓</span> : <span className="text-gray-500">✗</span>}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button onClick={() => openEdit(it)} className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm hover:bg-blue-500/30 transition-colors inline-flex items-center gap-1">
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button onClick={() => remove(it._id)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-sm hover:bg-red-500/30 transition-colors inline-flex items-center gap-1">
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {(selectedSection === 'all' || selectedSection === 'none') && servicesBySection.none.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="p-2 rounded-lg bg-gray-600">🚫</span>
              Other Services (Not shown on homepage)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Price (ETB)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Active</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {servicesBySection.none.map((it) => (
                    <tr key={it._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{it.title}</td>
                      <td className="px-4 py-3 text-gray-300">{it.category}</td>
                      <td className="px-4 py-3 text-gray-300">{it.priceETB.toLocaleString()}</td>
                      <td className="px-4 py-3">{it.active ? <span className="text-green-400">✓</span> : <span className="text-gray-500">✗</span>}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button onClick={() => openEdit(it)} className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm hover:bg-blue-500/30 transition-colors inline-flex items-center gap-1">
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button onClick={() => remove(it._id)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-sm hover:bg-red-500/30 transition-colors inline-flex items-center gap-1">
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {filteredItems.length === 0 && !loading && selectedSection !== 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
          >
            <p className="text-gray-400">No services found in this section.</p>
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
          >
            <p className="text-gray-400">Loading services...</p>
          </motion.div>
        )}

        {/* Drawer / Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setEditing(null); setShowForm(false); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 w-full max-w-2xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  {editing ? 'Edit Service' : 'New Service'}
                </h2>
                <button
                  onClick={() => { setEditing(null); setShowForm(false); }}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="col-span-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4 col-span-2">
                  <input
                    className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Category (e.g., web, mobile, design)"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                  <select
                    className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  >
                    <option value="web" className="bg-gray-800">Web (Code)</option>
                    <option value="mobile" className="bg-gray-800">Mobile</option>
                    <option value="design" className="bg-gray-800">Design</option>
                    <option value="analytics" className="bg-gray-800">Analytics</option>
                    <option value="trading" className="bg-gray-800">Trading/Finance</option>
                    <option value="other" className="bg-gray-800">Other</option>
                  </select>
                </div>

                {/* Section Selector - Big and Prominent */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">📍 Display Section (Where to show this service)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, section: 'homepage' })}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        form.section === 'homepage'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      🏠 Homepage
                      <div className="text-xs mt-1 opacity-75">Top 3 cards</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, section: 'packages' })}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        form.section === 'packages'
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      📦 Packages
                      <div className="text-xs mt-1 opacity-75">Popular section</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, section: 'both' })}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        form.section === 'both'
                          ? 'border-green-500 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/20'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      🔄 Both
                      <div className="text-xs mt-1 opacity-75">Show everywhere</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, section: 'none' })}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        form.section === 'none'
                          ? 'border-gray-500 bg-gray-500/20 text-gray-300 shadow-lg'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      🚫 None
                      <div className="text-xs mt-1 opacity-75">Hidden</div>
                    </button>
                  </div>
                </div>

                <input
                  type="number"
                  className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Price ETB"
                  value={form.priceETB}
                  onChange={(e) => setForm({ ...form, priceETB: Number(e.target.value) })}
                  required
                />
                <input
                  className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Badge (optional, e.g., Popular, Most Popular)"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                />
                <textarea
                  className="col-span-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  rows={4}
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
                <input
                  className="col-span-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Features (comma separated, e.g., Feature 1, Feature 2, Feature 3)"
                  value={typeof form.features === 'string' ? form.features : ''}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                />
                <div className="col-span-2 flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    Active (Visible on website)
                  </label>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => { setEditing(null); setShowForm(false); }}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                    >
                      Save Service
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}


