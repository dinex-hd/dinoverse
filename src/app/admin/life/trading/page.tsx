'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PlusIcon, PencilIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';

type Trade = {
  _id: string;
  date: string;
  instrument: string;
  direction: 'long' | 'short';
  session?: string;
  entry: number;
  stop: number;
  takeProfit?: number;
  size: number;
  riskPerTrade?: number;
  resultR?: number;
  resultPct?: number;
  pnl?: number;
  setupTag?: string;
  beforeNote?: string;
  afterNote?: string;
  ruleChecks?: {
    followedPlan?: boolean;
    respectedDailyLoss?: boolean;
    validSession?: boolean;
    emotional?: boolean;
  };
  screenshots?: string[];
  status?: 'open' | 'closed' | 'breakeven';
};

const emptyForm: Omit<Trade, '_id'> = {
  date: new Date().toISOString(),
  instrument: '',
  direction: 'long',
  session: '',
  entry: 0,
  stop: 0,
  takeProfit: undefined,
  size: 0,
  riskPerTrade: undefined,
  resultR: undefined,
  resultPct: undefined,
  pnl: undefined,
  setupTag: '',
  beforeNote: '',
  afterNote: '',
  ruleChecks: {
    followedPlan: true,
    respectedDailyLoss: true,
    validSession: true,
    emotional: false,
  },
  screenshots: [],
  status: 'closed',
};

type Stats = {
  totalTrades: number;
  totalClosed: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgR: number;
  ruleComplianceRate: number;
  winRateWhenRulesRespected: number;
  daysWithoutRuleBreak: number;
  tradesThisWeek: number;
  rulesBrokenThisWeek: number;
  totalPnL: number;
};

