import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Feature } from '@/models/Feature';
import { isRequestAuthorized } from '@/lib/adminAuth';

const FeatureSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(10).max(400).optional(),
  icon: z.string().optional(),
  emphasis: z.string().max(60).optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = FeatureSchema.parse({
      ...body,
      order: body.order != null ? Number(body.order) : undefined,
    });
    const updated = await Feature.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ ok: false, message: 'Feature not found' }, { status: 404 });
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const deleted = await Feature.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ ok: false, message: 'Feature not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}


