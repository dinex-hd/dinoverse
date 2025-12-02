'use client';

import { useEffect, useState } from 'react';

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
      homepage: 'bg-blue-100 text-blue-800',
      packages: 'bg-purple-100 text-purple-800',
      both: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${colors[section] || ''}`}>
        {section === 'homepage' ? '🏠 Homepage' : section === 'packages' ? '📦 Packages' : '🔄 Both'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#010333]">Services Manager</h1>
        <button onClick={openNew} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white text-sm font-medium hover:bg-[#1e35d8] transition-colors">+ New Service</button>
      </div>

      {/* Section Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Filter by section:</span>
        {(['all', 'homepage', 'packages', 'both', 'none'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedSection === section
                ? 'bg-[#2642fe] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section === 'all' ? '📋 All' : section === 'homepage' ? '🏠 Homepage' : section === 'packages' ? '📦 Packages' : section === 'both' ? '🔄 Both' : '🚫 None'}
          </button>
        ))}
      </div>

      {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

      {/* Services grouped by section */}
      {(selectedSection === 'all' || selectedSection === 'homepage') && servicesBySection.homepage.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-4 flex items-center gap-2">
            🏠 Homepage Services (Top 3 shown on homepage)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Price (ETB)</th>
                  <th className="px-4 py-3 text-left font-semibold">Active</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {servicesBySection.homepage.map((it) => (
                  <tr key={it._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#010333]">{it.title}{getSectionBadge(it.section)}</td>
                    <td className="px-4 py-3 text-gray-700">{it.category}</td>
                    <td className="px-4 py-3 text-gray-700">{it.priceETB.toLocaleString()}</td>
                    <td className="px-4 py-3">{it.active ? <span className="text-green-600">✓</span> : <span className="text-gray-400">✗</span>}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(it)} className="px-2 py-1 rounded border border-gray-200 text-sm hover:bg-gray-50">Edit</button>
                      <button onClick={() => remove(it._id)} className="px-2 py-1 rounded border border-red-200 text-sm text-red-600 hover:bg-red-50">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(selectedSection === 'all' || selectedSection === 'packages') && servicesBySection.packages.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-4 flex items-center gap-2">
            📦 Popular Packages (Shown in packages section)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Price (ETB)</th>
                  <th className="px-4 py-3 text-left font-semibold">Active</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {servicesBySection.packages.map((it) => (
                  <tr key={it._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#010333]">{it.title}{getSectionBadge(it.section)}</td>
                    <td className="px-4 py-3 text-gray-700">{it.category}</td>
                    <td className="px-4 py-3 text-gray-700">{it.priceETB.toLocaleString()}</td>
                    <td className="px-4 py-3">{it.active ? <span className="text-green-600">✓</span> : <span className="text-gray-400">✗</span>}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(it)} className="px-2 py-1 rounded border border-gray-200 text-sm hover:bg-gray-50">Edit</button>
                      <button onClick={() => remove(it._id)} className="px-2 py-1 rounded border border-red-200 text-sm text-red-600 hover:bg-red-50">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(selectedSection === 'all' || selectedSection === 'none') && servicesBySection.none.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-4 flex items-center gap-2">
            🚫 Other Services (Not shown on homepage)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Price (ETB)</th>
                  <th className="px-4 py-3 text-left font-semibold">Active</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {servicesBySection.none.map((it) => (
                  <tr key={it._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#010333]">{it.title}</td>
                    <td className="px-4 py-3 text-gray-700">{it.category}</td>
                    <td className="px-4 py-3 text-gray-700">{it.priceETB.toLocaleString()}</td>
                    <td className="px-4 py-3">{it.active ? <span className="text-green-600">✓</span> : <span className="text-gray-400">✗</span>}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(it)} className="px-2 py-1 rounded border border-gray-200 text-sm hover:bg-gray-50">Edit</button>
                      <button onClick={() => remove(it._id)} className="px-2 py-1 rounded border border-red-200 text-sm text-red-600 hover:bg-red-50">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && !loading && selectedSection !== 'all' && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No services found in this section.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Loading services...</p>
        </div>
      )}

      {/* Drawer / Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => { setEditing(null); setShowForm(false); }}>
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#010333] mb-6">{editing ? 'Edit Service' : 'New Service'}</h2>
            <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="col-span-2 px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <input className="px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400" placeholder="Category (e.g., web, mobile, design)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                <select className="px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  <option value="web">Web (Code)</option>
                  <option value="mobile">Mobile</option>
                  <option value="design">Design</option>
                  <option value="analytics">Analytics</option>
                  <option value="trading">Trading/Finance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Section Selector - Big and Prominent */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-[#010333] mb-2">📍 Display Section (Where to show this service)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, section: 'homepage' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      form.section === 'homepage'
                        ? 'border-[#2642fe] bg-blue-50 text-[#2642fe]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
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
                        ? 'border-[#2642fe] bg-purple-50 text-[#2642fe]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
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
                        ? 'border-[#2642fe] bg-green-50 text-[#2642fe]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
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
                        ? 'border-[#2642fe] bg-gray-50 text-[#2642fe]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🚫 None
                    <div className="text-xs mt-1 opacity-75">Hidden</div>
                  </button>
                </div>
              </div>

              <input type="number" className="px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400" placeholder="Price ETB" value={form.priceETB} onChange={(e) => setForm({ ...form, priceETB: Number(e.target.value) })} required />
              <input className="px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400" placeholder="Badge (optional, e.g., Popular, Most Popular)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
              <textarea className="col-span-2 px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <input className="col-span-2 px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333] placeholder:text-gray-400" placeholder="Features (comma separated, e.g., Feature 1, Feature 2, Feature 3)" value={typeof form.features === 'string' ? form.features : ''} onChange={(e) => setForm({ ...form, features: e.target.value })} />
              <div className="col-span-2 flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  Active (Visible on website)
                </label>
                <div className="space-x-2">
                  <button type="button" onClick={() => { setEditing(null); setShowForm(false); }} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] transition-colors">Save Service</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


