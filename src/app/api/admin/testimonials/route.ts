import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Testimonial } from '@/models/Testimonial';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  quote: z.string().min(10).max(600),
  name: z.string().min(2).max(80),
  role: z.string().min(2).max(120),
  company: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const featured = searchParams.get('featured');

  const filter: any = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { role: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
    ];
  }
  if (featured === 'true') filter.featured = true;

  const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = BodySchema.parse({
      ...body,
      order: body.order != null ? Number(body.order) : undefined,
      rating: body.rating != null ? Number(body.rating) : undefined,
    });

    const created = await Testimonial.create({
      ...data,
      rating: data.rating ?? 5,
      featured: data.featured ?? false,
      active: data.active ?? true,
      order: data.order ?? 0,
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create testimonial' }, { status: 500 });
  }
}

