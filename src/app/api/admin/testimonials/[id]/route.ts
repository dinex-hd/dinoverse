import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Testimonial } from '@/models/Testimonial';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  quote: z.string().min(10).max(600).optional(),
  name: z.string().min(2).max(80).optional(),
  role: z.string().min(2).max(120).optional(),
  company: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = BodySchema.parse({
      ...body,
      order: body.order != null ? Number(body.order) : undefined,
      rating: body.rating != null ? Number(body.rating) : undefined,
    });
    const updated = await Testimonial.findByIdAndUpdate(params.id, data, { new: true });
    if (!updated) return NextResponse.json({ ok: false, message: 'Testimonial not found' }, { status: 404 });
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const deleted = await Testimonial.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ ok: false, message: 'Testimonial not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

