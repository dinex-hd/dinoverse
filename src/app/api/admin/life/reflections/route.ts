import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Reflection } from '@/models/Reflection';
import { Rule } from '@/models/Rule';

const ReflectionSchema = z.object({
  date: z.string(),
  summary: z.string().optional(),
  wins: z.array(z.string()).optional(),
  misses: z.array(z.string()).optional(),
  planNextWeek: z.string().optional(),
  brokenRules: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const query: any = {};
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  const items = await Reflection.find(query).sort({ date: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const validated = ReflectionSchema.parse(body);
    if (validated.brokenRules && validated.brokenRules.length > 0) {
      const count = await Rule.countDocuments({ _id: { $in: validated.brokenRules } });
      if (count !== validated.brokenRules.length) {
        return NextResponse.json({ ok: false, message: 'Some rules were not found' }, { status: 400 });
      }
    }

    const created = await Reflection.create({
      ...validated,
      date: new Date(validated.date),
      summary: validated.summary || '',
      planNextWeek: validated.planNextWeek || '',
      wins: validated.wins || [],
      misses: validated.misses || [],
      tags: validated.tags || [],
    });
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      const errorMessages = e.errors.map((err: any) => `${err.path?.join('.') || 'field'}: ${err.message}`).join(', ');
      return NextResponse.json({ ok: false, message: `Validation error: ${errorMessages}`, errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to create reflection' }, { status: 500 });
  }
}

