import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { HabitLog } from '@/models/HabitLog';
import { Habit } from '@/models/Habit';

const LogSchema = z.object({
  habit: z.string(),
  date: z.string(),
  status: z.enum(['done', 'skipped', 'missed']).optional(),
  note: z.string().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const url = new URL(req.url);
  const habit = url.searchParams.get('habit');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  const query: any = {};
  if (habit) query.habit = habit;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const logs = await HabitLog.find(query).sort({ date: -1 }).lean();
  const doneCount = logs.filter((l) => l.status === 'done').length;
  const total = logs.length || 1;
  const summary = {
    count: logs.length,
    done: doneCount,
    consistencyPercent: Math.round((doneCount / total) * 100),
  };

  return NextResponse.json({ ok: true, logs, summary });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = LogSchema.parse(body);
    const habitExists = await Habit.exists({ _id: validated.habit });
    if (!habitExists) {
      return NextResponse.json({ ok: false, message: 'Habit not found' }, { status: 404 });
    }

    const day = new Date(validated.date);
    day.setHours(0, 0, 0, 0);

    const updated = await HabitLog.findOneAndUpdate(
      { habit: validated.habit, date: day },
      {
        status: validated.status || 'done',
        note: validated.note || '',
        habit: validated.habit,
        date: day,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to save habit log' }, { status: 500 });
  }
}

