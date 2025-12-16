import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Transaction } from '@/models/Transaction';

const TransactionBodySchema = z.object({
  date: z.string().or(z.date()),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  source: z.string().optional(),
  amount: z.number(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isInvestmentInSelf: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const type = searchParams.get('type'); // income | expense
  const category = searchParams.get('category');

  const filter: any = {};
  if (type && ['income', 'expense'].includes(type)) {
    filter.type = type;
  }
  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }
  if (month || year) {
    const now = new Date();
    const y = year ? Number(year) : now.getFullYear();
    const m = month ? Number(month) - 1 : now.getMonth();
    const start = new Date(Date.UTC(y, m, 1, 0, 0, 0));
    const end = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
    filter.date = { $gte: start, $lte: end };
  }

  const items = await Transaction.find(filter).sort({ date: -1, createdAt: -1 }).lean();

  const summary = items.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.totalIncome += t.amount;
      } else {
        acc.totalExpense += t.amount;
      }
      const key = t.category || 'Uncategorized';
      acc.byCategory[key] = (acc.byCategory[key] || 0) + t.amount * (t.type === 'income' ? 1 : -1);
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, byCategory: {} as Record<string, number> }
  );
  const net = summary.totalIncome - summary.totalExpense;

  return NextResponse.json({ ok: true, items, summary: { ...summary, net } });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = TransactionBodySchema.parse(body);

    const data = {
      ...validated,
      date: typeof validated.date === 'string' ? new Date(validated.date) : validated.date,
      source: validated.source || '',
      note: validated.note || '',
      tags: validated.tags || [],
      isInvestmentInSelf: validated.isInvestmentInSelf ?? false,
    };

    const created = await Transaction.create(data);
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create transaction' }, { status: 500 });
  }
}


