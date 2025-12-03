import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Blog } from '@/models/Blog';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const search = searchParams.get('search') || '';

  const filter: any = {
    published: true,
    active: true,
  };

  if (category) filter.category = category;
  if (tag) filter.tags = { $in: [tag] };
  if (featured === 'true') filter.featured = true;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const query = Blog.find(filter).sort({ order: -1, publishedAt: -1, createdAt: -1 });
  if (limit) query.limit(limit);

  const items = await query.lean();
  return NextResponse.json({ ok: true, items });
}

