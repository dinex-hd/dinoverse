'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

type CTAContent = {
  heading?: string;
  description?: string;
  primaryButton?: {
    text?: string;
    href?: string;
  };
  secondaryButton?: {
    text?: string;
    href?: string;
  };
};

export default function CTA() {
  const [content, setContent] = useState<CTAContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/homepage?section=cta');
        if (!res.ok) throw new Error('Failed to load CTA');
        const json = await res.json();
        setContent(json.section || null);
      } catch (err) {
        console.warn('CTA fetch failed', err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-[var(--brand-dark)]/95">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        {loading && <div className="mx-auto max-w-2xl text-center text-white/70">Loading call to action…</div>}
        {!loading && !content && (
          <div className="mx-auto max-w-2xl text-center text-sm text-white/80">
            No CTA configured. Add one under <span className="font-semibold">Admin → Homepage Content → CTA</span>.
          </div>
        )}

        {content && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{content.heading}</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">{content.description}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {content.primaryButton?.text && content.primaryButton.href && (
                <Link
                  href={content.primaryButton.href}
                  className="rounded-md bg-[var(--brand-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] transition-colors"
                >
                  {content.primaryButton.text}
                </Link>
              )}
              {content.secondaryButton?.text && content.secondaryButton.href && (
                <Link
                  href={content.secondaryButton.href}
                  className="text-sm font-semibold leading-6 text-white hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1"
                >
                  {content.secondaryButton.text} <ArrowRightIcon className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
