'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, FlagIcon } from '@heroicons/react/24/outline';

type Goal = {
  _id: string;
  title: string;
  description?: string;
  due?: string;
  status?: 'active' | 'paused' | 'done';
  focusArea?: 'trading' | 'business' | 'health' | 'personal';
};

type Habit = {
  _id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  goal?: string;
  order?: number;
  active?: boolean;
};

type HabitLog = {
  _id: string;
  habit: string;
  date: string;
  status: 'done' | 'skipped' | 'missed';
};

const emptyGoal: Omit<Goal, '_id'> = {
  title: '',
  description: '',
  due: '',
  status: 'active',
  focusArea: 'trading',
};

const emptyHabit: Omit<Habit, '_id'> = {
  title: '',
  description: '',
  frequency: 'daily',
  goal: '',
  order: 0,
  active: true,
};

export default function GoalsHabitsPage() {
  const today = useMemo(() => new Date(), []);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [consistency, setConsistency] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [goalForm, setGoalForm] = useState<Omit<Goal, '_id'>>(emptyGoal);
  const [habitForm, setHabitForm] = useState<Omit<Habit, '_id'>>(emptyHabit);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [goalsRes, habitsRes] = await Promise.all([
        fetch('/api/admin/life/goals', { cache: 'no-store' }),
        fetch('/api/admin/life/habits', { cache: 'no-store' }),
      ]);
      if (goalsRes.status === 401 || habitsRes.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const [goalsJson, habitsJson] = await Promise.all([goalsRes.json(), habitsRes.json()]);
      if (!goalsJson.ok || !habitsJson.ok) throw new Error(goalsJson.message || habitsJson.message || 'Failed to load data');
      setGoals(goalsJson.items || []);
      setHabits(habitsJson.items || []);

      const from = startOfWeek(today, { weekStartsOn: 1 }).toISOString().slice(0, 10);
      const to = endOfWeek(today, { weekStartsOn: 1 }).toISOString().slice(0, 10);
      const logsRes = await fetch(`/api/admin/life/habits/logs?from=${from}&to=${to}`, { cache: 'no-store' });
      const logsJson = await logsRes.json();
      if (logsRes.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!logsJson.ok) throw new Error(logsJson.message || 'Failed to load logs');
      setLogs(logsJson.logs || []);
      setConsistency(logsJson.summary?.consistencyPercent ?? 0);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openNewGoal() {
    setEditingGoal(null);
    setGoalForm({ ...emptyGoal, due: '' });
    setShowGoalForm(true);
  }

  function openEditGoal(goal: Goal) {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description || '',
      due: goal.due ? goal.due.slice(0, 10) : '',
      status: goal.status || 'active',
      focusArea: goal.focusArea || 'trading',
    });
    setShowGoalForm(true);
  }

  async function saveGoal(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = editingGoal ? `/api/admin/life/goals/${editingGoal._id}` : '/api/admin/life/goals';
      const method = editingGoal ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalForm),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to save goal');
      setSuccess(editingGoal ? 'Goal updated' : 'Goal created');
      setShowGoalForm(false);
      setEditingGoal(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  }

  async function deleteGoal(id: string) {
    if (!confirm('Delete this goal?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/life/goals/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to delete goal');
      setSuccess('Goal deleted');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete goal');
    } finally {
      setLoading(false);
    }
  }

  function openNewHabit(goalId?: string) {
    setEditingHabit(null);
    setHabitForm({ ...emptyHabit, goal: goalId || '' });
    setShowHabitForm(true);
  }

  function openEditHabit(habit: Habit) {
    setEditingHabit(habit);
    setHabitForm({
      ...habit,
      goal: habit.goal || '',
      description: habit.description || '',
      order: habit.order || 0,
      active: habit.active ?? true,
    });
    setShowHabitForm(true);
  }

  async function saveHabit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = editingHabit ? `/api/admin/life/habits/${editingHabit._id}` : '/api/admin/life/habits';
      const method = editingHabit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitForm),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to save habit');
      setSuccess(editingHabit ? 'Habit updated' : 'Habit created');
      setShowHabitForm(false);
      setEditingHabit(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  }

  async function deleteHabit(id: string) {
    if (!confirm('Delete this habit?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/life/habits/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to delete habit');
      setSuccess('Habit deleted');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete habit');
    } finally {
      setLoading(false);
    }
  }

  async function toggleHabitToday(habitId: string, checked: boolean) {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        habit: habitId,
        date: today.toISOString().slice(0, 10),
        status: checked ? 'done' : 'missed',
      };
      const res = await fetch('/api/admin/life/habits/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to update habit');
      setSuccess('Habit updated for today');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to update habit');
    } finally {
      setLoading(false);
    }
  }

  const todayLog = useMemo(() => {
    const key = today.toISOString().slice(0, 10);
    const map = new Map<string, HabitLog>();
    logs.forEach((l) => {
      if (l.date?.slice(0, 10) === key) {
        map.set(l.habit, l);
      }
    });
    return map;
  }, [logs, today]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Goals & Habits
          </h1>
          <p className="mt-1 text-sm text-gray-400">Set high-level targets and track daily consistency.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openNewGoal}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600"
          >
            <PlusIcon className="h-5 w-5" />
            New Goal
          </button>
          <button
            onClick={() => openNewHabit()}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/10"
          >
            <PlusIcon className="h-5 w-5" />
            New Habit
          </button>
        </div>
      </div>

      {error && <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-sm text-red-200">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-500/20 border border-green-500/30 text-sm text-green-200">{success}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-500/30 bg-gray-900/60 p-4 shadow-lg backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wide text-cyan-300">Weekly Consistency</p>
          <p className="text-3xl font-bold mt-2 text-white">{consistency}%</p>
          <p className="text-sm text-gray-400">Done habits vs logged entries this week.</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-gray-900/60 p-4 shadow-lg backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wide text-emerald-300">Active Goals</p>
          <p className="text-3xl font-bold mt-2 text-white">{goals.filter((g) => g.status !== 'done').length}</p>
          <p className="text-sm text-gray-400">Keep them moving with daily habits.</p>
        </div>
        <div className="rounded-2xl border border-blue-500/30 bg-gray-900/60 p-4 shadow-lg backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wide text-blue-300">Habits</p>
          <p className="text-3xl font-bold mt-2 text-white">{habits.length}</p>
          <p className="text-sm text-gray-400">Daily/weekly routines that support goals.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Goals</p>
              <h2 className="text-xl font-semibold text-white">Targets</h2>
            </div>
          </div>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal._id} className="rounded-xl border border-gray-800 bg-gray-800/50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{goal.title}</p>
                    <p className="text-xs text-gray-400">{goal.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-200 border border-blue-500/30">
                        {goal.focusArea}
                      </span>
                      {goal.due && <span className="text-gray-400">Due {format(new Date(goal.due), 'yyyy-MM-dd')}</span>}
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[11px] ${
                          goal.status === 'done'
                            ? 'border-emerald-400/50 text-emerald-200 bg-emerald-500/10'
                            : goal.status === 'paused'
                              ? 'border-yellow-400/50 text-yellow-200 bg-yellow-500/10'
                              : 'border-cyan-400/50 text-cyan-200 bg-cyan-500/10'
                        }`}
                      >
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditGoal(goal)}
                      className="p-2 rounded-lg border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 transition-colors"
                      title="Edit goal"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal._id)}
                      className="p-2 rounded-lg border border-red-500/30 text-red-200 hover:bg-red-500/20 transition-colors"
                      title="Delete goal"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => openNewHabit(goal._id)}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-900/60 border border-gray-700 text-gray-200 hover:border-cyan-500/50"
                  >
                    <PlusIcon className="h-3 w-3" />
                    Add habit
                  </button>
                </div>
              </div>
            ))}
            {goals.length === 0 && !loading && (
              <div className="text-sm text-gray-400">No goals yet. Create your first target.</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Today</p>
              <h2 className="text-xl font-semibold text-white">Habit Checklist</h2>
              <p className="text-xs text-gray-400">{format(today, 'EEEE, MMM d')}</p>
            </div>
          </div>
          <div className="space-y-3">
            {habits
              .filter((h) => h.active !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((habit) => {
                const log = todayLog.get(habit._id);
                const checked = log?.status === 'done';
                return (
                  <label
                    key={habit._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{habit.title}</p>
                      <p className="text-xs text-gray-400">{habit.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggleHabitToday(habit._id, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </label>
                );
              })}
            {habits.length === 0 && <div className="text-sm text-gray-400">No habits yet. Add one to start tracking.</div>}
          </div>
        </div>
      </div>

      {/* Habits list */}
      <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold text-white">All Habits</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <div key={habit._id} className="rounded-xl border border-gray-800 bg-gray-800/50 p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{habit.title}</p>
                  <p className="text-xs text-gray-400">{habit.description}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditHabit(habit)}
                    className="p-2 rounded-lg border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 transition-colors"
                    title="Edit habit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="p-2 rounded-lg border border-red-500/30 text-red-200 hover:bg-red-500/20 transition-colors"
                    title="Delete habit"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-200 border border-indigo-500/30">
                  {habit.frequency}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full border ${
                    habit.active
                      ? 'border-emerald-400/50 text-emerald-200 bg-emerald-500/10'
                      : 'border-gray-500/50 text-gray-300 bg-gray-700/40'
                  }`}
                >
                  {habit.active ? 'active' : 'paused'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalForm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setEditingGoal(null);
            setShowGoalForm(false);
          }}
        >
          <div
            className="bg-gray-900 w-full max-w-3xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              {editingGoal ? 'Edit Goal' : 'New Goal'}
            </h2>
            <form onSubmit={saveGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Title</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Due date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={goalForm.due || ''}
                    onChange={(e) => setGoalForm({ ...goalForm, due: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Focus area</label>
                  <select
                    value={goalForm.focusArea}
                    onChange={(e) => setGoalForm({ ...goalForm, focusArea: e.target.value as Goal['focusArea'] })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  >
                    <option value="trading">Trading</option>
                    <option value="business">Business</option>
                    <option value="health">Health</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Status</label>
                  <select
                    value={goalForm.status}
                    onChange={(e) => setGoalForm({ ...goalForm, status: e.target.value as Goal['status'] })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  placeholder="Why is this goal important? What does success look like?"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingGoal(null);
                    setShowGoalForm(false);
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
                  {loading ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habit Modal */}
      {showHabitForm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setEditingHabit(null);
            setShowHabitForm(false);
          }}
        >
          <div
            className="bg-gray-900 w-full max-w-3xl rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              {editingHabit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <form onSubmit={saveHabit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Title</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                    value={habitForm.title}
                    onChange={(e) => setHabitForm({ ...habitForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Goal</label>
                  <select
                    value={habitForm.goal}
                    onChange={(e) => setHabitForm({ ...habitForm, goal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  >
                    <option value="">Unlinked</option>
                    {goals.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Frequency</label>
                  <select
                    value={habitForm.frequency}
                    onChange={(e) => setHabitForm({ ...habitForm, frequency: e.target.value as Habit['frequency'] })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Order</label>
                  <input
                    type="number"
                    value={habitForm.order}
                    onChange={(e) => setHabitForm({ ...habitForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={habitForm.active}
                    onChange={(e) => setHabitForm({ ...habitForm, active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={habitForm.description}
                  onChange={(e) => setHabitForm({ ...habitForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-white"
                  placeholder="What does this habit mean? How to measure done?"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingHabit(null);
                    setShowHabitForm(false);
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
                  {loading ? 'Saving...' : editingHabit ? 'Update Habit' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

