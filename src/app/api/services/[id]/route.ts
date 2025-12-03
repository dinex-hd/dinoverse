import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Service } from '@/models/Service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;

  // Try to find by ID first, then by slug or title
  let service = await Service.findOne({
    _id: id,
    active: true,
  }).lean();

  if (!service) {
    service = await Service.findOne({
      $or: [
        { title: { $regex: id, $options: 'i' } },
      ],
      active: true,
    }).lean();
  }

  if (!service) {
    return NextResponse.json({ ok: false, message: 'Service not found' }, { status: 404 });
  }

  // Get related services (same category, excluding current)
  const related = await Service.find({
    category: service.category,
    _id: { $ne: service._id },
    active: true,
  })
    .limit(3)
    .select('title description category priceETB features icon badge')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ ok: true, item: service, related });
}

