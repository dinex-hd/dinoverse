import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Blog } from '@/models/Blog';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title must be at most 200 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(200, 'Slug must be at most 200 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt must be at most 500 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image: z.union([z.string().url(), z.literal('')]).optional(),
  category: z.string().min(2, 'Category must be at least 2 characters').max(100, 'Category must be at most 100 characters'),
  tags: z.array(z.string()).optional(),
  author: z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.union([z.string().url(), z.literal('')]).optional(),
  }).optional(),
  publishedAt: z.string().optional(),
  readTime: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const status = searchParams.get('status'); // 'published', 'draft', 'all'

  const filter: any = {};
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ];
  }
  if (status === 'published') filter.published = true;
  if (status === 'draft') filter.published = false;

  const items = await Blog.find(filter).sort({ order: -1, publishedAt: -1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Prepare data for validation (keep strings as strings)
    const validated = BodySchema.parse({
      ...body,
      tags: body.tags || [],
      image: body.image || '',
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      order: body.order != null ? Number(body.order) : 0,
      featured: body.featured ?? false,
      published: body.published ?? false,
      active: body.active ?? true,
      author: body.author || { name: 'Dinoverse', avatar: '' },
      readTime: body.readTime || '5 min read',
    });

    // Convert to DB format after validation
    const data = {
      ...validated,
      image: validated.image || '',
      publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : new Date(),
      author: {
        name: validated.author?.name || 'Dinoverse',
        avatar: validated.author?.avatar || '',
      },
    };

    // Check if slug already exists
    const existing = await Blog.findOne({ slug: data.slug }).lean();
    if (existing) {
      return NextResponse.json({ ok: false, message: 'Slug already exists' }, { status: 400 });
    }

    const created = await Blog.create(data);
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    if (e.code === 11000) {
      return NextResponse.json({ ok: false, message: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create blog post' }, { status: 500 });
  }
}

