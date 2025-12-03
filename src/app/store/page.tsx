'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCartIcon, StarIcon, TagIcon, FunnelIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  rating?: number;
  reviews?: number;
  students?: number;
  tags: string[];
  format?: string;
  bestseller: boolean;
  new: boolean;
  featured: boolean;
};

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Popular');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    async function loadProducts() {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') {
          params.set('category', selectedCategory);
        }
        const res = await fetch(`/api/store?${params.toString()}`);
        const json = await res.json();
        if (json.ok) {
          const items = json.items || [];
          setProducts(items);
          // Extract unique categories
          const uniqueCategories = ['All', ...Array.from(new Set(items.map((p: Product) => p.category)))] as string[];
          setCategories(uniqueCategories);
        }
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory]);

  const featuredProducts = products.filter((p) => p.bestseller);
  const newProducts = products.filter((p) => p.new);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Newest':
        return 0; // Already sorted by createdAt in API
      case 'Best Rating':
        return (b.rating || 0) - (a.rating || 0);
      default: // Popular
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (b.reviews || 0) - (a.reviews || 0);
    }
  });

  if (loading) {
    return (
      <div className="bg-white pt-24 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 text-center">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--brand-dark)] via-[var(--brand-dark)] to-slate-900 relative overflow-hidden">
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
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--brand-primary)] transition-colors">{products.length}+</div>
                <div className="text-xs text-white/70">Products</div>
              </div>
              <div className="group">
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--brand-primary)] transition-colors">
                  {products.length > 0 ? (products.reduce((sum, p) => sum + (p.reviews || 0), 0) / products.length).toFixed(1) : '4.8'}★
                </div>
                <div className="text-xs text-white/70">Average Rating</div>
              </div>
              <div className="group">
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--brand-primary)] transition-colors">
                  {products.reduce((sum, p) => sum + (p.students || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-white/70">Total Students</div>
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
                key={product._id}
                href={`/store/${product.slug || product._id}`}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.bestseller && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.discount && product.discount > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Image */}
                {product.image && product.image.trim() && product.image.startsWith('http') ? (
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[var(--brand-primary)]/10 to-cyan-500/10 flex items-center justify-center group-hover:from-[var(--brand-primary)]/20 group-hover:to-cyan-500/20 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2 group-hover:scale-110 transition-transform duration-300">📦</div>
                      <div className="text-sm text-gray-500">Digital Product</div>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-[var(--brand-dark)] mb-2 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                    {product.name}
                  </h3>

                  {product.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-600">
                        {product.rating.toFixed(1)} ({product.reviews || 0})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        ETB {product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
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
                  key={product._id}
                  href={`/store/${product.slug || product._id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex gap-4">
                    {product.image && product.image.trim() && product.image.startsWith('http') ? (
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-cyan-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🆕</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[var(--brand-dark)] mb-1 line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">ETB {product.price.toLocaleString()}</div>
                        {product.rating && (
                          <div className="flex items-center text-xs text-gray-600">
                            <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            {product.rating.toFixed(1)}
                          </div>
                        )}
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
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
          >
            <option>Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Best Rating</option>
          </select>
        </div>

        {/* All Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products yet</h2>
            <p className="text-gray-600">
              Check back soon for new products, courses, and templates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <Link
                key={product._id}
                href={`/store/${product.slug || product._id}`}
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
                  {product.discount && product.discount > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Image */}
                {product.image && product.image.trim() && product.image.startsWith('http') ? (
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[var(--brand-primary)]/10 to-cyan-500/10 flex items-center justify-center group-hover:from-[var(--brand-primary)]/20 group-hover:to-cyan-500/20 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2 group-hover:scale-110 transition-transform duration-300">
                        {product.category === 'Course' ? '🎓' : product.category === 'Template' ? '🎨' : '📁'}
                      </div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                      {product.format || product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-[var(--brand-dark)] mb-2 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {product.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-600">
                        {product.rating.toFixed(1)} ({product.reviews || 0})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        ETB {product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
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
        )}
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
