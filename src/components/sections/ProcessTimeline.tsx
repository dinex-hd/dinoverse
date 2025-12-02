'use client';

import { useEffect, useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

type ProcessStep = {
  name: string;
  description: string;
  order: number;
};

type ProcessTimelineContent = {
  heading?: string;
  description?: string;
  steps?: ProcessStep[];
};

export default function ProcessTimeline() {
  const [content, setContent] = useState<ProcessTimelineContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/homepage?section=processTimeline');
        if (!res.ok) throw new Error('Failed to load process timeline');
        const json = await res.json();
        setContent(json.section || null);
      } catch (err) {
        console.warn('ProcessTimeline fetch failed', err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const steps = (content?.steps || []).sort((a, b) => a.order - b.order);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {loading && <div className="mx-auto max-w-2xl text-center text-sm text-gray-500">Loading process…</div>}

        {!loading && !content && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
            No process timeline found. Update it under <span className="font-semibold text-[#2642fe]">Admin → Homepage Content → Process Timeline</span>.
          </div>
        )}

        {content && (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#010333] sm:text-4xl">{content.heading}</h2>
              <p className="mt-3 text-base leading-7 text-gray-600">{content.description}</p>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-[#fafafe] p-6">
              <div className="relative grid grid-cols-1 items-start gap-6 sm:grid-cols-5">
                {steps.map((step, i) => (
                  <div key={`${step.name}-${i}`} className="relative">
                    {i < steps.length - 1 && (
                      <div className="hidden sm:block absolute right-0 top-6 h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-[var(--brand-primary)]/20 to-transparent" />
                    )}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[var(--brand-primary)] text-white text-sm font-semibold">
                        {step.order + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#010333]">{step.name}</div>
                        <div className="text-xs text-gray-600">{step.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {!steps.length && (
                  <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
                    Add at least one process step to render this timeline.
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                <a href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-primary)] hover:opacity-90">
                  Start a project <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}


