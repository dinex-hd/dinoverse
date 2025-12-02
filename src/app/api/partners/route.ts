import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Partner } from '@/models/Partner';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit')) || 20;
  const items = await Partner.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return NextResponse.json({ ok: true, items });
}


