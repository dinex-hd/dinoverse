import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Quote } from '@/models/Quote';

const QuoteUpdateSchema = z.object({
  text: z.string().min(1).optional(),
  author: z.string().optional(),
  tag: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = QuoteUpdateSchema.parse(body);
    const updated = await Quote.findByIdAndUpdate(
      params.id,
      {
        ...validated,
        author: validated.author ?? undefined,
        tag: validated.tag ?? undefined,
      },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const deleted = await Quote.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete quote' }, { status: 500 });
  }
}

