import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarIcon, ClockIcon, UserIcon, TagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { connectToDatabase } from '@/lib/mongoose';
import { Blog } from '@/models/Blog';

async function getPost(slug: string) {
  await connectToDatabase();
  const post = await Blog.findOne({
    slug,
    published: true,
    active: true,
  }).lean();

  if (!post) return null;

  // Get related posts
  const related = await Blog.find({
    category: post.category,
    _id: { $ne: post._id },
    published: true,
    active: true,
  })
    .limit(3)
    .select('title slug excerpt image publishedAt category')
    .sort({ publishedAt: -1 })
    .lean();

  return { post, related };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPost(slug);
  
  if (!data) {
    notFound();
  }

  const { post, related } = data;

  // Format content with proper line breaks and paragraphs
  const formatContent = (content: string) => {
    if (!content) return null;
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map((para, i) => {
      const lines = para.split('\n').filter(l => l.trim());
      return (
        <div key={i} className={i > 0 ? 'mt-6' : ''}>
          {lines.map((line, j) => (
            <p key={j} className={j > 0 ? 'mt-4' : ''}>
              {line || <br />}
            </p>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="bg-white pt-24">
      {/* Back Link */}
      <div className="mx-auto max-w-4xl px-6 pt-8 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2642fe] transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <time dateTime={typeof post.publishedAt === 'string' ? post.publishedAt : new Date(post.publishedAt).toISOString()}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              <span>{post.readTime || '5 min read'}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <span>{post.author?.name || 'Dinoverse'}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && post.image.trim() && post.image.startsWith('http') && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-[#2642fe]">
            <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-700 leading-relaxed text-base sm:text-lg">
            {formatContent(post.content)}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <TagIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  href={`/blog?category=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relatedPost: any) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedPost.image && relatedPost.image.trim() && relatedPost.image.startsWith('http') ? (
                    <div className="w-full h-32 bg-gray-100 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200"></div>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                  <div className="p-4">
                    <span className="text-xs font-medium text-blue-600">{relatedPost.category}</span>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
