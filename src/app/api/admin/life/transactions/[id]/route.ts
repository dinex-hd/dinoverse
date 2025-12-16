import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Transaction } from '@/models/Transaction';

const TransactionUpdateSchema = z.object({
  date: z.string().or(z.date()).optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).optional(),
  source: z.string().optional(),
  amount: z.number().optional(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isInvestmentInSelf: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = TransactionUpdateSchema.parse(body);

    const update: any = { ...validated };
    if (validated.date) {
      update.date = typeof validated.date === 'string' ? new Date(validated.date) : validated.date;
    }
    if (validated.source !== undefined) update.source = validated.source || '';
    if (validated.note !== undefined) update.note = validated.note || '';
    if (validated.tags !== undefined) update.tags = validated.tags;
    if (validated.isInvestmentInSelf !== undefined) update.isInvestmentInSelf = validated.isInvestmentInSelf;

    const updated = await Transaction.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const deleted = await Transaction.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: 'Deleted' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete transaction' }, { status: 500 });
  }
}


