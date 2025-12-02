import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Feature } from '@/models/Feature';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit')) || 12;
  const items = await Feature.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return NextResponse.json({ ok: true, items });
}


