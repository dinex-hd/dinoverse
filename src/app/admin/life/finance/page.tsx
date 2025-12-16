'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  PlusIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

type Transaction = {
  _id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  source?: string;
  amount: number;
  note?: string;
  tags?: string[];
  isInvestmentInSelf?: boolean;
};

const emptyTx: Omit<Transaction, '_id'> = {
  date: new Date().toISOString().slice(0, 10),
  type: 'income',
  category: '',
  source: '',
  amount: 0,
  note: '',
  tags: [],
  isInvestmentInSelf: false,
};

export default function FinancePage() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [items, setItems] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<{ totalIncome: number; totalExpense: number; net: number; byCategory: Record<string, number> }>({
    totalIncome: 0,
    totalExpense: 0,
    net: 0,
    byCategory: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState<Omit<Transaction, '_id'>>(emptyTx);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('month', month);
      params.set('year', year);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await fetch(`/api/admin/life/transactions?${params.toString()}`, { cache: 'no-store' });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Failed to load transactions');
      setItems(json.items || []);
      setSummary(json.summary || { totalIncome: 0, totalExpense: 0, net: 0, byCategory: {} });
    } catch (e: any) {
      setError(e?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, typeFilter, categoryFilter]);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyTx, date: new Date().toISOString().slice(0, 10) });
    setShowForm(true);
  }

  function openEdit(item: Transaction) {
    setEditing(item);
    setForm({
      ...emptyTx,
      ...item,
      date: item.date?.slice(0, 10),
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
        ...form,
        amount: Number(form.amount),
        date: form.date,
        tags: form.tags || [],
      };
      const url = editing ? `/api/admin/life/transactions/${editing._id}` : '/api/admin/life/transactions';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.message || 'Failed to save transaction');
      }
      setSuccess(editing ? 'Transaction updated' : 'Transaction added');
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this transaction?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/life/transactions/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to delete');
      setSuccess('Transaction deleted');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  }

  const monthLabel = useMemo(() => {
    const d = new Date(Number(year), Number(month) - 1, 1);
    return format(d, 'MMMM yyyy');
  }, [month, year]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Income & Expenses
          </h1>
          <p className="mt-1 text-sm text-gray-400">Track cashflow, investments in yourself, and monthly net.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600"
        >
          <PlusIcon className="h-5 w-5" />
          Add Entry
        </button>
      </div>

      {error && <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-sm text-red-200">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-500/20 border border-green-500/30 text-sm text-green-200">{success}</div>}

      <div className="grid gap-4 md:grid-cols-4 items-end">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white"
          >
            {Array.from({ length: 12 }).map((_, idx) => {
              const value = String(idx + 1).padStart(2, '0');
              return (
                <option key={value} value={value}>
                  {format(new Date(2024, idx, 1), 'LLLL')}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Category</label>
          <input
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="trading, tools, personal..."
            className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/30 bg-gray-900/60 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
              <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-300">Total Income ({monthLabel})</p>
              <p className="text-2xl font-bold text-white">${summary.totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-500/30 bg-gray-900/60 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 border border-red-400/40">
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-red-300">Total Expenses ({monthLabel})</p>
              <p className="text-2xl font-bold text-white">${summary.totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-500/30 bg-gray-900/60 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40">
              <BanknotesIcon className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-cyan-300">Net</p>
              <p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                ${summary.net.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-900/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 text-sm text-gray-300">
          {loading ? 'Loading entries...' : `${items.length} entries`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-900/80 text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold">Date</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Type</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Category</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Source</th>
                <th className="px-3 py-2 text-right text-xs font-semibold">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Self‑Investment</th>
                <th className="px-3 py-2 text-left text-xs font-semibold">Note</th>
                <th className="px-3 py-2 text-right text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map((item) => {
                const d = item.date ? new Date(item.date) : null;
                return (
                  <tr key={item._id} className="hover:bg-gray-800/60">
                    <td className="px-3 py-2 text-xs text-gray-300 whitespace-nowrap">{d ? format(d, 'yyyy-MM-dd') : '-'}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.type === 'income'
                            ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-200 border border-red-500/40'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-200">{item.category}</td>
                    <td className="px-3 py-2 text-gray-300">{item.source}</td>
                    <td className="px-3 py-2 text-right font-semibold">{item.amount.toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs">
                      {item.isInvestmentInSelf ? (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-100 border border-cyan-500/40">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-300">{item.note}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-lg border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(item._id)}
                          className="p-2 rounded-lg border border-red-500/30 text-red-200 hover:bg-red-500/20 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No entries yet. Add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setEditing(null);
            setShowForm(false);
          }}
        >
          <div
            className="bg-gray-900 w-full max-w-3xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              {editing ? 'Edit Entry' : 'New Entry'}
            </h2>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.date?.toString().slice(0, 10)}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Category</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Source</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    placeholder="Client, salary, refund..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={!!form.isInvestmentInSelf}
                    onChange={(e) => setForm({ ...form, isInvestmentInSelf: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <span className="text-sm text-gray-300">Investment in self (education/tools)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Note</label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  placeholder="Context or reasoning for this expense/income"
                />
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
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                  {loading ? 'Saving...' : editing ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

