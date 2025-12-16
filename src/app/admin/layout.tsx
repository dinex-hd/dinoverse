"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  ChevronRightIcon,
  ChartBarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  StarIcon as StarIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  PhotoIcon as PhotoIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  SparklesIcon as SparklesIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  iconSolid: any;
  category: 'main' | 'content' | 'system' | 'life';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['main']));

  const nav: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid, category: 'main' },
    { name: 'Contacts', href: '/admin/contacts', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid, category: 'main' },
    { name: 'Services', href: '/admin/services', icon: BriefcaseIcon, iconSolid: BriefcaseIconSolid, category: 'content' },
    { name: 'Portfolio', href: '/admin/portfolio', icon: PhotoIcon, iconSolid: PhotoIconSolid, category: 'content' },
    { name: 'Blog', href: '/admin/blog', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid, category: 'content' },
    { name: 'Store', href: '/admin/store', icon: ShoppingBagIcon, iconSolid: ShoppingBagIconSolid, category: 'content' },
    { name: 'Testimonials', href: '/admin/testimonials', icon: StarIcon, iconSolid: StarIconSolid, category: 'content' },
    { name: 'Features', href: '/admin/features', icon: SparklesIcon, iconSolid: SparklesIconSolid, category: 'content' },
    { name: 'Partners', href: '/admin/partners', icon: BuildingOfficeIcon, iconSolid: BuildingOfficeIconSolid, category: 'content' },
    { name: 'Homepage Content', href: '/admin/content', icon: RectangleStackIcon, iconSolid: RectangleStackIconSolid, category: 'content' },
    { name: 'Life OS Dashboard', href: '/admin/life', icon: ChartBarIcon, iconSolid: ChartBarIconSolid, category: 'life' },
    { name: 'Trading Journal', href: '/admin/life/trading', icon: RectangleStackIcon, iconSolid: RectangleStackIconSolid, category: 'life' },
    { name: 'Income & Expenses', href: '/admin/life/finance', icon: BanknotesIcon, iconSolid: BanknotesIconSolid, category: 'life' },
    { name: 'Goals & Habits', href: '/admin/life/goals', icon: CheckCircleIcon, iconSolid: CheckCircleIconSolid, category: 'life' },
    { name: 'Rules & Reflections', href: '/admin/life/rules', icon: ClipboardDocumentCheckIcon, iconSolid: ClipboardDocumentCheckIconSolid, category: 'life' },
    { name: 'Quotes', href: '/admin/life/quotes', icon: SparklesIcon, iconSolid: SparklesIconSolid, category: 'life' },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, category: 'system' },
  ];

  const categoryLabels: Record<string, string> = {
    main: 'Main',
    content: 'Content',
    life: 'Life OS',
    system: 'System',
  };

  const categoryColors: Record<string, string> = {
    main: 'from-blue-500 to-cyan-500',
    content: 'from-purple-500 to-pink-500',
    life: 'from-emerald-500 to-cyan-400',
    system: 'from-orange-500 to-red-500',
  };

  const groupedNav = {
    main: nav.filter(n => n.category === 'main'),
    content: nav.filter(n => n.category === 'content'),
    life: nav.filter(n => n.category === 'life'),
    system: nav.filter(n => n.category === 'system'),
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header/Headbar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#010333] via-[#1a1f4a] to-[#010333] border-b border-[#2642fe]/20 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Left: Logo & Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="h-6 w-6 text-white" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-white" />
                )}
              </button>
              
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#2642fe] to-cyan-400 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg text-white">
                    Dinoverse Admin
                  </div>
                  <div className="text-xs text-white/70">Control Panel</div>
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm font-medium text-white bg-white/10 hover:bg-white/20 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View Site</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <SidebarContent
                nav={nav}
                pathname={pathname}
                groupedNav={groupedNav}
                categoryLabels={categoryLabels}
                categoryColors={categoryColors}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="flex">
        <aside className="hidden lg:block w-72 shrink-0 bg-white border-r border-gray-200 shadow-sm">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4">
              <SidebarContent
                nav={nav}
                pathname={pathname}
                groupedNav={groupedNav}
                categoryLabels={categoryLabels}
                categoryColors={categoryColors}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                onLinkClick={() => {}}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 bg-[#0a0e27] min-h-[calc(100vh-4rem)]">
          <div className="relative h-full">
            {/* Tech Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232642fe' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
            {/* Content Wrapper */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  nav: NavItem[];
  pathname: string;
  groupedNav: Record<string, NavItem[]>;
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  expandedCategories: Set<string>;
  toggleCategory: (category: string) => void;
  onLinkClick: () => void;
}

function SidebarContent({
  nav,
  pathname,
  groupedNav,
  categoryLabels,
  categoryColors,
  expandedCategories,
  toggleCategory,
  onLinkClick,
}: SidebarContentProps) {
  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-2">
      {Object.entries(groupedNav).map(([category, items]) => {
        const isExpanded = expandedCategories.has(category);
        const Icon = category === 'main' ? HomeIcon : category === 'content' ? DocumentTextIcon : Cog6ToothIcon;

        return (
          <div key={category} className="space-y-1">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 uppercase tracking-wider hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryColors[category]} shadow-sm`}></div>
                <span>{categoryLabels[category]}</span>
              </div>
              <ChevronRightIcon
                className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>

            {/* Category Items */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {items.map((item) => {
                    const active = isActive(item.href);
                    const IconComponent = active ? item.iconSolid : item.icon;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={onLinkClick}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                            active
                              ? `bg-gradient-to-r ${categoryColors[category]} text-white shadow-lg shadow-${categoryColors[category].split('-')[1]}/30`
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <IconComponent
                            className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`}
                          />
                          <span className={active ? 'font-semibold' : ''}>{item.name}</span>
                          {active && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
