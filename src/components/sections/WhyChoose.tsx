'use client';

import { useEffect, useState } from 'react';
import {
  BoltIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CheckBadgeIcon,
  LightBulbIcon,
  CpuChipIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

// Icon mapping
const iconMap: Record<string, any> = {
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
  CheckBadgeIcon,
  LightBulbIcon,
  CpuChipIcon,
  ChatBubbleLeftIcon,
};

type WhyChoosePoint = {
  title: string;
  description: string;
  icon: string;
  order: number;
};

type WhyChooseContent = {
  heading?: string;
  description?: string;
  points?: WhyChoosePoint[];
};

export default function WhyChoose() {
  const [content, setContent] = useState<WhyChooseContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/homepage?section=whyChoose');
        if (!res.ok) throw new Error('Failed to load why choose content');
        const json = await res.json();
        setContent(json.section || null);
      } catch (err) {
        console.warn('WhyChoose fetch failed', err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const points = (content?.points || []).sort((a, b) => a.order - b.order);

  return (
    <section className="bg-[#f7f7fb]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {loading && (
          <div className="mx-auto max-w-2xl text-center text-sm text-gray-500">Loading reasons…</div>
        )}

        {!loading && !content && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No “Why Choose” content yet. Configure it under <span className="font-semibold text-[#2642fe]">Admin → Homepage Content → Why Choose</span>.
          </div>
        )}

        {content && (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#010333] sm:text-4xl">{content.heading}</h2>
              <p className="mt-3 text-base leading-7 text-gray-600">{content.description}</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {points.map((point, index) => {
                const IconComponent = iconMap[point.icon] || RocketLaunchIcon;
                return (
                  <div key={`${point.title}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#010333]">{point.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{point.description}</p>
                  </div>
                );
              })}
              {!points.length && (
                <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                  Add at least one point to display this section.
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </section>
  );
}


