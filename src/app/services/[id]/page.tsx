import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, CheckIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { connectToDatabase } from '@/lib/mongoose';
import { Service } from '@/models/Service';

async function getService(id: string) {
  await connectToDatabase();

  // Try to find by ID first
  let service = await Service.findOne({
    _id: id,
    active: true,
  }).lean();

  if (!service) {
    // Try to find by title match
    service = await Service.findOne({
      title: { $regex: id, $options: 'i' },
      active: true,
    }).lean();
  }

  if (!service) return null;

  // Get related services
  const related = await Service.find({
    category: service.category,
    _id: { $ne: service._id },
    active: true,
  })
    .limit(3)
    .select('title description category priceETB features icon badge')
    .sort({ createdAt: -1 })
    .lean();

  return { service, related };
}

interface ServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const data = await getService(id);

  if (!data) {
    notFound();
  }

  const { service, related } = data;

  return (
    <div className="bg-white pt-24">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </div>

      {/* Service Header */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Service Image/Icon */}
          <div className="aspect-w-16 aspect-h-9">
            <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-400 mb-4">⚙️</div>
                <div className="text-lg text-gray-500">{service.category}</div>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
                {service.badge && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {service.badge}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {service.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {service.description}
              </p>
            </div>

            {/* Price */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center text-gray-600 mb-2">
                <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                Starting Price
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ETB {service.priceETB.toLocaleString()}
              </div>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                <div className="grid grid-cols-1 gap-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div>
              <Link
                href={`/contact?service=${service.title}`}
                className="inline-flex items-center w-full justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Request Quote
              </Link>
              <p className="mt-2 text-sm text-gray-500 text-center">
                <ShieldCheckIcon className="inline h-4 w-4 mr-1" />
                100% Satisfaction Guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Overview</h2>
              <div className="prose prose-lg text-gray-600">
                <p>{service.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Service Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Category</dt>
                  <dd className="text-sm font-medium text-gray-900">{service.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Price</dt>
                  <dd className="text-sm font-medium text-gray-900">ETB {service.priceETB.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Status</dt>
                  <dd className="text-sm font-medium text-green-600">Available</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Services</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedService: any) => (
                <Link
                  key={relatedService._id}
                  href={`/services/${relatedService._id}`}
                  className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {relatedService.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{relatedService.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      ETB {relatedService.priceETB?.toLocaleString() || '0'}
                    </div>
                    {relatedService.badge && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                        {relatedService.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
