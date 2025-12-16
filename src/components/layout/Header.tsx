'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { mainNavigation } from '@/lib/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  }, [pathname]);

  // Ensure portals only render on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (!isMounted) return;
    const original = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [mobileMenuOpen, isMounted]);

  const delayClasses = ['delay-75', 'delay-100', 'delay-150', 'delay-200'];

  // Animate menu in when opened
  useEffect(() => {
    if (mobileMenuOpen) {
      // small timeout ensures transition applies
      const t = setTimeout(() => setMenuVisible(true), 10);
      return () => clearTimeout(t);
    }
    setMenuVisible(false);
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMenuVisible(false);
    // wait for animation to finish before unmounting
    setTimeout(() => setMobileMenuOpen(false), 200);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      {/* Capsule navbar container */}
      <div className="mx-auto max-w-6xl px-4">
        <nav
          className="flex items-center justify-between rounded-full border border-white/10 bg-[var(--brand-dark)]/70 px-4 py-2 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
          aria-label="Global"
        >
          {/* Left: Logo/Brand */}
          <div className="flex items-center lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-[var(--brand-primary)] bg-clip-text text-transparent group-hover:from-[var(--brand-primary)] group-hover:to-white transition-all duration-300">
                Dinoverse
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/10 transition"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Center: Nav links */}
          <div className="hidden lg:flex lg:gap-x-2">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  pathname === item.href
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
                title={item.description}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/contact"
              className="rounded-full bg-[var(--brand-primary)] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition"
              title="Get in touch"
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu rendered via portal to avoid header backdrop-blur clipping */}
      {isMounted && mobileMenuOpen && createPortal(
        (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm" onClick={closeMenu} />
            <div className="fixed inset-0 z-[75] flex items-center justify-center p-6">
              <div className={`w-full max-w-sm rounded-2xl border border-white/10 bg-[var(--brand-dark)]/85 backdrop-blur-xl shadow-2xl px-6 py-6 transition-all duration-200 ${menuVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="flex items-center justify-between">
                  <Link href="/" className="-m-1.5 p-1.5" onClick={closeMenu}>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-[var(--brand-primary)] bg-clip-text text-transparent">
                      Dinoverse
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="rounded-full p-2.5 text-white hover:bg-white/10 transition-all duration-300"
                    onClick={closeMenu}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="space-y-2 py-2">
                    {mainNavigation.map((item, idx) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block rounded-full px-4 py-3 text-base font-semibold leading-7 text-white/90 hover:text-white transition-all duration-200 ${
                          pathname === item.href ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                        onClick={closeMenu}
                        title={item.description}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </header>
  );
}
