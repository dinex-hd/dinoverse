import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Portfolio } from '@/models/Portfolio';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(500),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  category: z.string().min(2).max(60),
  technologies: z.array(z.string()).optional(),
  status: z.enum(['Completed', 'In Progress', 'Planning']).optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
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
      { title: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }
  if (featured === 'true') {
    filter.featured = true;
  }
  
  const items = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const body = await req.json();
    const data = BodySchema.parse({
      ...body,
      technologies: Array.isArray(body.technologies) ? body.technologies : (typeof body.technologies === 'string' ? body.technologies.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      order: body.order != null ? Number(body.order) : undefined,
    });
    await connectToDatabase();
    const doc = await Portfolio.create({
      ...data,
      status: data.status || 'Completed',
      featured: data.featured || false,
      active: data.active !== undefined ? data.active : true,
      order: data.order || 0,
    });
    return NextResponse.json({ ok: true, item: doc }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create portfolio' }, { status: 500 });
  }
}

