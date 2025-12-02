import Link from 'next/link';
import { ShoppingCartIcon, StarIcon, TagIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Mock data - will be replaced with real data later
const products = [
  {
    id: 1,
    name: 'Complete Web Development Course',
    description: 'Master modern web development with React, Next.js, and TypeScript. Includes 50+ hours of video content.',
    category: 'Course',
    price: 5500,
    originalPrice: 8250,
    discount: 33,
    rating: 4.9,
    reviews: 342,
    students: 1250,
    image: '/api/placeholder/400/300',
    bestseller: true,
    new: false,
    tags: ['Web Development', 'React', 'Next.js', 'TypeScript'],
    format: 'Video Course',
    downloadable: true,
    updates: 'Lifetime',
  },
  {
    id: 2,
    name: 'UI/UX Design System Template',
    description: 'Professional design system with 100+ components, color palettes, and typography guides.',
    category: 'Template',
    price: 2750,
    originalPrice: 4400,
    discount: 38,
    rating: 4.8,
    reviews: 189,
    students: 567,
    image: '/api/placeholder/400/300',
    bestseller: true,
    new: false,
    tags: ['Design', 'Figma', 'UI/UX', 'Components'],
    format: 'Figma File',
    downloadable: true,
    updates: '1 Year',
  },
  {
    id: 3,
    name: 'Full-Stack SaaS Starter Kit',
    description: 'Production-ready SaaS template with authentication, payments, dashboard, and more.',
    category: 'Template',
    price: 11000,
    originalPrice: 16500,
    discount: 33,
    rating: 5.0,
    reviews: 156,
    students: 423,
    image: '/api/placeholder/400/300',
    bestseller: false,
    new: true,
    tags: ['SaaS', 'Next.js', 'Stripe', 'Authentication'],
    format: 'Source Code',
    downloadable: true,
    updates: 'Lifetime',
  },
  {
    id: 4,
    name: 'Advanced TypeScript Masterclass',
    description: 'Deep dive into TypeScript with advanced patterns, generics, and real-world applications.',
    category: 'Course',
    price: 4400,
    originalPrice: 6600,
    discount: 33,
    rating: 4.7,
    reviews: 234,
    students: 891,
    image: '/api/placeholder/400/300',
    bestseller: false,
    new: false,
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    format: 'Video Course',
    downloadable: true,
    updates: 'Lifetime',
  },
  {
    id: 5,
    name: 'E-Commerce Website Template',
    description: 'Complete e-commerce solution with product catalog, cart, checkout, and admin panel.',
    category: 'Template',
    price: 8250,
    originalPrice: 13750,
    discount: 40,
    rating: 4.9,
    reviews: 267,
    students: 634,
    image: '/api/placeholder/400/300',
    bestseller: true,
    new: false,
    tags: ['E-commerce', 'Next.js', 'Tailwind', 'Stripe'],
    format: 'Source Code',
    downloadable: true,
    updates: 'Lifetime',
  },
  {
    id: 6,
    name: 'Mobile App Development Guide',
    description: 'Learn to build cross-platform mobile apps with React Native and Expo.',
    category: 'Course',
    price: 4950,
    originalPrice: 7150,
    discount: 31,
    rating: 4.8,
    reviews: 198,
    students: 745,
    image: '/api/placeholder/400/300',
    bestseller: false,
    new: true,
    tags: ['React Native', 'Mobile', 'iOS', 'Android'],
    format: 'Video Course',
    downloadable: true,
    updates: 'Lifetime',
  },
  {
    id: 7,
    name: 'Icon Pack - 500+ Premium Icons',
    description: 'High-quality icon set with 500+ icons in multiple formats (SVG, PNG, Figma).',
    category: 'Asset',
    price: 1650,
    originalPrice: 2750,
    discount: 40,
    rating: 4.6,
    reviews: 445,
    students: 1567,
    image: '/api/placeholder/400/300',
    bestseller: false,
    new: false,
    tags: ['Icons', 'Design', 'SVG', 'Assets'],
    format: 'Digital Assets',
    downloadable: true,
    updates: '6 Months',
  },
  {
    id: 8,
    name: 'DevOps & CI/CD Complete Course',
    description: 'Master DevOps practices, Docker, Kubernetes, and CI/CD pipelines.',
    category: 'Course',
    price: 6050,
    originalPrice: 8800,
    discount: 31,
    rating: 4.9,
    reviews: 312,
    students: 892,
    image: '/api/placeholder/400/300',
    bestseller: true,
    new: false,
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
    format: 'Video Course',
    downloadable: true,
    updates: 'Lifetime',
  },
];

const categories = ['All', 'Course', 'Template', 'Asset'];
const sortOptions = ['Popular', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating'];

export default function StorePage() {
  const featuredProducts = products.filter(product => product.bestseller);
  const newProducts = products.filter(product => product.new);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--brand-dark)] via-[var(--brand-dark)] to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--brand-primary)]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-6 sm:pt-32 sm:pb-8 w-full">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-md mb-6">
              <ShoppingCartIcon className="h-3 w-3 text-[var(--brand-primary)]" />
              Digital Store
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-4">
              <span className="bg-gradient-to-r from-white via-white to-[var(--brand-primary)] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(38,66,254,0.25)]">
                Premium Digital Products
              </span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
              Accelerate your development journey with premium courses, templates, and digital assets. 
              One-time purchase, lifetime access.
            </p>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="group">
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--brand-primary)] transition-colors">2000+</div>
                <div className="text-xs text-white/70">Happy Customers</div>
              </div>
              <div className="group">
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--brand-primary)] transition-colors">4.8★</div>
                <div className="text-xs text-white/70">Average Rating</div>
              </div>
              <div className="group">
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--brand-primary)] transition-colors">50+</div>
                <div className="text-xs text-white/70">Products</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[var(--brand-dark)]">🔥 Bestsellers</h2>
            <Link href="#all-products" className="text-sm font-medium text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/store/${product.id}`}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.bestseller && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="aspect-w-16 aspect-h-9">
                  <div className="w-full h-48 bg-gradient-to-br from-[var(--brand-primary)]/10 to-cyan-500/10 flex items-center justify-center group-hover:from-[var(--brand-primary)]/20 group-hover:to-cyan-500/20 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2 group-hover:scale-110 transition-transform duration-300">📦</div>
                      <div className="text-sm text-gray-500">Digital Product</div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-[var(--brand-dark)] mb-2 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        ETB {product.price.toLocaleString()}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          ETB {product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <button className="p-2 bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 text-white rounded-full hover:opacity-90 transition-opacity shadow-lg">
                      <ShoppingCartIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--brand-dark)] mb-8">✨ New Arrivals</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/store/${product.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-cyan-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🆕</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[var(--brand-dark)] mb-1 line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">ETB {product.price.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-gray-600">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          {product.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort */}
      <div id="all-products" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === 'All'
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <select className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* All Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/store/${product.id}`}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.new && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                    New
                  </span>
                )}
                {product.bestseller && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm">
                    Bestseller
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Image */}
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-48 bg-gradient-to-br from-[var(--brand-primary)]/10 to-cyan-500/10 flex items-center justify-center group-hover:from-[var(--brand-primary)]/20 group-hover:to-cyan-500/20 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2 group-hover:scale-110 transition-transform duration-300">
                      {product.category === 'Course' ? '🎓' : product.category === 'Template' ? '🎨' : '📁'}
                    </div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                    {product.format}
                  </span>
                </div>
                
                <h3 className="text-base font-semibold text-[var(--brand-dark)] mb-2 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">
                        ${product.originalPrice}
                      </div>
                    )}
                  </div>
                  <button className="p-2 bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 text-white rounded-full hover:opacity-90 transition-opacity shadow-lg">
                    <ShoppingCartIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="bg-gradient-to-r from-[#2642fe] to-cyan-500 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              I create custom courses and templates based on demand. Let me know what you need!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-[#2642fe] shadow-sm hover:bg-gray-50 transition-colors"
            >
              Request Custom Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
