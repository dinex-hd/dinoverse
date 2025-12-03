import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name must be at most 200 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(200, 'Slug must be at most 200 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be at most 500 characters'),
  longDescription: z.string().optional(),
  category: z.string().min(2, 'Category must be at least 2 characters').max(100, 'Category must be at most 100 characters'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  image: z.union([z.string().url(), z.literal('')]).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().min(0).optional(),
  students: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  format: z.string().optional(),
  downloadable: z.boolean().optional(),
  updates: z.string().optional(),
  bestseller: z.boolean().optional(),
  new: z.boolean().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const category = searchParams.get('category');

  const filter: any = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ];
  }
  if (category) filter.category = category;

  const items = await Product.find(filter).sort({ order: -1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Prepare data for validation
    const validated = BodySchema.parse({
      ...body,
      tags: body.tags || [],
      image: body.image || '',
      originalPrice: body.originalPrice != null ? Number(body.originalPrice) : undefined,
      discount: body.discount != null ? Number(body.discount) : undefined,
      rating: body.rating != null ? Number(body.rating) : undefined,
      reviews: body.reviews != null ? Number(body.reviews) : 0,
      students: body.students != null ? Number(body.students) : 0,
      order: body.order != null ? Number(body.order) : 0,
      bestseller: body.bestseller ?? false,
      new: body.new ?? false,
      featured: body.featured ?? false,
      downloadable: body.downloadable ?? true,
      active: body.active ?? true,
    });

    // Check if slug already exists
    const existing = await Product.findOne({ slug: validated.slug }).lean();
    if (existing) {
      return NextResponse.json({ ok: false, message: 'Slug already exists' }, { status: 400 });
    }

    const created = await Product.create(validated);
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    if (e.code === 11000) {
      return NextResponse.json({ ok: false, message: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create product' }, { status: 500 });
  }
}

