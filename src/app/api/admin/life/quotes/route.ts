import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Quote } from '@/models/Quote';

const QuoteSchema = z.object({
  text: z.string().min(1),
  author: z.string().optional(),
  tag: z.string().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const url = new URL(req.url);
  const random = url.searchParams.get('random');
  const onlyActive = url.searchParams.get('active');

  const query: any = {};
  if (onlyActive === '1') query.active = true;

  if (random === '1') {
    const pipeline: any[] = [{ $match: query }, { $sample: { size: 1 } }];
    const [item] = await Quote.aggregate(pipeline);
    return NextResponse.json({ ok: true, item: item || null });
  }

  const items = await Quote.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = QuoteSchema.parse(body);
    const created = await Quote.create({
      ...validated,
      author: validated.author || '',
      tag: validated.tag || '',
      active: validated.active ?? true,
    });
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create quote' }, { status: 500 });
  }
}

