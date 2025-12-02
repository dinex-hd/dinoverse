'use client';
import Link from 'next/link';
import { ArrowRightIcon, PlayCircleIcon, RocketLaunchIcon, SparklesIcon, CodeBracketIcon, DevicePhoneMobileIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import GLOBE from 'vanta/dist/vanta.globe.min';
import * as THREE from 'three';

type HeroContent = {
  badge?: string;
  heading?: string;
  description?: string;
  stats?: {
    projects?: string;
    rating?: string;
    community?: string;
  };
};

export default function Hero() {
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaInstance = useRef<any>(null);
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/homepage?section=hero');
        if (!res.ok) throw new Error('Failed to load hero content');
        const json = await res.json();
        setHeroData(json.section || null);
      } catch (err) {
        console.warn('Hero content fetch failed', err);
        setHeroData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!vantaRef.current) return;
    vantaInstance.current = GLOBE({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x2642fe, // primary
      color2: 0x6c7cff, // secondary glow
      backgroundColor: 0x010333,
    });
    return () => {
      if (vantaInstance.current?.destroy) vantaInstance.current.destroy();
      vantaInstance.current = null;
    };
  }, []);

  const content = heroData;

  return (
    <section ref={vantaRef} className="relative isolate overflow-hidden bg-[var(--brand-dark)]">
      {/* Ambient background using your brand blues */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[var(--brand-primary)]/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-[var(--brand-primary)]/20 blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_0%,rgba(38,66,254,0.20),rgba(1,3,51,0)_70%)]" />
      </div>

      {/* Veil above the globe to boost text contrast */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[var(--brand-dark)]/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 px-6 pt-28 pb-20 sm:pt-36 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
        {loading && (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
            Loading hero content…
          </div>
        )}
        {!loading && !content && (
          <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            No hero content configured. Add it under <span className="font-semibold">Admin → Homepage Content → Hero</span>.
          </div>
        )}
        {/* Badge */}
        {content?.badge && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10 backdrop-blur-md">
            <SparklesIcon className="h-4 w-4 text-[var(--brand-primary)]" />
            {content.badge}
          </div>
        )}

          {/* Heading */}
          {content?.heading && (
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-white via-white to-[var(--brand-primary)] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(38,66,254,0.25)]">
                {content.heading}
              </span>
            </h1>
          )}
          {content?.description && (
            <p className="mt-6 text-lg leading-8 text-white/90">
              {content.description}
            </p>
          )}

          {/* Service highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <CodeBracketIcon className="h-4 w-4 text-[var(--brand-primary)]" /> Web Apps (Next.js + TypeScript)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <DevicePhoneMobileIcon className="h-4 w-4 text-[var(--brand-primary)]" /> Mobile Apps (React Native)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <PaintBrushIcon className="h-4 w-4 text-[var(--brand-primary)]" /> Graphic Design (Logos, Covers, More)
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
            >
              <RocketLaunchIcon className="h-5 w-5" />
              Start a Project
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-xl bg-black/30 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-md transition-all hover:bg-black/40 hover:ring-white/30"
            >
              <PlayCircleIcon className="h-5 w-5 text-[#9db0ff]" />
              See Portfolio
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Spacer for Vanta background breathing room */}
          <div className="mt-16" />

          {/* Stats */}
          {content?.stats && (
            <div className="mt-10 grid grid-cols-3 gap-6 text-center text-sm text-white/70 sm:max-w-md sm:mx-auto">
              {content.stats.projects && (
                <div>
                  <div className="text-2xl font-bold text-white">{content.stats.projects}</div>
                  Projects
                </div>
              )}
              {content.stats.rating && (
                <div>
                  <div className="text-2xl font-bold text-white">{content.stats.rating}</div>
                  Client rating
                </div>
              )}
              {content.stats.community && (
                <div>
                  <div className="text-2xl font-bold text-white">{content.stats.community}</div>
                  Community
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
