import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Rule } from '@/models/Rule';

const RuleUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  reason: z.string().optional(),
  active: z.boolean().optional(),
  order: z.number().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = RuleUpdateSchema.parse(body);
    const updated = await Rule.findByIdAndUpdate(
      id,
      {
        ...validated,
        description: validated.description ?? undefined,
        reason: validated.reason ?? undefined,
      },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Rule not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update rule' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const deleted = await Rule.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Rule not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete rule' }, { status: 500 });
  }
}

