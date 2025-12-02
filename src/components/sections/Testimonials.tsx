'use client';

import { useEffect, useState } from 'react';

type Testimonial = {
  _id?: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  rating?: number;
  avatar?: string;
};

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/testimonials?featured=true&limit=6', { next: { revalidate: 60 } as any });
        if (!res.ok) throw new Error('Failed to load testimonials');
        const json = await res.json();
        if (json.ok && Array.isArray(json.items) && json.items.length > 0) {
          setItems(
            json.items.map((item: any) => ({
              _id: item._id,
              quote: item.quote,
              name: item.name,
              role: item.company ? `${item.role} • ${item.company}` : item.role,
              rating: item.rating,
              avatar: item.avatar,
            })),
          );
        } else {
          setItems([]);
        }
      } catch (err) {
        console.warn('Testimonials fetch failed', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="bg-[#f7f7fb]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#010333] sm:text-4xl">What clients say</h2>
          <p className="mt-3 text-base leading-7 text-gray-600">Trusted partners across SaaS, finance, and design.</p>
        </div>

        {loading && <div className="mt-12 text-center text-gray-500">Loading testimonials…</div>}

        {!loading && !items.length && (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
            Publish testimonials inside <span className="font-semibold text-[#2642fe]">Admin → Testimonials</span> to display this section.
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <div key={t._id || i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_6px_30px_rgba(2,6,23,0.04)]">
                <div className="mb-4 flex items-center gap-3">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full border border-gray-100 object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                      {t.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-[#010333]">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
                <div className="text-[var(--brand-primary)] text-2xl">“</div>
                <p className="mt-2 text-sm leading-6 text-gray-700">{t.quote}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


