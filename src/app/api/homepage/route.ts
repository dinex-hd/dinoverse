import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { SiteContent } from '@/models/SiteContent';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section'); // 'hero', 'whyChoose', etc.
  
  if (section) {
    // Get specific section
    const content = await SiteContent.findOne({ key: section }).lean();
    if (!content) {
      return NextResponse.json({ ok: true, content: null });
    }
    
    // Return only the relevant section data
    let sectionData: any = null;
    switch (section) {
      case 'hero':
        sectionData = content.hero;
        break;
      case 'whyChoose':
        sectionData = content.whyChoose;
        break;
      case 'processTimeline':
        sectionData = content.processTimeline;
        break;
      case 'cta':
        sectionData = content.cta;
        break;
      case 'recentWork':
        sectionData = content.recentWork;
        break;
      case 'contactMini':
        sectionData = content.contactMini;
        break;
      case 'servicesPage':
        sectionData = content.servicesPage;
        break;
    }
    
    return NextResponse.json({ ok: true, section: sectionData });
  }
  
  // Get all sections
  const allContent = await SiteContent.find({}).lean();
  const result: Record<string, any> = {};
  
  for (const item of allContent) {
    switch (item.key) {
      case 'hero':
        result.hero = item.hero;
        break;
      case 'whyChoose':
        result.whyChoose = item.whyChoose;
        break;
      case 'processTimeline':
        result.processTimeline = item.processTimeline;
        break;
      case 'cta':
        result.cta = item.cta;
        break;
      case 'recentWork':
        result.recentWork = item.recentWork;
        break;
      case 'contactMini':
        result.contactMini = item.contactMini;
        break;
      case 'servicesPage':
        result.servicesPage = item.servicesPage;
        break;
    }
  }
  
  return NextResponse.json({ ok: true, sections: result });
}

