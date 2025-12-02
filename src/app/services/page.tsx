'use client';
import Link from 'next/link';
import { useState } from 'react';
import { 
  StarIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  CheckIcon, 
  ArrowRightIcon,
  SparklesIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CpuChipIcon,
  LightBulbIcon,
  FireIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

// Service categories with enhanced data
const serviceCategories = [
  {
    id: 'web-dev',
    title: 'Web Development',
    icon: CodeBracketIcon,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Build modern, high-performance, and visually stunning websites.',
    services: [
      {
        id: 1,
        title: 'Website Launch Pack',
        description: 'Complete website solution from design to deployment',
        features: [
          'Custom responsive design (Next.js + Tailwind)',
          'SEO optimization (meta tags, keywords, schema)',
          'Domain setup + hosting (Vercel / Netlify)',
          'Contact form & live chat integration',
          'Admin dashboard (optional)'
        ],
        tiers: ['Basic', 'Standard', 'Pro'],
        perfectFor: 'Businesses, creators, and personal brands',
        icon: GlobeAltIcon,
        color: 'blue'
      },
      {
        id: 2,
        title: 'Web App Development',
        description: 'Full-stack web applications with modern architecture',
        features: [
          'Full-stack web app (React/Next.js frontend, API backend)',
          'Authentication (login/signup)',
          'Database integration (Supabase / MongoDB / MySQL)',
          'Admin + user panels',
          'Notification & analytics system'
        ],
        tiers: ['Starter', 'Growth', 'Enterprise'],
        perfectFor: 'Startups, management systems, and SaaS ideas',
        icon: CpuChipIcon,
        color: 'purple'
      },
      {
        id: 3,
        title: 'Website Maintenance & Support',
        description: 'Keep your website running smoothly and securely',
        features: [
          'Regular updates and fixes',
          'Backup and security monitoring',
          'Performance optimization',
          'SEO health checks',
          'Content upload support'
        ],
        tiers: ['Basic', 'Pro', 'Ultimate'],
        perfectFor: 'Any live business site',
        icon: ShieldCheckIcon,
        color: 'green'
      }
    ]
  },
  {
    id: 'design',
    title: 'Design & Branding',
    icon: PaintBrushIcon,
    gradient: 'from-pink-500 to-rose-500',
    description: 'Beautiful visuals that connect, convert, and inspire.',
    services: [
      {
        id: 4,
        title: 'Brand Identity Design',
        description: 'Complete brand identity package for your business',
        features: [
          'Logo design (3–5 concepts)',
          'Color palette & typography',
          'Brand style guide (PDF)',
          'Social media kit (profile, banner, post templates)'
        ],
        tiers: ['Starter', 'Complete', 'Premium'],
        perfectFor: 'Startups, small businesses, influencers',
        icon: SparklesIcon,
        color: 'pink'
      },
      {
        id: 5,
        title: 'Graphic Design Studio',
        description: 'Professional graphic design for all your needs',
        features: [
          'Posters, flyers, banners, business cards',
          'Product packaging mockups',
          'Social media post designs',
          'Event and promotional materials'
        ],
        tiers: ['Per Design', 'Bundle'],
        perfectFor: 'Creators, marketers, and local businesses',
        icon: PaintBrushIcon,
        color: 'rose'
      }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    icon: DevicePhoneMobileIcon,
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Cross-platform mobile applications that work everywhere.',
    services: [
      {
        id: 6,
        title: 'React Native App Development',
        description: 'Build once, run everywhere - iOS and Android',
        features: [
          'Cross-platform (Android + iOS)',
          'API integration',
          'Authentication + database',
          'Push notifications',
          'Play Store setup'
        ],
        tiers: ['MVP', 'Full', 'Pro'],
        perfectFor: 'Startup apps, portfolio projects',
        icon: DevicePhoneMobileIcon,
        color: 'emerald'
      }
    ]
  }
];

// Bundled packages
const bundledPackages = [
  {
    name: 'Starter Brand Kit',
    includes: ['Logo + Color + Font + Social templates'],
    idealFor: 'Personal brands & startups',
    price: 'From $299',
    icon: SparklesIcon,
    gradient: 'from-yellow-400 to-orange-500',
    popular: false
  },
  {
    name: 'Full Website Launch',
    includes: ['Design + Development + Hosting + SEO'],
    idealFor: 'Businesses, creators',
    price: 'From ETB 71,500',
    icon: RocketLaunchIcon,
    gradient: 'from-blue-500 to-purple-600',
    popular: true
  },
  {
    name: 'Creator Booster Pack',
    includes: ['YouTube banner + thumbnail + social kit'],
    idealFor: 'Influencers & YouTubers',
    price: 'From ETB 11,000',
    icon: FireIcon,
    gradient: 'from-red-500 to-pink-500',
    popular: false
  },
  {
    name: 'Business Bundle',
    includes: ['Website + Logo + Flyer + Business Card'],
    idealFor: 'SMEs, shops, agencies',
    price: 'From ETB 49,500',
    icon: TrophyIcon,
    gradient: 'from-green-500 to-emerald-600',
    popular: false
  },
  {
    name: 'Maintenance Plan',
    includes: ['Monthly backup, fix, and update'],
    idealFor: 'Any active website owner',
    price: 'From ETB 5,500/month',
    icon: ShieldCheckIcon,
    gradient: 'from-gray-500 to-slate-600',
    popular: false
  }
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('web-dev');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-dark)] via-[var(--brand-dark)] to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--brand-primary)]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 px-6 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-md mb-8">
              <SparklesIcon className="h-5 w-5 text-[var(--brand-primary)]" />
              Professional Services Portfolio
            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
              <span className="bg-gradient-to-r from-white via-white to-[var(--brand-primary)] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(38,66,254,0.25)]">
                DINOVERSE
              </span>
              <br />
              <span className="text-3xl sm:text-4xl font-bold text-white/90 mt-4 block">
                SERVICE PORTFOLIO
              </span>
            </h1>

            {/* Tagline */}
            <div className="relative">
              <p className="text-xl sm:text-2xl font-medium text-white/80 leading-relaxed max-w-3xl mx-auto">
                "Where Design Meets Development — Crafting Ideas into Digital Reality."
              </p>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-[var(--brand-primary)] rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping delay-500"></div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-[var(--brand-primary)] transition-colors">50+</div>
                <div className="text-sm text-white/70">Projects Delivered</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-[var(--brand-primary)] transition-colors">4.9★</div>
                <div className="text-sm text-white/70">Client Rating</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-[var(--brand-primary)] transition-colors">100%</div>
                <div className="text-sm text-white/70">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex justify-center">
            <div className="flex rounded-2xl bg-gray-100/50 p-1 backdrop-blur-sm">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-white text-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      {serviceCategories.map((category) => (
        <section key={category.id} className={`py-24 ${activeCategory === category.id ? 'block' : 'hidden'}`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Category Header */}
            <div className="text-center mb-16">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.gradient} mb-6`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{category.title}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{category.description}</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {category.services.map((service) => (
                <div key={service.id} className="group relative">
                  {/* Main Card */}
                  <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200/50 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2">
                    {/* Gradient Header */}
                    <div className={`h-32 bg-gradient-to-br ${service.color === 'blue' ? 'from-blue-500 to-cyan-500' : 
                      service.color === 'purple' ? 'from-purple-500 to-pink-500' :
                      service.color === 'green' ? 'from-emerald-500 to-teal-500' :
                      service.color === 'pink' ? 'from-pink-500 to-rose-500' :
                      service.color === 'rose' ? 'from-rose-500 to-pink-500' :
                      'from-emerald-500 to-teal-500'} relative overflow-hidden`}>
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute top-4 right-4">
                        <div className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
                          <service.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-white">
                          <div className="text-2xl font-bold">{service.title}</div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                              <CheckIcon className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tiers */}
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-900 mb-2">Available Tiers:</div>
                        <div className="flex flex-wrap gap-2">
                          {service.tiers.map((tier, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {tier}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Perfect For */}
                      <div className="mb-6 p-4 rounded-2xl bg-gray-50">
                        <div className="text-sm font-medium text-gray-900 mb-1">Perfect for:</div>
                        <div className="text-sm text-gray-600">{service.perfectFor}</div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/services/${service.id}`}
                        className={`block w-full text-center py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                          service.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' :
                          service.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' :
                          service.color === 'green' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' :
                          service.color === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' :
                          service.color === 'rose' ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600' :
                          'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                        }`}
                      >
                        Get Started
                        <ArrowRightIcon className="inline-block ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Bundled Packages Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bundled Packages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All-in-one packs with full value. Recommended for clients who want comprehensive solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bundledPackages.map((pkg, index) => (
              <div key={index} className={`group relative ${pkg.popular ? 'lg:scale-105' : ''}`}>
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`relative overflow-hidden rounded-3xl bg-white border-2 ${
                  pkg.popular ? 'border-[var(--brand-primary)] shadow-2xl shadow-[var(--brand-primary)]/20' : 'border-gray-200/50 shadow-lg shadow-gray-200/50'
                } hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2`}>
                  
                  {/* Gradient Header */}
                  <div className={`h-24 bg-gradient-to-br ${pkg.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <pkg.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-white">
                        <div className="text-lg font-bold">{pkg.name}</div>
                        <div className="text-sm opacity-90">{pkg.price}</div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">Includes:</div>
                      <div className="text-sm text-gray-600">{pkg.includes.join(', ')}</div>
                    </div>

                    <div className="mb-6 p-3 rounded-xl bg-gray-50">
                      <div className="text-sm font-medium text-gray-900 mb-1">Ideal for:</div>
                      <div className="text-sm text-gray-600">{pkg.idealFor}</div>
                    </div>

                    <Link
                      href="/contact"
                      className={`block w-full text-center py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r ${pkg.gradient} hover:opacity-90`}
                    >
                      Choose Package
                      <ArrowRightIcon className="inline-block ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[var(--brand-dark)] to-slate-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--brand-primary)]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 mb-8">
            <LightBulbIcon className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Don't see exactly what you need? Let's discuss your project and create a custom solution 
            tailored to your unique requirements and business goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[var(--brand-primary)] text-white font-semibold shadow-lg shadow-[var(--brand-primary)]/30 hover:shadow-xl hover:shadow-[var(--brand-primary)]/40 transition-all duration-300 hover:scale-105"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Get Custom Quote
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/10 text-white font-semibold border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
            >
              <HeartIcon className="h-5 w-5 mr-2" />
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}