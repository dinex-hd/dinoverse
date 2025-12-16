import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Reflection } from '@/models/Reflection';
import { Rule } from '@/models/Rule';

const ReflectionUpdateSchema = z.object({
  date: z.string().optional(),
  summary: z.string().optional(),
  wins: z.array(z.string()).optional(),
  misses: z.array(z.string()).optional(),
  planNextWeek: z.string().optional(),
  brokenRules: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = ReflectionUpdateSchema.parse(body);
    if (validated.brokenRules && validated.brokenRules.length > 0) {
      const count = await Rule.countDocuments({ _id: { $in: validated.brokenRules } });
      if (count !== validated.brokenRules.length) {
        return NextResponse.json({ ok: false, message: 'Some rules were not found' }, { status: 400 });
      }
    }
    const data: any = { ...validated };
    if (validated.date) data.date = new Date(validated.date);
    const updated = await Reflection.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Reflection not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update reflection' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const deleted = await Reflection.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Reflection not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete reflection' }, { status: 500 });
  }
}

