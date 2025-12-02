import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Contact } from '@/models/Contact';
import { isRequestAuthorized } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const q = (searchParams.get('q') || '').trim();

  await connectToDatabase();

  const filter: any = q
    ? {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { subject: { $regex: q, $options: 'i' } },
          { message: { $regex: q, $options: 'i' } },
        ],
      }
    : {};

  const total = await Contact.countDocuments(filter);
  const items = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ ok: true, page, limit, total, items });
}


