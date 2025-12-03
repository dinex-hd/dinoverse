import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Partner } from '@/models/Partner';
import { isRequestAuthorized } from '@/lib/adminAuth';

const PartnerSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  logo: z.string().optional(),
  url: z.string().url().optional(),
  accent: z.string().max(30).optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = PartnerSchema.parse({
      ...body,
      order: body.order != null ? Number(body.order) : undefined,
    });
    const updated = await Partner.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ ok: false, message: 'Partner not found' }, { status: 404 });
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const deleted = await Partner.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ ok: false, message: 'Partner not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}


