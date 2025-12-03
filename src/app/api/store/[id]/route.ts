import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;

  // Try to find by ID first, then by slug
  let product = await Product.findOne({
    _id: id,
    active: true,
  }).lean();

  if (!product) {
    product = await Product.findOne({
      slug: id,
      active: true,
    }).lean();
  }

  if (!product) {
    return NextResponse.json({ ok: false, message: 'Product not found' }, { status: 404 });
  }

  // Get related products (same category, excluding current)
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    active: true,
  })
    .limit(4)
    .select('name slug description image price originalPrice discount rating reviews category bestseller new')
    .sort({ order: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ ok: true, item: product, related });
}

