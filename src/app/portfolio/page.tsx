import Link from 'next/link';
import { ArrowRightIcon, EyeIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { connectToDatabase } from '@/lib/mongoose';
import { Portfolio } from '@/models/Portfolio';

type PortfolioProject = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  status: 'Completed' | 'In Progress' | 'Planning';
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
};

async function getProjects(): Promise<PortfolioProject[]> {
  await connectToDatabase();
  const docs = await Portfolio.find({ active: true })
    .sort({ featured: -1, order: 1, createdAt: -1 })
    .lean();

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    image: doc.image || '',
    technologies: doc.technologies || [],
    category: doc.category || 'Project',
    status: (doc.status as PortfolioProject['status']) || 'Completed',
    liveUrl: doc.liveUrl || '',
    githubUrl: doc.githubUrl || '',
    featured: !!doc.featured,
  }));
}

export default async function PortfolioPage() {
  const projects = await getProjects();
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  return (
    <div className="bg-white pt-24">
      {/* Hero Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              My Portfolio
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A collection of projects showcasing my expertise in web development, mobile apps, 
              data science, and emerging technologies.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-lg font-semibold text-gray-800">Projects coming soon</p>
            <p className="text-sm text-gray-500 mt-2">I’m currently curating case studies. Please check back shortly.</p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              >
                Start a project
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
            <div
              key={project._id}
              className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Project Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <CodeBracketIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {project.category}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/portfolio/${project._id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    View Details
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Live Demo"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Source Code"
                      >
                        <CodeBracketIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Interested in working together?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Let's discuss your next project and bring your ideas to life.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Get in Touch
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
