'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

type Rule = {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  reason?: string;
  active?: boolean;
  order?: number;
};

type Reflection = {
  _id: string;
  date: string;
  summary?: string;
  wins?: string[];
  misses?: string[];
  planNextWeek?: string;
  brokenRules?: string[];
  tags?: string[];
};

const emptyRule: Omit<Rule, '_id'> = {
  title: '',
  category: 'trading',
  description: '',
  reason: '',
  active: true,
  order: 0,
};

const emptyReflection: Omit<Reflection, '_id'> = {
  date: new Date().toISOString().slice(0, 10),
  summary: '',
  wins: [],
  misses: [],
  planNextWeek: '',
  brokenRules: [],
  tags: [],
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [ruleForm, setRuleForm] = useState<Omit<Rule, '_id'>>(emptyRule);
  const [reflectionForm, setReflectionForm] = useState<Omit<Reflection, '_id'>>(emptyReflection);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [rulesRes, reflectionsRes] = await Promise.all([
        fetch('/api/admin/life/rules', { cache: 'no-store' }),
        fetch('/api/admin/life/reflections', { cache: 'no-store' }),
      ]);
      if (rulesRes.status === 401 || reflectionsRes.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const [rulesJson, reflectionsJson] = await Promise.all([rulesRes.json(), reflectionsRes.json()]);
      if (!rulesJson.ok || !reflectionsJson.ok) throw new Error(rulesJson.message || reflectionsJson.message || 'Failed to load');
      setRules(rulesJson.items || []);
      setReflections(reflectionsJson.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNewRule() {
    setEditingRule(null);
    setRuleForm(emptyRule);
    setShowRuleForm(true);
  }

  function openEditRule(rule: Rule) {
    setEditingRule(rule);
    setRuleForm({
      title: rule.title,
      category: rule.category || 'trading',
      description: rule.description || '',
      reason: rule.reason || '',
      active: rule.active ?? true,
      order: rule.order || 0,
    });
    setShowRuleForm(true);
  }

  async function saveRule(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = editingRule ? `/api/admin/life/rules/${editingRule._id}` : '/api/admin/life/rules';
      const method = editingRule ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleForm),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to save rule');
      setSuccess(editingRule ? 'Rule updated' : 'Rule created');
      setShowRuleForm(false);
      setEditingRule(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save rule');
    } finally {
      setLoading(false);
    }
  }

  async function deleteRule(id: string) {
    if (!confirm('Delete this rule?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/life/rules/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to delete rule');
      setSuccess('Rule deleted');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete rule');
    } finally {
      setLoading(false);
    }
  }

  async function toggleRule(rule: Rule, active: boolean) {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/life/rules/${rule._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to update rule');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to update rule');
    } finally {
      setLoading(false);
    }
  }

  async function saveReflection(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...reflectionForm,
        wins: (reflectionForm.wins || []).filter(Boolean),
        misses: (reflectionForm.misses || []).filter(Boolean),
        tags: (reflectionForm.tags || []).filter(Boolean),
      };
      const res = await fetch('/api/admin/life/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to save reflection');
      setSuccess('Reflection saved');
      setReflectionForm({ ...emptyReflection, date: new Date().toISOString().slice(0, 10) });
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save reflection');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Rules & Reflections
          </h1>
          <p className="mt-1 text-sm text-gray-400">Discipline rulebook plus weekly reviews.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openNewRule}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600"
          >
            <PlusIcon className="h-5 w-5" />
            New Rule
          </button>
        </div>
      </div>

      {error && <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-sm text-red-200">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-500/20 border border-green-500/30 text-sm text-green-200">{success}</div>}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-700 bg-gray-900/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-cyan-300" />
            <h2 className="text-lg font-semibold text-white">Rulebook</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {rules.map((rule) => (
              <div key={rule._id} className="rounded-xl border border-gray-800 bg-gray-800/50 p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{rule.title}</p>
                    <p className="text-xs text-gray-400">{rule.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-200 border border-indigo-500/30">
                        {rule.category || 'general'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-200 border border-gray-600/60">
                        Order {rule.order ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditRule(rule)}
                      className="p-2 rounded-lg border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 transition-colors"
                      title="Edit rule"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteRule(rule._id)}
                      className="p-2 rounded-lg border border-red-500/30 text-red-200 hover:bg-red-500/20 transition-colors"
                      title="Delete rule"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div>Reason: {rule.reason || '—'}</div>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={rule.active !== false}
                      onChange={(e) => toggleRule(rule, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    Active
                  </label>
                </div>
              </div>
            ))}
            {rules.length === 0 && !loading && <div className="text-sm text-gray-400">No rules yet. Add your first.</div>}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-emerald-300" />
            <h2 className="text-lg font-semibold text-white">Weekly Reflection</h2>
          </div>
          <form onSubmit={saveReflection} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Week ending</label>
              <input
                type="date"
                value={reflectionForm.date?.toString().slice(0, 10)}
                onChange={(e) => setReflectionForm({ ...reflectionForm, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Summary</label>
              <textarea
                rows={3}
                value={reflectionForm.summary}
                onChange={(e) => setReflectionForm({ ...reflectionForm, summary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                placeholder="What did you learn? Emotional notes? Big picture."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Wins (one per line)</label>
                <textarea
                  rows={3}
                  value={(reflectionForm.wins || []).join('\n')}
                  onChange={(e) => setReflectionForm({ ...reflectionForm, wins: e.target.value.split('\n') })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Misses (one per line)</label>
                <textarea
                  rows={3}
                  value={(reflectionForm.misses || []).join('\n')}
                  onChange={(e) => setReflectionForm({ ...reflectionForm, misses: e.target.value.split('\n') })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Plan for next week</label>
              <textarea
                rows={3}
                value={reflectionForm.planNextWeek}
                onChange={(e) => setReflectionForm({ ...reflectionForm, planNextWeek: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Broken rules</label>
              <select
                multiple
                value={reflectionForm.brokenRules}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions).map((o) => o.value);
                  setReflectionForm({ ...reflectionForm, brokenRules: values });
                }}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white h-28"
              >
                {rules.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Tags (comma separated)</label>
              <input
                value={(reflectionForm.tags || []).join(', ')}
                onChange={(e) => setReflectionForm({ ...reflectionForm, tags: e.target.value.split(',').map((t) => t.trim()) })}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
              >
                {loading ? 'Saving...' : 'Save Reflection'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold text-white">Reflection Log</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {reflections.map((ref) => (
            <div key={ref._id} className="rounded-xl border border-gray-800 bg-gray-800/50 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{ref.date ? format(new Date(ref.date), 'yyyy-MM-dd') : ''}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-200 border border-gray-600/60">
                  {(ref.tags || []).join(', ')}
                </span>
              </div>
              <p className="text-sm text-gray-100">{ref.summary}</p>
              <div className="text-xs text-emerald-200">
                <strong>Wins:</strong> {(ref.wins || []).join(', ')}
              </div>
              <div className="text-xs text-red-200">
                <strong>Misses:</strong> {(ref.misses || []).join(', ')}
              </div>
              <div className="text-xs text-gray-200">
                <strong>Next:</strong> {ref.planNextWeek}
              </div>
            </div>
          ))}
          {reflections.length === 0 && !loading && <div className="text-sm text-gray-400">No reflections yet.</div>}
        </div>
      </div>

      {/* Rule modal */}
      {showRuleForm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setEditingRule(null);
            setShowRuleForm(false);
          }}
        >
          <div
            className="bg-gray-900 w-full max-w-3xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              {editingRule ? 'Edit Rule' : 'New Rule'}
            </h2>
            <form onSubmit={saveRule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Title</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={ruleForm.title}
                    onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Category</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={ruleForm.category}
                    onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Order</label>
                  <input
                    type="number"
                    value={ruleForm.order}
                    onChange={(e) => setRuleForm({ ...ruleForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={ruleForm.active}
                    onChange={(e) => setRuleForm({ ...ruleForm, active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  placeholder="What is this rule?"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Reason</label>
                <textarea
                  rows={2}
                  value={ruleForm.reason}
                  onChange={(e) => setRuleForm({ ...ruleForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  placeholder="Why does this rule matter?"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRule(null);
                    setShowRuleForm(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                  {loading ? 'Saving...' : editingRule ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

