import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Trade } from '@/models/Trade';

const BodySchema = z.object({
  date: z.string().or(z.date()),
  instrument: z.string().min(1),
  direction: z.enum(['long', 'short']),
  session: z.string().optional(),
  entry: z.number(),
  stop: z.number(),
  takeProfit: z.number().optional(),
  size: z.number(),
  riskPerTrade: z.number().optional(),
  resultR: z.number().optional(),
  resultPct: z.number().optional(),
  pnl: z.number().optional(),
  setupTag: z.string().optional(),
  beforeNote: z.string().optional(),
  afterNote: z.string().optional(),
  ruleChecks: z
    .object({
      followedPlan: z.boolean().optional(),
      respectedDailyLoss: z.boolean().optional(),
      validSession: z.boolean().optional(),
      emotional: z.boolean().optional(),
    })
    .optional(),
  screenshots: z.array(z.string()).optional(),
  status: z.enum(['open', 'closed', 'breakeven']).optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const instrument = (searchParams.get('instrument') || '').trim();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const filter: any = {};
  if (q) {
    filter.$or = [
      { instrument: { $regex: q, $options: 'i' } },
      { setupTag: { $regex: q, $options: 'i' } },
      { beforeNote: { $regex: q, $options: 'i' } },
      { afterNote: { $regex: q, $options: 'i' } },
    ];
  }
  if (instrument) {
    filter.instrument = { $regex: instrument, $options: 'i' };
  }
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const items = await Trade.find(filter).sort({ date: -1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();

    const validated = BodySchema.parse(body);

    const data = {
      ...validated,
      date: typeof validated.date === 'string' ? new Date(validated.date) : validated.date,
      session: validated.session || '',
      setupTag: validated.setupTag || '',
      beforeNote: validated.beforeNote || '',
      afterNote: validated.afterNote || '',
      ruleChecks: {
        followedPlan: validated.ruleChecks?.followedPlan ?? false,
        respectedDailyLoss: validated.ruleChecks?.respectedDailyLoss ?? false,
        validSession: validated.ruleChecks?.validSession ?? false,
        emotional: validated.ruleChecks?.emotional ?? false,
      },
      screenshots: validated.screenshots || [],
      status: validated.status || 'closed',
    };

    const created = await Trade.create(data);
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create trade' }, { status: 500 });
  }
}


