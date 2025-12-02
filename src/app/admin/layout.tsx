"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  StarIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  PhotoIcon,
  RectangleStackIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, category: 'main' },
    { name: 'Contacts', href: '/admin/contacts', icon: ChatBubbleLeftRightIcon, category: 'main' },
    { name: 'Services', href: '/admin/services', icon: BriefcaseIcon, category: 'content' },
    { name: 'Portfolio', href: '/admin/portfolio', icon: PhotoIcon, category: 'content' },
    { name: 'Blog', href: '/admin/blog', icon: DocumentTextIcon, category: 'content' },
    { name: 'Store', href: '/admin/store', icon: ShoppingBagIcon, category: 'content' },
    { name: 'Testimonials', href: '/admin/testimonials', icon: StarIcon, category: 'content' },
    { name: 'Features', href: '/admin/features', icon: SparklesIcon, category: 'content' },
    { name: 'Partners', href: '/admin/partners', icon: BuildingOfficeIcon, category: 'content' },
    { name: 'Homepage Content', href: '/admin/content', icon: RectangleStackIcon, category: 'content' },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, category: 'system' },
  ];

  const groupedNav = {
    main: nav.filter(n => n.category === 'main'),
    content: nav.filter(n => n.category === 'content'),
    system: nav.filter(n => n.category === 'system'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div className="font-semibold text-[#010333]">Dinoverse Admin</div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:inline px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">View Site</Link>
            <form action="/api/admin/login" method="post">
              <button
                formAction="/api/admin/login"
                formMethod="DELETE"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Shell with sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className={`bg-white border border-gray-200 rounded-xl shadow-sm p-3 h-max sticky top-20 ${sidebarOpen ? '' : 'hidden'} lg:block`}>
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href ? 'bg-blue-50 text-[#2642fe] border border-blue-100' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-h-[60vh]">{children}</main>
      </div>
    </div>
  );
}
