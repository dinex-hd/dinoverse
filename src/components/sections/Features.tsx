import { connectToDatabase } from '@/lib/mongoose';
import { Feature } from '@/models/Feature';
import {
  SparklesIcon,
  BoltIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const iconMap: Record<string, any> = {
  SparklesIcon,
  BoltIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
};

export default async function Features() {
  await connectToDatabase();
  const items = await Feature.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();

  if (!items.length) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center text-gray-500">
          <p>No platform features configured yet. Add some under <span className="font-semibold text-[#2642fe]">Admin → Features</span>.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-base font-semibold text-[var(--brand-primary)]">Everything in One Place</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Complete Digital Hub</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Curate this section from the admin panel — every card below is served from MongoDB.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {items.map((feature) => {
              const Icon = iconMap[feature.icon || 'SparklesIcon'] || SparklesIcon;
              return (
                <div key={feature._id} className="flex flex-col rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Icon className="h-5 w-5 flex-none text-[var(--brand-primary)]" aria-hidden="true" />
                    {feature.title}
                  </dt>
                  {feature.emphasis && <span className="mt-1 text-xs uppercase tracking-wide text-[#2642fe]">{feature.emphasis}</span>}
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
