import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, EyeIcon, CodeBracketIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { connectToDatabase } from '@/lib/mongoose';
import { Portfolio } from '@/models/Portfolio';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  await connectToDatabase();
  const doc = await Portfolio.findById(params.id).lean();

  if (!doc) {
    notFound();
  }

  const project = {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    longDescription: doc.longDescription || doc.description,
    image: doc.image || '',
    technologies: doc.technologies || [],
    category: doc.category || 'Project',
    status: doc.status || 'Completed',
    liveUrl: doc.liveUrl || '',
    githubUrl: doc.githubUrl || '',
    featured: !!doc.featured,
    startDate: doc.createdAt ? new Date(doc.createdAt).toISOString() : '',
    endDate: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : '',
    client: 'Confidential Client',
    teamSize: 1,
    challenges: doc.longDescription
      ? doc.longDescription.split('. ').slice(0, 3)
      : ['Delivered modern UI', 'Improved performance', 'Enhanced scalability'],
    solutions: [
      'Followed a collaborative build process with weekly demos',
      'Shipped tested, type-safe code with CI/CD automation',
      'Implemented modular architecture for easier maintenance',
    ],
    results: doc.featured
      ? ['Featured project on homepage', 'Drove higher conversion from hero section']
      : ['Shipped on time and within scope'],
  };

  return (
    <div className="bg-white pt-24">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Link>
      </div>

      {/* Project Header */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Project Image */}
          <div className="aspect-w-16 aspect-h-9">
            <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <CodeBracketIcon className="h-24 w-24 text-gray-400" />
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {project.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {project.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {project.description}
              </p>
            </div>

            {/* Project Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Team of {project.teamSize}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              )}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <CodeBracketIcon className="mr-2 h-4 w-4" />
                Source Code
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
              <div className="prose prose-lg text-gray-600">
                {project.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Challenges & Solutions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenges & Solutions</h2>
              <div className="space-y-6">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Challenge: {challenge}</h3>
                    <p className="text-gray-600">{project.solutions[index]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Stats */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Results</h3>
              <ul className="space-y-3">
                {project.results.map((result, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client</h3>
              <p className="text-gray-600">{project.client}</p>
            </div>

            {/* Share Project */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Project</h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Share
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
