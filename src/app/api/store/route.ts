import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const featured = searchParams.get('featured');
  const bestseller = searchParams.get('bestseller');
  const newProduct = searchParams.get('new');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const search = searchParams.get('search') || '';

  const filter: any = {
    active: true,
  };

  if (category && category !== 'All') filter.category = category;
  if (tag) filter.tags = { $in: [tag] };
  if (featured === 'true') filter.featured = true;
  if (bestseller === 'true') filter.bestseller = true;
  if (newProduct === 'true') filter.new = true;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const query = Product.find(filter).sort({ order: -1, createdAt: -1 });
  if (limit) query.limit(limit);

  const items = await query.lean();
  return NextResponse.json({ ok: true, items });
}

