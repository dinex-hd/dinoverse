import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Blog } from '@/models/Blog';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  title: z.string().min(2).max(200).optional(),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(10).optional(),
  image: z.union([z.string().url(), z.literal('')]).optional(),
  category: z.string().min(2).max(100).optional(),
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Prepare data for validation (keep strings as strings, handle empty strings)
    const toValidate: any = {};
    if (body.title !== undefined) toValidate.title = body.title;
    if (body.slug !== undefined) toValidate.slug = body.slug;
    if (body.excerpt !== undefined) toValidate.excerpt = body.excerpt;
    if (body.content !== undefined) toValidate.content = body.content;
    if (body.image !== undefined) toValidate.image = body.image || '';
    if (body.category !== undefined) toValidate.category = body.category;
    if (body.tags !== undefined) toValidate.tags = body.tags;
    if (body.author !== undefined) {
      toValidate.author = {
        name: body.author.name,
        avatar: body.author.avatar || '',
      };
    }
    if (body.publishedAt !== undefined) toValidate.publishedAt = body.publishedAt;
    if (body.readTime !== undefined) toValidate.readTime = body.readTime;
    if (body.featured !== undefined) toValidate.featured = body.featured;
    if (body.published !== undefined) toValidate.published = body.published;
    if (body.order !== undefined) toValidate.order = body.order;
    if (body.active !== undefined) toValidate.active = body.active;

    // Validate partial data if provided
    if (Object.keys(toValidate).length > 0) {
      const partialSchema = BodySchema.partial();
      partialSchema.parse(toValidate);
    }

    // Now prepare updateData for MongoDB (convert dates, handle empty strings)
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) {
      updateData.slug = body.slug;
      // Check if slug already exists (excluding current post)
      const existing = await Blog.findOne({ slug: body.slug, _id: { $ne: id } }).lean();
      if (existing) {
        return NextResponse.json({ ok: false, message: 'Slug already exists' }, { status: 400 });
      }
    }
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.image !== undefined) updateData.image = body.image || '';
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.author !== undefined) {
      updateData.author = {
        name: body.author.name || 'Dinoverse',
        avatar: body.author.avatar || '',
      };
    }
    if (body.publishedAt !== undefined) {
      updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    }
    if (body.readTime !== undefined) updateData.readTime = body.readTime;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.order !== undefined) updateData.order = Number(body.order);
    if (body.active !== undefined) updateData.active = body.active;

    const updated = await Blog.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ ok: false, message: 'Blog post not found' }, { status: 404 });
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
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: 'Blog post deleted' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to delete blog post' }, { status: 500 });
  }
}

