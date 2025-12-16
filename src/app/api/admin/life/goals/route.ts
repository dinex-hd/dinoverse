import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Goal } from '@/models/Goal';

const GoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due: z.string().or(z.date()).optional(),
  status: z.enum(['active', 'paused', 'done']).optional(),
  focusArea: z.enum(['trading', 'business', 'health', 'personal']).optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const items = await Goal.find().sort({ status: 1, due: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = GoalSchema.parse(body);
    const data = {
      ...validated,
      description: validated.description || '',
      due: validated.due ? new Date(validated.due) : undefined,
      status: validated.status || 'active',
      focusArea: validated.focusArea || 'trading',
    };
    const created = await Goal.create(data);
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create goal' }, { status: 500 });
  }
}


