import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Trade } from '@/models/Trade';

const BodySchema = z.object({
  date: z.string().or(z.date()).optional(),
  instrument: z.string().min(1).optional(),
  direction: z.enum(['long', 'short']).optional(),
  session: z.string().optional(),
  entry: z.number().optional(),
  stop: z.number().optional(),
  takeProfit: z.number().optional(),
  size: z.number().optional(),
  riskPerTrade: z.number().optional(),
  resultR: z.number().optional(),
  resultPct: z.number().optional(),
  pnl: z.number().optional(),
  setupTag: z.string().optional(),
  beforeNote: z.string().optional(),
  afterNote: z.string().optional(),
  ruleChecks: z
    .object({
      followedPlan: z.boolean().optional(),
      respectedDailyLoss: z.boolean().optional(),
      validSession: z.boolean().optional(),
      emotional: z.boolean().optional(),
    })
    .optional(),
  screenshots: z.array(z.string()).optional(),
  status: z.enum(['open', 'closed', 'breakeven']).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();

    // Validate partial update
    const partialSchema = BodySchema.partial();
    partialSchema.parse(body);

    const updateData: any = { ...body };
    if (body.date !== undefined) {
      updateData.date = typeof body.date === 'string' ? new Date(body.date) : body.date;
    }
    if (body.session !== undefined) updateData.session = body.session || '';
    if (body.setupTag !== undefined) updateData.setupTag = body.setupTag || '';
    if (body.beforeNote !== undefined) updateData.beforeNote = body.beforeNote || '';
    if (body.afterNote !== undefined) updateData.afterNote = body.afterNote || '';
    if (body.ruleChecks !== undefined) {
      updateData.ruleChecks = {
        followedPlan: body.ruleChecks.followedPlan ?? false,
        respectedDailyLoss: body.ruleChecks.respectedDailyLoss ?? false,
        validSession: body.ruleChecks.validSession ?? false,
        emotional: body.ruleChecks.emotional ?? false,
      };
    }
    if (body.screenshots !== undefined) updateData.screenshots = body.screenshots || [];

    const updated = await Trade.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Trade not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update trade' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await Trade.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Trade not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: 'Trade deleted' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete trade' }, { status: 500 });
  }
}


