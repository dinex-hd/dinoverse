'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ContactMiniContent = {
  email?: string;
  responseTime?: string;
  availability?: string;
  heading?: string;
  description?: string;
};

export default function ContactMini() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [content, setContent] = useState<ContactMiniContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/homepage?section=contactMini');
        if (!res.ok) throw new Error('Failed to load contact mini content');
        const json = await res.json();
        setContent(json.section || null);
      } catch (err) {
        console.warn('ContactMini fetch failed', err);
        setContent(null);
      } finally {
        setIsLoadingContent(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setStatusMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: 'Quick contact',
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const errorMsg = data?.message || 'Failed to send message';
        throw new Error(errorMsg);
      }
      setStatus('success');
      setStatusMessage('Thanks! Your message is on its way.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="bg-[#f7f7fb]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {isLoadingContent && <div className="text-center text-sm text-gray-500">Loading contact options…</div>}
        {!isLoadingContent && !content && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
            No quick contact content configured. Add it under <span className="font-semibold text-[#2642fe]">Admin → Homepage Content → Contact Mini</span>.
          </div>
        )}

        {content && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-[#010333]">{content.heading}</h3>
              <p className="mt-2 text-sm text-gray-600">{content.description}</p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#010333] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#010333] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#010333] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30"
                  placeholder="Briefly describe your project..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
                  >
                    {loading ? 'Sending...' : 'Send message'}
                  </button>
                  {status === 'success' && <span className="text-sm text-green-600">{statusMessage}</span>}
                  {status === 'error' && <span className="text-sm text-red-600">{statusMessage}</span>}
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-[#010333]">Prefer email?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Reach out directly at <a href={`mailto:${content.email}`} className="font-medium text-[#2642fe] hover:text-blue-700 transition-colors">{content.email}</a> or use the
                full <Link href="/contact" className="text-[var(--brand-primary)] hover:opacity-90">contact page</Link>.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Response</div>
                  <div className="mt-1 font-semibold text-[#010333]">{content.responseTime}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Availability</div>
                  <div className="mt-1 font-semibold text-[#010333]">{content.availability}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


