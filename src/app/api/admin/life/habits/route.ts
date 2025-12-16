import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Habit } from '@/models/Habit';
import { Goal } from '@/models/Goal';

const HabitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly']).optional(),
  goal: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const url = new URL(req.url);
  const goal = url.searchParams.get('goal');
  const query: any = {};
  if (goal) query.goal = goal;
  const items = await Habit.find(query).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = HabitSchema.parse(body);
    if (validated.goal) {
      const goalExists = await Goal.exists({ _id: validated.goal });
      if (!goalExists) {
        return NextResponse.json({ ok: false, message: 'Goal not found' }, { status: 404 });
      }
    }
    const created = await Habit.create({
      ...validated,
      description: validated.description || '',
      frequency: validated.frequency || 'daily',
      active: validated.active ?? true,
      order: validated.order ?? 0,
    });
    if (created.goal) {
      await Goal.findByIdAndUpdate(created.goal, { $addToSet: { habits: created._id } });
    }
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create habit' }, { status: 500 });
  }
}