export default function TradingJournalPage() {
  const [items, setItems] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [form, setForm] = useState<Omit<Trade, '_id'>>(emptyForm);
  const [filterInstrument, setFilterInstrument] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [onlyBroken, setOnlyBroken] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterInstrument) params.set('instrument', filterInstrument);
      if (filterFrom) params.set('from', filterFrom);
      if (filterTo) params.set('to', filterTo);
      const res = await fetch(`/api/admin/life/trades?${params.toString()}`, { cache: 'no-store' });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Failed to load trades');
      let list: Trade[] = (json.items || []).map((t: any) => ({
        ...t,
        date: t.date,
      }));
      if (onlyBroken) {
        list = list.filter(
          (t) =>
            t.ruleChecks &&
            (t.ruleChecks.followedPlan === false ||
              t.ruleChecks.respectedDailyLoss === false ||
              t.ruleChecks.validSession === false ||
              t.ruleChecks.emotional === true)
        );
      }
      setItems(list);
    } catch (e: any) {
      setError(e?.message || 'Failed to load trades');
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const params = new URLSearchParams();
      if (filterFrom) params.set('from', filterFrom);
      if (filterTo) params.set('to', filterTo);
      const res = await fetch(`/api/admin/life/trades/stats?${params.toString()}`, { cache: 'no-store' });
      if (res.status === 401) {
        return;
      }
      const json = await res.json();
      if (json.ok && json.stats) {
        setStats(json.stats);
      }
    } catch (e) {
      // Silent fail for stats
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterInstrument, filterFrom, filterTo, onlyBroken]);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFrom, filterTo]);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setShowForm(true);
  }

  function openEdit(item: Trade) {
    setEditing(item);
    setForm({
      ...emptyForm,
      ...item,
      date: item.date ? item.date.substring(0, 10) : new Date().toISOString().slice(0, 10),
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
        date: form.date,
        entry: Number(form.entry),
        stop: Number(form.stop),
        takeProfit: form.takeProfit != null && form.takeProfit !== ('' as any) ? Number(form.takeProfit) : undefined,
        size: Number(form.size),
        riskPerTrade: form.riskPerTrade != null ? Number(form.riskPerTrade) : undefined,
        resultR: form.resultR != null ? Number(form.resultR) : undefined,
        resultPct: form.resultPct != null ? Number(form.resultPct) : undefined,
        pnl: form.pnl != null ? Number(form.pnl) : undefined,
        session: form.session || '',
        setupTag: form.setupTag || '',
        beforeNote: form.beforeNote || '',
        afterNote: form.afterNote || '',
        ruleChecks: {
          followedPlan: !!form.ruleChecks?.followedPlan,
          respectedDailyLoss: !!form.ruleChecks?.respectedDailyLoss,
          validSession: !!form.ruleChecks?.validSession,
          emotional: !!form.ruleChecks?.emotional,
        },
      };

      const url = editing ? `/api/admin/life/trades/${editing._id}` : '/api/admin/life/trades';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.message || 'Failed to save trade');
      }
      setSuccess(editing ? 'Trade updated' : 'Trade added');
      setShowForm(false);
      setEditing(null);
      await load();
      await loadStats();
    } catch (e: any) {
      setError(e?.message || 'Failed to save trade');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this trade?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/life/trades/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.message || 'Failed to delete trade');
      }
      setSuccess('Trade deleted');
      await load();
      await loadStats();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete trade');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Trading Journal
          </h1>
          <p className="mt-1 text-sm text-gray-400">Log every trade and track your discipline and performance.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600"
        >
          <PlusIcon className="h-5 w-5" />
          New Trade
        </button>
      </div>

      {error && <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-sm text-red-200">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-500/20 border border-green-500/30 text-sm text-green-200">{success}</div>}

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-blue-500/30 bg-gray-900/60 p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Win Rate</p>
            <p className="text-lg font-bold text-white">{stats.winRate}%</p>
            <p className="text-xs text-gray-500">{stats.winningTrades}W / {stats.losingTrades}L</p>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-gray-900/60 p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Avg R</p>
            <p className={`text-lg font-bold ${stats.avgR >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {stats.avgR >= 0 ? '+' : ''}{stats.avgR.toFixed(2)}R
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-gray-900/60 p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Rule Compliance</p>
            <p className="text-lg font-bold text-white">{stats.ruleComplianceRate}%</p>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-gray-900/60 p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Win Rate (Rules)</p>
            <p className="text-lg font-bold text-white">{stats.winRateWhenRulesRespected}%</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-gray-900/60 p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Days Clean</p>
            <p className="text-lg font-bold text-white">{stats.daysWithoutRuleBreak}</p>
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-gray-900/60 p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Total P&L</p>
            <p className={`text-lg font-bold ${stats.totalPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Instrument</label>
          <input
            value={filterInstrument}
            onChange={(e) => setFilterInstrument(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white placeholder:text-gray-500"
            placeholder="e.g. BTCUSDT"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">From</label>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">To</label>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={onlyBroken}
            onChange={(e) => setOnlyBroken(e.target.checked)}
            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <span className="inline-flex items-center gap-1">
            <FunnelIcon className="h-4 w-4" />
            Only broken rules
          </span>
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-700 bg-gray-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900/80 text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold">Date</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Instrument</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Side</th>
              <th className="px-3 py-2 text-right text-xs font-semibold">Entry</th>
              <th className="px-3 py-2 text-right text-xs font-semibold">Stop</th>
              <th className="px-3 py-2 text-right text-xs font-semibold">Size</th>
              <th className="px-3 py-2 text-right text-xs font-semibold">R</th>
              <th className="px-3 py-2 text-right text-xs font-semibold">P&L</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Setup</th>
              <th className="px-3 py-2 text-left text-xs font-semibold">Rules</th>
              <th className="px-3 py-2 text-right text-xs font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((item) => {
              const d = item.date ? new Date(item.date) : null;
              const broken =
                item.ruleChecks &&
                (item.ruleChecks.followedPlan === false ||
                  item.ruleChecks.respectedDailyLoss === false ||
                  item.ruleChecks.validSession === false ||
                  item.ruleChecks.emotional === true);
              return (
                <tr key={item._id} className="hover:bg-gray-800/60">
                  <td className="px-3 py-2 text-xs text-gray-300 whitespace-nowrap">
                    {d ? format(d, 'yyyy-MM-dd') : '-'}
                  </td>
                  <td className="px-3 py-2 font-medium">{item.instrument}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.direction === 'long'
                          ? 'bg-green-500/20 text-green-200 border border-green-500/40'
                          : 'bg-red-500/20 text-red-200 border border-red-500/40'
                      }`}
                    >
                      {item.direction === 'long' ? 'Long' : 'Short'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-200">{item.entry?.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-gray-200">{item.stop?.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-gray-200">{item.size}</td>
                  <td className="px-3 py-2 text-right">
                    {item.resultR != null && (
                      <span className={item.resultR >= 0 ? 'text-green-300' : 'text-red-300'}>
                        {item.resultR.toFixed(2)} R
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {item.resultPct != null && (
                      <span className={item.resultPct >= 0 ? 'text-green-300' : 'text-red-300'}>
                        {item.resultPct.toFixed(2)}%
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-300">{item.setupTag}</td>
                  <td className="px-3 py-2 text-xs">
                    {item.ruleChecks && (
                      <div className="flex flex-col gap-1">
                        <span className={item.ruleChecks.followedPlan ? 'text-green-300' : 'text-red-300'}>
                          Plan: {item.ruleChecks.followedPlan ? '✓' : '✗'}
                        </span>
                        <span className={item.ruleChecks.respectedDailyLoss ? 'text-green-300' : 'text-red-300'}>
                          Risk: {item.ruleChecks.respectedDailyLoss ? '✓' : '✗'}
                        </span>
                        <span className={item.ruleChecks.validSession ? 'text-green-300' : 'text-red-300'}>
                          Session: {item.ruleChecks.validSession ? '✓' : '✗'}
                        </span>
                        <span className={item.ruleChecks.emotional ? 'text-red-300' : 'text-gray-400'}>
                          Emotion: {item.ruleChecks.emotional ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                  </td>
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
                <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                  No trades yet. Start by adding your first trade.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                  Loading trades...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p​​-4"
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
              {editing ? 'Edit Trade' : 'New Trade'}
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
                  <label className="block text-sm text-gray-300 mb-1">Instrument</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.instrument}
                    onChange={(e) => setForm({ ...form, instrument: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Side</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.direction}
                    onChange={(e) => setForm({ ...form, direction: e.target.value as 'long' | 'short' })}
                  >
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Entry</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.entry}
                    onChange={(e) => setForm({ ...form, entry: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Stop</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.stop}
                    onChange={(e) => setForm({ ...form, stop: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Size</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Take Profit</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={form.takeProfit ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, takeProfit: e.target.value === '' ? undefined : Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Result (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.resultR ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, resultR: e.target.value === '' ? undefined : Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Result %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.resultPct ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, resultPct: e.target.value === '' ? undefined : Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Session</label>
                  <input
                    value={form.session}
                    onChange={(e) => setForm({ ...form, session: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    placeholder="London / NY / Asia"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Setup</label>
                  <input
                    value={form.setupTag}
                    onChange={(e) => setForm({ ...form, setupTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    placeholder="Breakout, S/R, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Before trade (plan)</label>
                  <textarea
                    rows={3}
                    value={form.beforeNote}
                    onChange={(e) => setForm({ ...form, beforeNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    placeholder="Why are you taking this trade? Context, levels, invalidation..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">After trade (review)</label>
                  <textarea
                    rows={3}
                    value={form.afterNote}
                    onChange={(e) => setForm({ ...form, afterNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    placeholder="What went well? What to improve? Emotions?"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Rule checks</p>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={!!form.ruleChecks?.followedPlan}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          ruleChecks: { ...form.ruleChecks, followedPlan: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    Followed plan
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={!!form.ruleChecks?.respectedDailyLoss}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          ruleChecks: { ...form.ruleChecks, respectedDailyLoss: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    Respected daily loss
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={!!form.ruleChecks?.validSession}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          ruleChecks: { ...form.ruleChecks, validSession: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    Valid session/time
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={!!form.ruleChecks?.emotional}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          ruleChecks: { ...form.ruleChecks, emotional: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                    Emotional / FOMO
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as 'open' | 'closed' | 'breakeven' })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="breakeven">Breakeven</option>
                  </select>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                  {loading ? 'Saving...' : editing ? 'Update Trade' : 'Create Trade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


