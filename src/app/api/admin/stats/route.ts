import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Blog } from '@/models/Blog';
import { Service } from '@/models/Service';
import { Product } from '@/models/Product';
import { Contact } from '@/models/Contact';

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Get counts
    const [
      totalBlogs,
      publishedBlogs,
      totalServices,
      activeServices,
      totalProducts,
      activeProducts,
      totalContacts,
      recentBlogs,
      recentContacts,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ published: true, active: true }),
      Service.countDocuments(),
      Service.countDocuments({ active: true }),
      Product.countDocuments(),
      Product.countDocuments({ active: true }),
      Contact.countDocuments(),
      Blog.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title slug published createdAt category')
        .lean(),
      Contact.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email subject createdAt')
        .lean(),
    ]);

    return NextResponse.json({
      ok: true,
      stats: {
        blogs: { total: totalBlogs, published: publishedBlogs },
        services: { total: totalServices, active: activeServices },
        products: { total: totalProducts, active: activeProducts },
        contacts: { total: totalContacts },
      },
      recent: {
        blogs: recentBlogs,
        contacts: recentContacts,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

