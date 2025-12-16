'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BanknotesIcon,
  RectangleStackIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek } from 'date-fns';

type Summary = {
  income: number;
  expense: number;
  net: number;
};

export default function LifeOsOverviewPage() {
  const today = useMemo(() => new Date(), []);
  const [quote, setQuote] = useState<string>('Discipline is doing what needs to be done, even when you don’t feel like it.');
  const [consistency, setConsistency] = useState<number>(0);
  const [finance, setFinance] = useState<Summary>({ income: 0, expense: 0, net: 0 });
  const [tradesCount, setTradesCount] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear());
        const [quoteRes, habitsRes, financeRes, tradesRes] = await Promise.all([
          fetch('/api/admin/life/quotes?random=1&active=1', { cache: 'no-store' }),
          fetch(
            `/api/admin/life/habits/logs?from=${startOfWeek(today, { weekStartsOn: 1 }).toISOString().slice(0, 10)}&to=${endOfWeek(today, { weekStartsOn: 1 }).toISOString().slice(0, 10)}`,
            { cache: 'no-store' }
          ),
          fetch(`/api/admin/life/transactions?month=${month}&year=${year}`, { cache: 'no-store' }),
          fetch('/api/admin/life/trades', { cache: 'no-store' }),
        ]);

        if (quoteRes.status === 401 || habitsRes.status === 401 || financeRes.status === 401 || tradesRes.status === 401) {
          window.location.href = '/admin/login';
          return;
        }

        const [quoteJson, habitsJson, financeJson, tradesJson] = await Promise.all([
          quoteRes.json(),
          habitsRes.json(),
          financeRes.json(),
          tradesRes.json(),
        ]);

        if (quoteJson?.item?.text) setQuote(quoteJson.item.text);
        setConsistency(habitsJson?.summary?.consistencyPercent ?? 0);
        setFinance({
          income: financeJson?.summary?.totalIncome || 0,
          expense: financeJson?.summary?.totalExpense || 0,
          net: financeJson?.summary?.net || 0,
        });
        setTradesCount((tradesJson?.items || []).length);
      } catch (e) {
        // keep silent on dashboard
      }
    }

    fetchData();
  }, [today]);

  const cards = [
    {
      title: 'Trading Journal',
      description: 'Log every trade from entry to exit with notes and rule checks.',
      href: '/admin/life/trading',
      icon: RectangleStackIcon,
      accent: 'from-blue-500 to-cyan-500',
      metric: tradesCount ? `${tradesCount} trades` : undefined,
    },
    {
      title: 'Income & Expenses',
      description: 'Cashflow, investments in yourself, and monthly net.',
      href: '/admin/life/finance',
      icon: BanknotesIcon,
      accent: 'from-emerald-500 to-cyan-500',
      metric: `$${finance.net.toFixed(2)} net`,
    },
    {
      title: 'Goals & Habits',
      description: 'Targets plus daily checklist and weekly consistency.',
      href: '/admin/life/goals',
      icon: CheckCircleIcon,
      accent: 'from-purple-500 to-pink-500',
      metric: `${consistency}% weekly consistency`,
    },
    {
      title: 'Rules & Reflections',
      description: 'Your personal rulebook and weekly reviews.',
      href: '/admin/life/rules',
      icon: ClipboardDocumentCheckIcon,
      accent: 'from-amber-500 to-red-500',
    },
    {
      title: 'Quotes',
      description: 'Discipline reminders and motivation library.',
      href: '/admin/life/quotes',
      icon: SparklesIcon,
      accent: 'from-cyan-500 to-indigo-500',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Life OS Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-400">Private cockpit for trading, money, consistency, and discipline.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-cyan-500/30 bg-gray-900/60 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-cyan-300 mb-1">Daily Motivation</p>
              <p className="text-sm text-gray-100">{quote}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-gray-900/60 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
              <ChartBarIcon className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-300">Consistency</p>
              <p className="text-sm text-gray-100">{consistency}% this week (habits)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/30 bg-gray-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
              <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-300">Income this month</p>
              <p className="text-xl font-bold text-white">${finance.income.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-500/30 bg-gray-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 border border-red-400/40">
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-red-300">Expenses this month</p>
              <p className="text-xl font-bold text-white">${finance.expense.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-gray-700 bg-gray-900/60 p-4 backdrop-blur-sm hover:border-cyan-500/50 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.accent} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${card.accent} text-white/90`}>
                <span>{card.title}</span>
              </div>
              <p className="mt-2 text-sm text-gray-300">{card.description}</p>
              {card.metric && <p className="mt-2 text-xs text-cyan-200">{card.metric}</p>}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 flex items-center gap-3 text-sm text-blue-100">
        <CheckCircleIcon className="h-5 w-5 text-blue-300" />
        <p>
          This Life OS area is private for you only. Later we can connect parts of it (like win‑rate or lessons learned) into public blog
          posts or a journey page.
        </p>
      </div>
    </div>
  );
}
