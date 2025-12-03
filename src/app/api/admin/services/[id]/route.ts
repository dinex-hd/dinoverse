import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Service } from '@/models/Service';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  title: z.string().min(2).max(120).optional(),
  description: z.string().min(10).max(2000).optional(),
  category: z.string().min(2).max(60).optional(),
  icon: z.string().optional(),
  section: z.enum(['homepage', 'packages', 'both', 'none']).optional(),
  priceETB: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  badge: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const body = await req.json();
  const data = BodySchema.parse({ ...body, priceETB: body.priceETB != null ? Number(body.priceETB) : undefined });
  const updated = await Service.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  await Service.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}


