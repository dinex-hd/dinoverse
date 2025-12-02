import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon, TagIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline';

// Mock data - will be replaced with real data later
const blogPosts = {
  'building-scalable-web-applications-nextjs-15': {
    id: 1,
    title: 'Building Scalable Web Applications with Next.js 15',
    excerpt: 'Learn how to leverage the latest features in Next.js 15 to build high-performance, scalable web applications with improved developer experience.',
    content: `
# Building Scalable Web Applications with Next.js 15

Next.js 15 has brought some exciting new features that make building scalable web applications easier than ever. In this comprehensive guide, we'll explore the key improvements and how to leverage them in your projects.

## What's New in Next.js 15

### 1. Improved App Router
The App Router has received significant enhancements, making it more stable and feature-rich. The new routing system provides better performance and developer experience.

### 2. Enhanced Server Components
Server Components now offer better performance with improved caching strategies and reduced bundle sizes.

### 3. Better TypeScript Support
Next.js 15 comes with improved TypeScript support, making development more type-safe and efficient.

## Key Features for Scalability

### Server-Side Rendering (SSR)
Next.js 15's SSR capabilities allow you to render pages on the server, improving initial load times and SEO.

\`\`\`javascript
// pages/api/users.js
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/users');
  const users = await res.json();
  
  return {
    props: { users }
  };
}
\`\`\`

### Static Site Generation (SSG)
For content that doesn't change frequently, SSG provides the best performance.

\`\`\`javascript
export async function getStaticProps() {
  const posts = await fetchPosts();
  
  return {
    props: { posts },
    revalidate: 3600 // Revalidate every hour
  };
}
\`\`\`

### API Routes
Next.js 15's API routes make it easy to build backend functionality alongside your frontend.

## Best Practices

1. **Use the App Router** for new projects
2. **Implement proper caching strategies**
3. **Optimize images** with the built-in Image component
4. **Use TypeScript** for better type safety
5. **Implement proper error handling**

## Conclusion

Next.js 15 provides powerful tools for building scalable web applications. By leveraging its new features and following best practices, you can create high-performance applications that scale effectively.

The combination of improved performance, better developer experience, and enhanced features makes Next.js 15 an excellent choice for modern web development.
    `,
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/40/40',
      bio: 'Full-stack developer passionate about creating scalable web applications.',
    },
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'TypeScript', 'Performance', 'Scalability'],
    image: '/api/placeholder/800/400',
    featured: true,
    slug: 'building-scalable-web-applications-nextjs-15',
    views: 1250,
    likes: 45,
  },
  // Add more blog posts as needed
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white pt-24">
      {/* Back Button */}
      <div className="mx-auto max-w-4xl px-6 pt-8 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        <header className="mb-8">
          {/* Category and Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>

          {/* Author and Meta Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.bio}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-1 h-4 w-4" />
                {post.readTime}
              </div>
              <div className="flex items-center">
                <span className="mr-1">👁️</span>
                {post.views} views
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <ShareIcon className="mr-2 h-4 w-4" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <BookmarkIcon className="mr-2 h-4 w-4" />
                Save
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                👍 {post.likes}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-400 mb-4">📝</div>
              <div className="text-lg text-gray-500">Featured Article</div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                  {paragraph.replace('# ', '')}
                </h1>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('```')) {
              return (
                <div key={index} className="bg-gray-100 rounded-lg p-4 my-4">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    <code>{paragraph.replace('```', '')}</code>
                  </pre>
                </div>
              );
            }
            if (paragraph.trim() === '') {
              return <br key={index} />;
            }
            return (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
              >
                <TagIcon className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Related articles would go here */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Article 1</h3>
              <p className="text-gray-600 text-sm">Brief description of related article...</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Article 2</h3>
              <p className="text-gray-600 text-sm">Brief description of related article...</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Article 3</h3>
              <p className="text-gray-600 text-sm">Brief description of related article...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
