import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { SiteContent } from '@/models/SiteContent';
import { isRequestAuthorized } from '@/lib/adminAuth';

// Validation schemas
const HeroContentSchema = z.object({
  badge: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  stats: z.object({
    projects: z.string().optional(),
    rating: z.string().optional(),
    community: z.string().optional(),
  }).optional(),
});

const WhyChoosePointSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().default(0),
});

const WhyChooseSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  points: z.array(WhyChoosePointSchema).optional(),
});

const ProcessStepSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().min(0),
});

const ProcessTimelineSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  steps: z.array(ProcessStepSchema).optional(),
});

const CTASchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  primaryButton: z.object({
    text: z.string().optional(),
    href: z.string().optional(),
  }).optional(),
  secondaryButton: z.object({
    text: z.string().optional(),
    href: z.string().optional(),
  }).optional(),
});

const RecentWorkSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  projectIds: z.array(z.string()).optional(),
  maxProjects: z.number().optional(),
});

const ContactMiniSchema = z.object({
  email: z.string().email().optional(),
  responseTime: z.string().optional(),
  availability: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
});

const ServicesPageSchema = z.object({
  badge: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  tagline: z.string().optional(),
  stats: z
    .object({
      projects: z.string().optional(),
      rating: z.string().optional(),
      satisfaction: z.string().optional(),
    })
    .optional(),
});

const BodySchema = z.object({
  hero: HeroContentSchema.optional(),
  whyChoose: WhyChooseSchema.optional(),
  processTimeline: ProcessTimelineSchema.optional(),
  cta: CTASchema.optional(),
  recentWork: RecentWorkSchema.optional(),
  contactMini: ContactMiniSchema.optional(),
  servicesPage: ServicesPageSchema.optional(),
});

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();
  
  // Get all sections or filter by key
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section'); // 'hero', 'whyChoose', etc.
  
  if (section) {
    const content = await SiteContent.findOne({ key: section }).lean();
    return NextResponse.json({ ok: true, content });
  }
  
  // Get all sections
  const allContent = await SiteContent.find({}).lean();
  const result: Record<string, any> = {};
  
  for (const item of allContent) {
    result[item.key] = item;
  }
  
  return NextResponse.json({ ok: true, sections: result });
}

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  
  try {
    const body = await req.json();
    const { section, data } = body; // section: 'hero', 'whyChoose', etc., data: the content
    
    if (!section || !data) {
      return NextResponse.json({ ok: false, message: 'Missing section or data' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Validate data based on section
    let validatedData: any;
    switch (section) {
      case 'hero':
        validatedData = { hero: HeroContentSchema.parse(data) };
        break;
      case 'whyChoose':
        validatedData = { whyChoose: WhyChooseSchema.parse(data) };
        break;
      case 'processTimeline':
        validatedData = { processTimeline: ProcessTimelineSchema.parse(data) };
        break;
      case 'cta':
        validatedData = { cta: CTASchema.parse(data) };
        break;
      case 'recentWork':
        validatedData = { recentWork: RecentWorkSchema.parse(data) };
        break;
      case 'contactMini':
        validatedData = { contactMini: ContactMiniSchema.parse(data) };
        break;
      case 'servicesPage':
        validatedData = { servicesPage: ServicesPageSchema.parse(data) };
        break;
      default:
        return NextResponse.json({ ok: false, message: 'Invalid section' }, { status: 400 });
    }
    
    // Upsert: update if exists, create if not
    const updated = await SiteContent.findOneAndUpdate(
      { key: section },
      { $set: { ...validatedData, key: section } },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ ok: true, content: updated }, { status: 200 });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ ok: false, message: 'Validation error', errors: e.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to save' }, { status: 500 });
  }
}

