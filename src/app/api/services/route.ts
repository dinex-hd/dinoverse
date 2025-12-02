import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Service } from '@/models/Service';

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section'); // 'homepage' or 'packages'
  
  // Build filter
  const filter: any = { active: true };
  if (section === 'homepage') {
    filter.$or = [
      { section: 'homepage' },
      { section: 'both' }
    ];
  } else if (section === 'packages') {
    filter.$or = [
      { section: 'packages' },
      { section: 'both' }
    ];
  }

  const items = await Service.find(filter).sort({ createdAt: 1 }).lean();
  return NextResponse.json({ ok: true, items });
}


