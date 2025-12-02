import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Feature } from '@/models/Feature';
import { isRequestAuthorized } from '@/lib/adminAuth';

const FeatureSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(400),
  icon: z.string().optional(),
  emphasis: z.string().max(60).optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  const filter: Record<string, any> = {};
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  const items = await Feature.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = FeatureSchema.parse({
      ...body,
      order: body.order != null ? Number(body.order) : undefined,
    });
    const created = await Feature.create({
      ...data,
      icon: data.icon || 'SparklesIcon',
      active: data.active ?? true,
      order: data.order ?? 0,
    });
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create feature' }, { status: 500 });
  }
}


