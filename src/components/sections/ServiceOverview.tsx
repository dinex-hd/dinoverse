"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  ArrowRightIcon,
  CheckIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

type DbService = {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  priceETB: number;
  features: string[];
  badge?: string;
};

const iconMap: Record<string, any> = {
  code: CodeBracketIcon,
  web: CodeBracketIcon,
  mobile: DevicePhoneMobileIcon,
  design: PaintBrushIcon,
  analytics: ChartBarIcon,
  trading: CurrencyDollarIcon,
};

const gradientMap: Record<string, string> = {
  mobile: 'from-emerald-500 to-teal-500',
  design: 'from-pink-500 to-rose-500',
  analytics: 'from-sky-500 to-blue-500',
  trading: 'from-amber-500 to-orange-500',
  default: 'from-blue-500 to-cyan-500',
};

export default function ServiceOverview() {
  const [homepageServices, setHomepageServices] = useState<DbService[]>([]);
  const [packageServices, setPackageServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [homepageRes, packagesRes] = await Promise.all([
          fetch('/api/services?section=homepage'),
          fetch('/api/services?section=packages'),
        ]);
        if (homepageRes.ok) {
          const json = await homepageRes.json();
          setHomepageServices(Array.isArray(json.items) ? json.items : []);
        }
        if (packagesRes.ok) {
          const json = await packagesRes.json();
          setPackageServices(Array.isArray(json.items) ? json.items : []);
        }
      } catch (err) {
        console.warn('ServiceOverview fetch failed', err);
        setHomepageServices([]);
        setPackageServices([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderServiceCards = () =>
    homepageServices.map((service) => {
      const iconKey = service.icon || service.category?.toLowerCase();
      const Icon = iconMap[iconKey || 'web'] || CodeBracketIcon;
      const gradient = gradientMap[iconKey || 'default'] || gradientMap.default;
      return (
        <div key={service._id} className="relative">
          {service.badge && (
            <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
              <div className="rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                {service.badge}
              </div>
            </div>
          )}
          <Link
            href={`/services/${service._id}`}
            className="group relative block overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--brand-primary)]/60 hover:shadow-2xl"
          >
            <div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
            <div className="relative">
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} text-white`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#010333] group-hover:text-[var(--brand-primary)] transition-colors">{service.title}</h3>
              <p className="mt-3 text-gray-600">{service.description}</p>
              {service.features?.length > 0 ? (
                <div className={`mt-6 ${service.features.length > 4 ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon className="h-3 w-3 text-green-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-500">Add bullet points for this service inside Admin → Services.</p>
              )}
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-[#010333]">From ETB {service.priceETB?.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Starting price</div>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-[var(--brand-primary)] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      );
    });

  const renderPackages = () =>
    packageServices.map((service) => (
      <div key={service._id} className="relative">
        {service.badge && (
          <div className="absolute -top-3 right-4 z-10">
            <div className="rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              {service.badge}
            </div>
          </div>
        )}
        <Link
          href={`/services/${service._id}`}
          className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/40 hover:shadow-xl"
        >
          <div className="relative">
            <h4 className="text-lg font-semibold text-[#010333] group-hover:text-[var(--brand-primary)]">{service.title}</h4>
            <p className="mt-2 text-sm text-gray-600">{service.description}</p>
            <div className="mt-4 space-y-1">
              {service.features?.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="h-1 w-1 rounded-full bg-[var(--brand-primary)]" />
                  {feature}
                </div>
              ))}
              {!service.features?.length && (
                <div className="text-xs text-gray-400">Add package bullets via Admin → Services (section: packages).</div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-lg font-bold text-[#010333]">From ETB {service.priceETB?.toLocaleString()}</div>
              <ArrowRightIcon className="h-4 w-4 text-[var(--brand-primary)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    ));

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#010333] sm:text-5xl">What I Build</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Every card below comes from the Services collection — update them in the admin panel to change what visitors see instantly.
          </p>
        </div>

        {loading && <div className="mt-10 text-center text-gray-500">Loading services…</div>}

        {!loading && (
          <>
            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {homepageServices.length ? (
                renderServiceCards()
              ) : (
                <div className="col-span-full rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                  Assign services to the “Homepage” section inside <span className="font-semibold text-[#2642fe]">Admin → Services</span> to populate this grid.
                </div>
              )}
            </div>

            <div className="mt-20">
              <div className="mb-12 text-center">
                <h3 className="text-2xl font-bold text-[#010333]">Popular Packages</h3>
                <p className="text-gray-600">These are services tagged with the “Packages” display section.</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {packageServices.length ? (
                  renderPackages()
                ) : (
                  <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                    No packages yet. Mark services as “Packages” in Admin → Services to surface them here.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Explore All Services
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
