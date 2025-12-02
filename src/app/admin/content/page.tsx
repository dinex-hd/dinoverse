'use client';

import { useEffect, useState } from 'react';
import {
  HomeIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
  UserGroupIcon,
  ClockIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  LightBulbIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

// Icon mapping for WhyChoose section
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

type RecentWorkContent = {
  heading?: string;
  description?: string;
  projectIds?: string[];
  maxProjects?: number;
};

type ContactMiniContent = {
  email?: string;
  responseTime?: string;
  availability?: string;
  heading?: string;
  description?: string;
};

type ServicesPageContent = {
  badge?: string;
  heading?: string;
  subheading?: string;
  tagline?: string;
  stats?: {
    projects?: string;
    rating?: string;
    satisfaction?: string;
  };
};

type SectionData = {
  hero?: HeroContent;
  whyChoose?: WhyChooseContent;
  processTimeline?: ProcessTimelineContent;
  cta?: CTAContent;
  recentWork?: RecentWorkContent;
  contactMini?: ContactMiniContent;
  servicesPage?: ServicesPageContent;
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'whyChoose' | 'process' | 'cta' | 'recentWork' | 'contactMini' | 'servicesPage'>('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState<SectionData>({});

  // Hero form state
  const [hero, setHero] = useState<HeroContent>({
    badge: '',
    heading: '',
    description: '',
    stats: { projects: '', rating: '', community: '' },
  });

  // WhyChoose form state
  const [whyChoose, setWhyChoose] = useState<WhyChooseContent>({
    heading: '',
    description: '',
    points: [],
  });

  // Process form state
  const [processTimeline, setProcessTimeline] = useState<ProcessTimelineContent>({
    heading: '',
    description: '',
    steps: [],
  });

  // CTA form state
  const [cta, setCTA] = useState<CTAContent>({
    heading: '',
    description: '',
    primaryButton: { text: '', href: '' },
    secondaryButton: { text: '', href: '' },
  });

  // RecentWork form state
  const [recentWork, setRecentWork] = useState<RecentWorkContent>({
    heading: '',
    description: '',
    projectIds: [],
    maxProjects: 4,
  });

  // ContactMini form state
  const [contactMini, setContactMini] = useState<ContactMiniContent>({
    email: '',
    responseTime: '',
    availability: '',
    heading: '',
    description: '',
  });

  const [servicesPage, setServicesPage] = useState<ServicesPageContent>({
    badge: '',
    heading: '',
    subheading: '',
    tagline: '',
    stats: { projects: '', rating: '', satisfaction: '' },
  });

  useEffect(() => {
    loadAllSections();
  }, []);

  async function loadAllSections() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/homepage');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const json = await res.json();
      if (json.ok && json.sections) {
        setData(json.sections);
        
        // Populate form states
        if (json.sections.hero) {
          setHero({
            badge: json.sections.hero.hero?.badge || '',
            heading: json.sections.hero.hero?.heading || '',
            description: json.sections.hero.hero?.description || '',
            stats: json.sections.hero.hero?.stats || { projects: '', rating: '', community: '' },
          });
        }
        
        if (json.sections.whyChoose) {
          setWhyChoose({
            heading: json.sections.whyChoose.whyChoose?.heading || '',
            description: json.sections.whyChoose.whyChoose?.description || '',
            points: json.sections.whyChoose.whyChoose?.points || [],
          });
        }
        
        if (json.sections.processTimeline) {
          setProcessTimeline({
            heading: json.sections.processTimeline.processTimeline?.heading || '',
            description: json.sections.processTimeline.processTimeline?.description || '',
            steps: json.sections.processTimeline.processTimeline?.steps || [],
          });
        }
        
        if (json.sections.cta) {
          setCTA({
            heading: json.sections.cta.cta?.heading || '',
            description: json.sections.cta.cta?.description || '',
            primaryButton: json.sections.cta.cta?.primaryButton || { text: '', href: '' },
            secondaryButton: json.sections.cta.cta?.secondaryButton || { text: '', href: '' },
          });
        }
        
        if (json.sections.recentWork) {
          setRecentWork({
            heading: json.sections.recentWork.recentWork?.heading || '',
            description: json.sections.recentWork.recentWork?.description || '',
            projectIds: json.sections.recentWork.recentWork?.projectIds || [],
            maxProjects: json.sections.recentWork.recentWork?.maxProjects || 4,
          });
        }
        
        if (json.sections.contactMini) {
          setContactMini({
            email: json.sections.contactMini.contactMini?.email || '',
            responseTime: json.sections.contactMini.contactMini?.responseTime || '',
            availability: json.sections.contactMini.contactMini?.availability || '',
            heading: json.sections.contactMini.contactMini?.heading || '',
            description: json.sections.contactMini.contactMini?.description || '',
          });
        }

        if (json.sections.servicesPage) {
          setServicesPage({
            badge: json.sections.servicesPage.servicesPage?.badge || '',
            heading: json.sections.servicesPage.servicesPage?.heading || '',
            subheading: json.sections.servicesPage.servicesPage?.subheading || '',
            tagline: json.sections.servicesPage.servicesPage?.tagline || '',
            stats: json.sections.servicesPage.servicesPage?.stats || {
              projects: '',
              rating: '',
              satisfaction: '',
            },
          });
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  async function saveSection(section: string, content: any) {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: content }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.message || 'Save failed');
      }
      setSuccess('Saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function addWhyChoosePoint() {
    setWhyChoose({
      ...whyChoose,
      points: [...(whyChoose.points || []), { title: '', description: '', icon: 'RocketLaunchIcon', order: whyChoose.points?.length || 0 }],
    });
  }

  function updateWhyChoosePoint(index: number, field: string, value: any) {
    const newPoints = [...(whyChoose.points || [])];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setWhyChoose({ ...whyChoose, points: newPoints });
  }

  function removeWhyChoosePoint(index: number) {
    const newPoints = (whyChoose.points || []).filter((_, i) => i !== index);
    setWhyChoose({ ...whyChoose, points: newPoints });
  }

  function addProcessStep() {
    setProcessTimeline({
      ...processTimeline,
      steps: [...(processTimeline.steps || []), { name: '', description: '', order: processTimeline.steps?.length || 0 }],
    });
  }

  function updateProcessStep(index: number, field: string, value: any) {
    const newSteps = [...(processTimeline.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setProcessTimeline({ ...processTimeline, steps: newSteps });
  }

  function removeProcessStep(index: number) {
    const newSteps = (processTimeline.steps || []).filter((_, i) => i !== index);
    setProcessTimeline({ ...processTimeline, steps: newSteps });
  }

  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: HomeIcon },
    { id: 'whyChoose', name: 'Why Choose', icon: SparklesIcon },
    { id: 'process', name: 'Process Timeline', icon: ClockIcon },
    { id: 'cta', name: 'CTA Section', icon: ArrowRightIcon },
    { id: 'recentWork', name: 'Recent Work', icon: PhotoIcon },
    { id: 'contactMini', name: 'Contact Mini', icon: ChatBubbleLeftIcon },
    { id: 'servicesPage', name: 'Services Page', icon: Squares2X2Icon },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#010333]">Homepage Content Manager</h1>
          <p className="mt-1 text-sm text-gray-600">Control all sections of your homepage</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
      {success && <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">{success}</div>}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#2642fe] text-[#2642fe]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Loading...</div>}

      {/* Hero Section */}
      {activeTab === 'hero' && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-6">Hero Section</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection('hero', hero);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
              <input
                type="text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Full‑stack development • Creative design"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={hero.heading}
                onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Web & Mobile Apps. Brand‑Ready Design."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="At Dinoverse, clients get production‑ready web and mobile applications..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Projects Stat</label>
                <input
                  type="text"
                  value={hero.stats?.projects}
                  onChange={(e) => setHero({ ...hero, stats: { ...hero.stats, projects: e.target.value } })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="50+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating Stat</label>
                <input
                  type="text"
                  value={hero.stats?.rating}
                  onChange={(e) => setHero({ ...hero, stats: { ...hero.stats, rating: e.target.value } })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="4.9★"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Community Stat</label>
                <input
                  type="text"
                  value={hero.stats?.community}
                  onChange={(e) => setHero({ ...hero, stats: { ...hero.stats, community: e.target.value } })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="10k+"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => loadAllSections()}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reset
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Hero Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WhyChoose Section */}
      {activeTab === 'whyChoose' && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-6">Why Choose Section</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection('whyChoose', whyChoose);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={whyChoose.heading}
                onChange={(e) => setWhyChoose({ ...whyChoose, heading: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Why choose Dinoverse"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={2}
                value={whyChoose.description}
                onChange={(e) => setWhyChoose({ ...whyChoose, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Focused on outcomes: robust engineering, beautiful design, and measurable impact."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Points</label>
                <button
                  type="button"
                  onClick={addWhyChoosePoint}
                  className="px-3 py-1.5 rounded-lg bg-[#2642fe] text-white text-sm hover:bg-[#1e35d8]"
                >
                  + Add Point
                </button>
              </div>

              <div className="space-y-4">
                {(whyChoose.points || []).map((point, index) => (
                  <div key={index} className="p-4 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Point {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeWhyChoosePoint(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={point.title}
                          onChange={(e) => updateWhyChoosePoint(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          placeholder="Speed & Quality"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <select
                          value={point.icon}
                          onChange={(e) => updateWhyChoosePoint(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="RocketLaunchIcon">🚀 Rocket Launch</option>
                          <option value="ShieldCheckIcon">🛡️ Shield Check</option>
                          <option value="SparklesIcon">✨ Sparkles</option>
                          <option value="BoltIcon">⚡ Bolt</option>
                          <option value="CheckBadgeIcon">✅ Check Badge</option>
                          <option value="LightBulbIcon">💡 Light Bulb</option>
                          <option value="CpuChipIcon">💻 CPU Chip</option>
                          <option value="ChatBubbleLeftIcon">💬 Chat</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={point.description}
                        onChange={(e) => updateWhyChoosePoint(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="Type‑safe, performance‑first builds with clean architecture and tests."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => loadAllSections()}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reset
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save WhyChoose Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Process Timeline Section */}
      {activeTab === 'process' && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-6">Process Timeline Section</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection('processTimeline', processTimeline);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={processTimeline.heading}
                onChange={(e) => setProcessTimeline({ ...processTimeline, heading: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Process"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={2}
                value={processTimeline.description}
                onChange={(e) => setProcessTimeline({ ...processTimeline, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Transparent, efficient, and collaborative from idea to launch."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Steps</label>
                <button
                  type="button"
                  onClick={addProcessStep}
                  className="px-3 py-1.5 rounded-lg bg-[#2642fe] text-white text-sm hover:bg-[#1e35d8]"
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-4">
                {(processTimeline.steps || [])
                  .sort((a, b) => a.order - b.order)
                  .map((step, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2642fe] text-white text-sm font-semibold">
                            {step.order + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-700">Step {step.order + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProcessStep(index)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => updateProcessStep(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            placeholder="Brief"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                          <input
                            type="number"
                            value={step.order}
                            onChange={(e) => updateProcessStep(index, 'order', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          placeholder="Goals, scope, success metrics"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => loadAllSections()}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reset
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Process Timeline'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CTA Section */}
      {activeTab === 'cta' && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-6">CTA Section</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection('cta', cta);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={cta.heading}
                onChange={(e) => setCTA({ ...cta, heading: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Ready to get started?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={2}
                value={cta.description}
                onChange={(e) => setCTA({ ...cta, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Join the Dinoverse community and start building your digital presence today."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Primary Button</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={cta.primaryButton?.text}
                      onChange={(e) => setCTA({ ...cta, primaryButton: { ...cta.primaryButton, text: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Get in Touch"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={cta.primaryButton?.href}
                      onChange={(e) => setCTA({ ...cta, primaryButton: { ...cta.primaryButton, href: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Secondary Button</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={cta.secondaryButton?.text}
                      onChange={(e) => setCTA({ ...cta, secondaryButton: { ...cta.secondaryButton, text: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Read our blog"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={cta.secondaryButton?.href}
                      onChange={(e) => setCTA({ ...cta, secondaryButton: { ...cta.secondaryButton, href: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="/blog"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => loadAllSections()}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reset
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save CTA Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RecentWork Section */}
      {activeTab === 'recentWork' && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-6">Recent Work Section</h2>
          <p className="text-sm text-gray-600 mb-4">Configure which portfolio projects appear on the homepage (requires Portfolio to be set up first).</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection('recentWork', recentWork);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={recentWork.heading}
                onChange={(e) => setRecentWork({ ...recentWork, heading: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Recent Work"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={2}
                value={recentWork.description}
                onChange={(e) => setRecentWork({ ...recentWork, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Selected projects across web, mobile and design."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Projects to Show</label>
              <input
                type="number"
                value={recentWork.maxProjects}
                onChange={(e) => setRecentWork({ ...recentWork, maxProjects: parseInt(e.target.value) || 4 })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                min="1"
                max="10"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => loadAllSections()}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reset
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Recent Work'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ContactMini Section */}
      {activeTab === 'contactMini' && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#010333] mb-6">Contact Mini Section</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection('contactMini', contactMini);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={contactMini.heading}
                onChange={(e) => setContactMini({ ...contactMini, heading: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Have a project in mind?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={2}
                value={contactMini.description}
                onChange={(e) => setContactMini({ ...contactMini, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                placeholder="Tell me about it — I'll reply within 24 hours."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={contactMini.email}
                  onChange={(e) => setContactMini({ ...contactMini, email: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="dinaolsisay18@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <input
                  type="text"
                  value={contactMini.responseTime}
                  onChange={(e) => setContactMini({ ...contactMini, responseTime: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="<24 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <input
                  type="text"
                  value={contactMini.availability}
                  onChange={(e) => setContactMini({ ...contactMini, availability: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[#010333]"
                  placeholder="Taking projects"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => loadAllSections()}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reset
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#2642fe] text-white hover:bg-[#1e35d8] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Contact Mini'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Page Section */}
      {activeTab === 'servicesPage' && !loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-[#010333]">Services Page Hero</h2>
          <p className="mb-4 text-sm text-gray-600">
            Controls the large hero section and stats at the top of <span className="font-medium">/services</span>.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSection('servicesPage', servicesPage);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Badge Text</label>
                <input
                  type="text"
                  value={servicesPage.badge}
                  onChange={(e) => setServicesPage({ ...servicesPage, badge: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm text-[#010333]"
                  placeholder="Professional Services Portfolio"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Subheading</label>
                <input
                  type="text"
                  value={servicesPage.subheading}
                  onChange={(e) => setServicesPage({ ...servicesPage, subheading: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm text-[#010333]"
                  placeholder="Service Portfolio"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Main Heading</label>
              <input
                type="text"
                value={servicesPage.heading}
                onChange={(e) => setServicesPage({ ...servicesPage, heading: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm text-[#010333]"
                placeholder="DINOVERSE"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tagline</label>
              <textarea
                rows={2}
                value={servicesPage.tagline}
                onChange={(e) => setServicesPage({ ...servicesPage, tagline: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm text-[#010333]"
                placeholder='Where Design Meets Development — Crafting Ideas into Digital Reality.'
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Projects Stat</label>
                <input
                  type="text"
                  value={servicesPage.stats?.projects}
                  onChange={(e) =>
                    setServicesPage({
                      ...servicesPage,
                      stats: { ...(servicesPage.stats || {}), projects: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm text-[#010333]"
                  placeholder="50+"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Rating Stat</label>
                <input
                  type="text"
                  value={servicesPage.stats?.rating}
                  onChange={(e) =>
                    setServicesPage({
                      ...servicesPage,
                      stats: { ...(servicesPage.stats || {}), rating: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm text-[#010333]"
                  placeholder="4.9★"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Satisfaction Stat</label>
                <input
                  type="text"
                  value={servicesPage.stats?.satisfaction}
                  onChange={(e) =>
                    setServicesPage({
                      ...servicesPage,
                      stats: { ...(servicesPage.stats || {}), satisfaction: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm text-[#010333]"
                  placeholder="100%"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => loadAllSections()}
                className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#2642fe] px-4 py-2 text-white hover:bg-[#1e35d8] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Services Hero'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

