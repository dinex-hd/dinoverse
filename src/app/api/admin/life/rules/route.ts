import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Rule } from '@/models/Rule';

const RuleSchema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  description: z.string().optional(),
  reason: z.string().optional(),
  active: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const query: any = {};
  if (category) query.category = category;
  const items = await Rule.find(query).sort({ active: -1, order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = RuleSchema.parse(body);
    const created = await Rule.create({
      ...validated,
      category: validated.category || 'trading',
      description: validated.description || '',
      reason: validated.reason || '',
      active: validated.active ?? true,
      order: validated.order ?? 0,
    });
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create rule' }, { status: 500 });
  }
}

