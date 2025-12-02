import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Portfolio } from '@/models/Portfolio';
import { SiteContent } from '@/models/SiteContent';

type RecentProject = {
  id: string;
  title: string;
  tag: string;
  description: string;
  href: string;
};

const accentPalette = [
  'from-[#2642fe]/10 to-[#010333]/0',
  'from-cyan-500/10 to-[#010333]/0',
  'from-emerald-500/10 to-[#010333]/0',
  'from-rose-500/10 to-[#010333]/0',
];

async function getRecentProjects(): Promise<{
  heading: string;
  description: string;
  projects: RecentProject[];
}> {
  await connectToDatabase();
  const configDoc = await SiteContent.findOne({ key: 'recentWork' }).lean();
  const config = configDoc?.recentWork;
  const limit = config?.maxProjects || 4;

  let projectDocs = [];
  if (config?.projectIds && config.projectIds.length > 0) {
    projectDocs = await Portfolio.find({
      _id: { $in: config.projectIds },
      active: true,
    }).lean();
    const orderMap = new Map(config.projectIds.map((id: string, index: number) => [id.toString(), index]));
    projectDocs.sort(
      (a: any, b: any) =>
        (orderMap.get(a._id.toString()) ?? 999) - (orderMap.get(b._id.toString()) ?? 999),
    );
  } else {
    projectDocs = await Portfolio.find({ active: true, featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();
  }

  if (!projectDocs.length) {
    projectDocs = await Portfolio.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();
  }

  const projects =
    projectDocs.map((doc: any) => ({
      id: doc._id.toString(),
      title: doc.title,
      tag: doc.category || 'Project',
      description: doc.description || 'Clean UI, robust DX, and performance‑first builds.',
      href: `/portfolio/${doc._id.toString()}`,
    })) || [];

  return {
    heading: config?.heading || 'Recent Work',
    description: config?.description || 'Selected projects across web, mobile and design.',
    projects,
  };
}

export default async function RecentWork() {
  const { heading, description, projects } = await getRecentProjects();
  const hasProjects = projects.length > 0;

  return (
    <section className="bg-[#f7f7fb]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#010333]">{heading}</h2>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>
          <Link href="/portfolio" className="text-sm font-medium text-[var(--brand-primary)] hover:opacity-90">
            View all
          </Link>
        </div>

        {!hasProjects ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-sm text-gray-500">Featured projects will appear here once you publish them.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, idx) => (
              <Link
                key={project.id}
                href={project.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(2,6,23,0.06)]"
              >
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b ${
                    accentPalette[idx % accentPalette.length]
                  }`}
                />
                <div className="relative">
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700">
                    {project.tag}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[#010333] group-hover:text-[var(--brand-primary)]">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
