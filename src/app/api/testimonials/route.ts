import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Testimonial } from '@/models/Testimonial';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit')) || 6;
  const featuredOnly = searchParams.get('featured') === 'true';

  const filter: any = { active: true };
  if (featuredOnly) filter.featured = true;

  const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).limit(limit).lean();
  return NextResponse.json({ ok: true, items });
}

