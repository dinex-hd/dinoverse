import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Service } from '@/models/Service';
import { isRequestAuthorized } from '@/lib/adminAuth';

const BodySchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(60),
  icon: z.string().optional(),
  section: z.enum(['homepage', 'packages', 'both', 'none']).optional(),
  priceETB: z.number().min(0),
  features: z.array(z.string()).optional(),
  badge: z.string().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  // Ensure core services and popular packages exist without duplicating
  const seedServices = [
    // Core homepage trio
    {
      title: 'Web Development',
      description: 'Modern, high-performance websites and web applications',
      category: 'web',
      icon: 'web',
      section: 'homepage',
      priceETB: 27500,
      features: ['Next.js + TypeScript', 'SEO Optimized', 'Fast Loading', 'Mobile Responsive'],
      badge: 'Most Popular',
      active: true,
    },
    {
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for iOS and Android',
      category: 'mobile',
      icon: 'mobile',
      section: 'homepage',
      priceETB: 71500,
      features: ['React Native', 'Push Notifications', 'App Store Ready', 'Cross-platform'],
      active: true,
    },
    {
      title: 'Design & Branding',
      description: 'Beautiful visuals that connect, convert, and inspire',
      category: 'design',
      icon: 'design',
      section: 'homepage',
      priceETB: 11000,
      features: ['Logo Design', 'Brand Identity', 'Social Media Kit', 'Print Ready'],
      active: true,
    },
    // Popular packages
    {
      title: 'Starter Brand Kit',
      description: 'Kickstart your brand with essentials that make you look pro from day one.',
      category: 'design',
      icon: 'design',
      section: 'packages',
      priceETB: 16500,
      features: ['Logo + Variations', 'Color Palette', 'Typography Guide', 'Social Media Templates', 'Brand Guidelines (Lite)'],
      badge: 'Popular',
      active: true,
    },
    {
      title: 'Full Website Launch',
      description: 'Plan, design, build and ship a production-grade website end-to-end.',
      category: 'web',
      icon: 'web',
      section: 'packages',
      priceETB: 71500,
      features: ['Next.js + TypeScript', 'CMS Integration', 'Analytics + SEO', 'Responsive UI', 'Deploy + Handover'],
      badge: 'Popular',
      active: true,
    },
    {
      title: 'Creator Booster Pack',
      description: 'Everything a creator needs to level-up content speed and quality.',
      category: 'design',
      icon: 'design',
      section: 'packages',
      priceETB: 11000,
      features: ['Channel Branding', 'Thumbnail System', 'Intro/Outro Assets', 'Social Cutdowns Kit', 'Content Templates'],
      active: true,
    },
    {
      title: 'Business Bundle',
      description: 'Website, branding and core automations bundled to launch fast.',
      category: 'web',
      icon: 'analytics',
      section: 'packages',
      priceETB: 49500,
      features: ['Modern Website', 'Brand Identity', 'Lead Capture', 'Basic Automations', 'Analytics Setup'],
      active: true,
    },
    {
      title: 'Maintenance Plan',
      description: 'Ongoing updates, monitoring and optimizations to keep things running smooth.',
      category: 'web',
      icon: 'analytics',
      section: 'packages',
      priceETB: 5500, // per month
      features: ['Uptime Monitoring', 'Security Updates', 'Content Edits', 'Performance Checks'],
      badge: 'Subscription',
      active: true,
    },
  ];

  for (const svc of seedServices) {
    const exists = await Service.findOne({ title: svc.title }).lean();
    if (!exists) {
      await Service.create(svc as any);
    }
  }
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const filter: any = q
    ? { $or: [{ title: { $regex: q, $options: 'i' } }, { category: { $regex: q, $options: 'i' } }] }
    : {};
  const items = await Service.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const body = await req.json();
    const data = BodySchema.parse({ ...body, priceETB: Number(body.priceETB) });
    await connectToDatabase();
    const doc = await Service.create({ ...data, features: data.features || [] });
    return NextResponse.json({ ok: true, item: doc }, { status: 201 });
  } catch (e: any) {
    const message = e?.message || 'Failed to create service';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}


