import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Portfolio } from '@/models/Portfolio';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  title: z.string().min(2).max(120).optional(),
  description: z.string().min(10).max(500).optional(),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  category: z.string().min(2).max(60).optional(),
  technologies: z.array(z.string()).optional(),
  status: z.enum(['Completed', 'In Progress', 'Planning']).optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = BodySchema.parse({
      ...body,
      technologies: body.technologies != null
        ? (Array.isArray(body.technologies)
            ? body.technologies
            : typeof body.technologies === 'string'
            ? body.technologies.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [])
        : undefined,
      order: body.order != null ? Number(body.order) : undefined,
    });
    const updated = await Portfolio.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Portfolio not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: updated }, { status: 200 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update portfolio' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const deleted = await Portfolio.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ ok: false, message: 'Portfolio not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}

