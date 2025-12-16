import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Habit } from '@/models/Habit';
import { Goal } from '@/models/Goal';

const HabitUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly']).optional(),
  goal: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = HabitUpdateSchema.parse(body);
    if (validated.goal) {
      const goalExists = await Goal.exists({ _id: validated.goal });
      if (!goalExists) {
        return NextResponse.json({ ok: false, message: 'Goal not found' }, { status: 404 });
      }
    }
    const updated = await Habit.findByIdAndUpdate(
      id,
      {
        ...validated,
        description: validated.description ?? undefined,
      },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Habit not found' }, { status: 404 });
    }
    if (validated.goal) {
      await Goal.findByIdAndUpdate(validated.goal, { $addToSet: { habits: updated._id } });
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const deleted = await Habit.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Habit not found' }, { status: 404 });
    }
    if (deleted.goal) {
      await Goal.findByIdAndUpdate(deleted.goal, { $pull: { habits: deleted._id } });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete habit' }, { status: 500 });
  }
}

