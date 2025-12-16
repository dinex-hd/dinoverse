import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Goal } from '@/models/Goal';

const GoalUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  due: z.string().or(z.date()).optional(),
  status: z.enum(['active', 'paused', 'done']).optional(),
  focusArea: z.enum(['trading', 'business', 'health', 'personal']).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = GoalUpdateSchema.parse(body);
    const data = {
      ...validated,
      description: validated.description ?? undefined,
      due: validated.due ? new Date(validated.due) : undefined,
    };
    const updated = await Goal.findByIdAndUpdate(params.id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const deleted = await Goal.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete goal' }, { status: 500 });
  }
}

