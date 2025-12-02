'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

type QuickService = {
  _id: string;
  title: string;
  description: string;
  href: string;
  icon: any;
  bgColor: string;
  textColor: string;
};

const iconMap: Record<string, any> = {
  web: CodeBracketIcon,
  code: CodeBracketIcon,
  mobile: DevicePhoneMobileIcon,
  design: PaintBrushIcon,
};

const bgMap: Record<string, { bg: string; text: string }> = {
  web: { bg: 'bg-blue-50', text: 'text-blue-600' },
  mobile: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  design: { bg: 'bg-pink-50', text: 'text-pink-600' },
  default: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function FloatingServiceWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [services, setServices] = useState<QuickService[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 1024) {
        setIsVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/services?section=homepage&limit=3');
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.items)) {
          setServices(
            json.items.slice(0, 3).map((item: any) => {
              const key = item.icon || item.category?.toLowerCase();
              const Icon = iconMap[key || 'web'] || CodeBracketIcon;
              const palette = bgMap[key || 'default'] || bgMap.default;
              return {
                _id: item._id,
                title: item.title,
                description: item.description,
                href: `/services/${item._id}`,
                icon: Icon,
                bgColor: palette.bg,
                textColor: palette.text,
              };
            }),
          );
        }
      } catch (err) {
        console.warn('Floating widget services failed', err);
        setServices([]);
      }
    })();
  }, []);

  if (!isVisible || services.length === 0) return null;

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        {!isExpanded ? (
          // Collapsed State - Floating Button
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 shadow-lg shadow-[var(--brand-primary)]/30 hover:shadow-xl hover:shadow-[var(--brand-primary)]/40 transition-all duration-300 hover:scale-110"
          >
            <SparklesIcon className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-[var(--brand-primary)] animate-ping opacity-20"></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                View Services
              </div>
            </div>
          </button>
        ) : (
          // Expanded State - Service Cards
          <div className="relative">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsExpanded(false)}
            />
            
            {/* Service Cards */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-4 w-72 max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Quick Services</h3>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Services */}
              <div className="space-y-3">
                {services.map((service) => (
                  <Link
                    key={service._id}
                    href={service.href}
                    onClick={() => setIsExpanded(false)}
                    className="group block rounded-xl border border-gray-200 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${service.bgColor} transition-transform duration-200 group-hover:scale-110`}>
                        <service.icon className={`h-5 w-5 ${service.textColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{service.description}</div>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--brand-primary)]" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <Link
                  href="/services"
                  onClick={() => setIsExpanded(false)}
                  className="block w-full text-center py-2 rounded-lg bg-gradient-to-r from-[var(--brand-primary)] to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
