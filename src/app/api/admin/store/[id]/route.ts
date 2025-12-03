import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  name: z.string().min(2).max(200).optional(),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  description: z.string().min(10).max(500).optional(),
  longDescription: z.string().optional(),
  category: z.string().min(2).max(100).optional(),
  price: z.number().min(0).optional(),
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Prepare data for validation
    const toValidate: any = {};
    if (body.name !== undefined) toValidate.name = body.name;
    if (body.slug !== undefined) toValidate.slug = body.slug;
    if (body.description !== undefined) toValidate.description = body.description;
    if (body.longDescription !== undefined) toValidate.longDescription = body.longDescription;
    if (body.category !== undefined) toValidate.category = body.category;
    if (body.price !== undefined) toValidate.price = Number(body.price);
    if (body.originalPrice !== undefined) toValidate.originalPrice = body.originalPrice ? Number(body.originalPrice) : 0;
    if (body.discount !== undefined) toValidate.discount = body.discount ? Number(body.discount) : 0;
    if (body.image !== undefined) toValidate.image = body.image || '';
    if (body.rating !== undefined) toValidate.rating = body.rating ? Number(body.rating) : 0;
    if (body.reviews !== undefined) toValidate.reviews = body.reviews ? Number(body.reviews) : 0;
    if (body.students !== undefined) toValidate.students = body.students ? Number(body.students) : 0;
    if (body.tags !== undefined) toValidate.tags = body.tags;
    if (body.format !== undefined) toValidate.format = body.format;
    if (body.downloadable !== undefined) toValidate.downloadable = body.downloadable;
    if (body.updates !== undefined) toValidate.updates = body.updates;
    if (body.bestseller !== undefined) toValidate.bestseller = body.bestseller;
    if (body.new !== undefined) toValidate.new = body.new;
    if (body.featured !== undefined) toValidate.featured = body.featured;
    if (body.order !== undefined) toValidate.order = Number(body.order);
    if (body.active !== undefined) toValidate.active = body.active;

    // Validate partial data if provided
    if (Object.keys(toValidate).length > 0) {
      const partialSchema = BodySchema.partial();
      partialSchema.parse(toValidate);
    }

    // Prepare updateData for MongoDB
    const updateData: any = { ...toValidate };
    if (body.slug) {
      const existing = await Product.findOne({ slug: body.slug, _id: { $ne: id } }).lean();
      if (existing) {
        return NextResponse.json({ ok: false, message: 'Slug already exists' }, { status: 400 });
      }
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    if (e.code === 11000) {
      return NextResponse.json({ ok: false, message: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: 'Product deleted' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete product' }, { status: 500 });
  }
}

