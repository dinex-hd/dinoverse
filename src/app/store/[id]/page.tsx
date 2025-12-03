import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, StarIcon, ShoppingCartIcon, CheckIcon, ClockIcon, ArrowDownTrayIcon, ArrowPathIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';

async function getProduct(id: string) {
  await connectToDatabase();

  // Try to find by ID first, then by slug
  let product = await Product.findOne({
    _id: id,
    active: true,
  }).lean();

  if (!product) {
    product = await Product.findOne({
      slug: id,
      active: true,
    }).lean();
  }

  if (!product) return null;

  // Get related products
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    active: true,
  })
    .limit(4)
    .select('name slug description image price originalPrice discount rating reviews category bestseller new')
    .sort({ order: -1, createdAt: -1 })
    .lean();

  return { product, related };
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const data = await getProduct(id);

  if (!data) {
    notFound();
  }

  const { product, related } = data;

  // Format long description with paragraphs
  const formatDescription = (text: string) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map((para, i) => (
      <p key={i} className={i > 0 ? 'mt-4' : ''}>
        {para}
      </p>
    ));
  };

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <Link
          href="/store"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Store
        </Link>
      </div>

      {/* Product Header */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-w-16 aspect-h-9">
            {product.image && product.image.trim() && product.image.startsWith('http') ? (
              <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-400 mb-4">
                    {product.category === 'Course' ? '🎓' : product.category === 'Template' ? '🎨' : '📁'}
                  </div>
                  <div className="text-lg text-gray-500">{product.category}</div>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {product.category}
                </span>
                {product.bestseller && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    🔥 Bestseller
                  </span>
                )}
                {product.new && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✨ New
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Rating and Students */}
            {(product.rating || product.students) && (
              <div className="flex items-center space-x-6">
                {product.rating && (
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-lg font-medium text-gray-900">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.reviews && (
                      <span className="ml-2 text-gray-600">
                        ({product.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}
                {product.students && (
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="mr-2 h-5 w-5" />
                    {product.students.toLocaleString()} students
                  </div>
                )}
              </div>
            )}

            {/* Price */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    ETB {product.price.toLocaleString()}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">
                        ETB {product.originalPrice.toLocaleString()}
                      </span>
                      {product.discount && (
                        <span className="text-sm font-medium text-red-600">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-3">
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              
              <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Buy Now
              </button>

              <p className="mt-4 text-center text-sm text-gray-600">
                <ShieldCheckIcon className="inline h-4 w-4 mr-1" />
                30-day money-back guarantee
              </p>
            </div>

            {/* What's Included */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This product includes:</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.format && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                    {product.format}
                  </div>
                )}
                {product.downloadable && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                    Downloadable
                  </div>
                )}
                {product.updates && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ArrowPathIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                    {product.updates} Updates
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                  Lifetime Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {product.longDescription && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This {product.category}</h2>
                <div className="prose prose-lg text-gray-600">
                  {formatDescription(product.longDescription)}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Sticky Buy Box */}
            <div className="sticky top-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ETB {product.price.toLocaleString()}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg text-gray-500 line-through">
                    ETB {product.originalPrice.toLocaleString()}
                  </span>
                  {product.discount && (
                    <span className="text-sm font-medium text-red-600">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              )}

              <button className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-3">
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              
              <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors mb-4">
                Buy Now
              </button>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                  <ShieldCheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  30-day money-back guarantee
                </p>
                <p className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4 text-green-500" />
                  Lifetime access
                </p>
                {product.updates && (
                  <p className="flex items-center">
                    <ArrowPathIcon className="mr-2 h-4 w-4 text-green-500" />
                    {product.updates} updates
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((relatedProduct: any) => (
                <Link
                  key={relatedProduct._id}
                  href={`/store/${relatedProduct.slug || relatedProduct._id}`}
                  className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedProduct.image && relatedProduct.image.trim() && relatedProduct.image.startsWith('http') ? (
                    <div className="w-full h-32 bg-gray-100 overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-3xl">
                        {relatedProduct.category === 'Course' ? '🎓' : relatedProduct.category === 'Template' ? '🎨' : '📁'}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-xs font-medium text-blue-600">{relatedProduct.category}</span>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-base font-bold text-gray-900">
                        ETB {relatedProduct.price.toLocaleString()}
                      </div>
                      {relatedProduct.rating && (
                        <div className="flex items-center text-xs text-gray-600">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          {relatedProduct.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
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
