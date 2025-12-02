import Link from 'next/link';
import { CalendarIcon, ClockIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

// Mock data - will be replaced with real data later
const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable Web Applications with Next.js 15',
    excerpt: 'Learn how to leverage the latest features in Next.js 15 to build high-performance, scalable web applications with improved developer experience.',
    content: 'Full content here...',
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/40/40',
    },
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'TypeScript', 'Performance'],
    image: '/api/placeholder/600/400',
    featured: true,
    slug: 'building-scalable-web-applications-nextjs-15',
  },
  {
    id: 2,
    title: 'The Future of AI in Web Development',
    excerpt: 'Exploring how artificial intelligence is revolutionizing web development, from code generation to automated testing and deployment.',
    content: 'Full content here...',
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/40/40',
    },
    publishedAt: '2024-01-10',
    readTime: '12 min read',
    category: 'AI & Machine Learning',
    tags: ['AI', 'Web Development', 'Automation', 'Future Tech'],
    image: '/api/placeholder/600/400',
    featured: true,
    slug: 'future-ai-web-development',
  },
  {
    id: 3,
    title: 'Mastering TypeScript: Advanced Patterns and Best Practices',
    excerpt: 'Deep dive into advanced TypeScript patterns, generics, utility types, and best practices for building robust applications.',
    content: 'Full content here...',
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/40/40',
    },
    publishedAt: '2024-01-05',
    readTime: '15 min read',
    category: 'Programming',
    tags: ['TypeScript', 'JavaScript', 'Best Practices', 'Advanced'],
    image: '/api/placeholder/600/400',
    featured: false,
    slug: 'mastering-typescript-advanced-patterns',
  },
  {
    id: 4,
    title: 'Building Responsive UIs with Tailwind CSS',
    excerpt: 'A comprehensive guide to creating beautiful, responsive user interfaces using Tailwind CSS utility classes and modern design principles.',
    content: 'Full content here...',
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/40/40',
    },
    publishedAt: '2024-01-01',
    readTime: '10 min read',
    category: 'Design',
    tags: ['Tailwind CSS', 'CSS', 'Responsive Design', 'UI/UX'],
    image: '/api/placeholder/600/400',
    featured: false,
    slug: 'building-responsive-uis-tailwind-css',
  },
  {
    id: 5,
    title: 'Database Optimization Techniques for Modern Applications',
    excerpt: 'Learn essential database optimization techniques to improve performance, reduce costs, and scale your applications effectively.',
    content: 'Full content here...',
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/40/40',
    },
    publishedAt: '2023-12-28',
    readTime: '14 min read',
    category: 'Database',
    tags: ['Database', 'Performance', 'Optimization', 'SQL'],
    image: '/api/placeholder/600/400',
    featured: false,
    slug: 'database-optimization-techniques',
  },
  {
    id: 6,
    title: 'Getting Started with Blockchain Development',
    excerpt: 'An introduction to blockchain development, covering smart contracts, Web3, and building decentralized applications.',
    content: 'Full content here...',
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/40/40',
    },
    publishedAt: '2023-12-25',
    readTime: '18 min read',
    category: 'Blockchain',
    tags: ['Blockchain', 'Smart Contracts', 'Web3', 'Ethereum'],
    image: '/api/placeholder/600/400',
    featured: false,
    slug: 'getting-started-blockchain-development',
  },
];

const categories = ['All', 'Web Development', 'AI & Machine Learning', 'Programming', 'Design', 'Database', 'Blockchain'];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="bg-white pt-24">
      {/* Hero Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Blog & Insights
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stay updated with the latest trends in web development, technology insights, 
              and best practices from the world of software engineering.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {featuredPosts.map((post) => (
              <article key={post.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-400 mb-2">📝</div>
                      <div className="text-sm text-gray-500">Blog Post</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="mr-1 h-4 w-4" />
                      {post.author.name}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

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

      {/* All Posts */}
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">All Articles</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <article key={post.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-400 mb-2">📄</div>
                    <div className="text-sm text-gray-500">Article</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      <TagIcon className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="mr-1 h-4 w-4" />
                    {post.author.name}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Stay Updated
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Subscribe to our newsletter for the latest articles and insights.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
