'use client';

import { useEffect, useState } from 'react';

type Partner = {
  _id: string;
  name: string;
  logo?: string;
  url?: string;
  accent?: string;
};

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/partners?limit=50', { next: { revalidate: 120 } as any });
        if (!res.ok) return;
        const json = await res.json();
        if (json.ok) {
          setPartners(json.items || []);
        }
      } catch {}
    })();
  }, []);

  if (!partners.length) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center text-gray-500">
          <p>No partners have been published yet. Add them under <span className="font-semibold text-[#2642fe]">Admin → Partners</span>.</p>
        </div>
      </section>
    );
  }

  const marquee = [...partners, ...partners];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-[#fafafe] p-6">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-gray-500">Built with</p>
          <div className="mt-6 overflow-hidden">
            <div className="flex animate-scroll gap-6 sm:gap-8 text-gray-500">
              {marquee.map((partner, index) => (
                <a
                  key={`${partner._id}-${index}`}
                  href={partner.url || '#'}
                  target={partner.url ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:text-[#2642fe]"
                >
                  <span className="text-sm sm:text-base">{partner.logo || '⬤'}</span>
                  <span className="whitespace-nowrap">{partner.name}</span>
                  {partner.accent && <span className="text-[10px] uppercase tracking-wide text-gray-400">{partner.accent}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}