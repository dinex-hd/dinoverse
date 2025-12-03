import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Blog } from '@/models/Blog';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  const { slug } = await params;

  const post = await Blog.findOne({
    slug,
    published: true,
    active: true,
  }).lean();

  if (!post) {
    return NextResponse.json({ ok: false, message: 'Blog post not found' }, { status: 404 });
  }

  // Get related posts (same category, excluding current)
  const related = await Blog.find({
    category: post.category,
    _id: { $ne: post._id },
    published: true,
    active: true,
  })
    .limit(3)
    .select('title slug excerpt image publishedAt category')
    .sort({ publishedAt: -1 })
    .lean();

  return NextResponse.json({ ok: true, item: post, related });
}

