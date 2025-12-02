import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, StarIcon, ShoppingCartIcon, CheckIcon, ClockIcon, ArrowDownTrayIcon, ArrowPathIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Mock data - will be replaced with real data later
const products = {
  1: {
    id: 1,
    name: 'Complete Web Development Course',
    description: 'Master modern web development with React, Next.js, and TypeScript. Includes 50+ hours of video content.',
    longDescription: `This comprehensive course takes you from beginner to advanced in modern web development. You'll learn the most in-demand technologies and frameworks used by top tech companies.

The course is structured to provide hands-on experience with real-world projects. Each module builds upon the previous one, ensuring a solid understanding of core concepts before moving to advanced topics.

By the end of this course, you'll have built multiple production-ready applications and have the confidence to tackle any web development project.`,
    category: 'Course',
    price: 5500,
    originalPrice: 8250,
    discount: 33,
    rating: 4.9,
    reviews: 342,
    students: 1250,
    image: '/api/placeholder/800/600',
    bestseller: true,
    new: false,
    tags: ['Web Development', 'React', 'Next.js', 'TypeScript'],
    format: 'Video Course',
    downloadable: true,
    updates: 'Lifetime',
    whatYouWillLearn: [
      'Build modern web applications with React and Next.js',
      'Master TypeScript for type-safe JavaScript development',
      'Implement authentication and authorization',
      'Work with databases and APIs',
      'Deploy applications to production',
      'Follow best practices and industry standards',
      'Build responsive and accessible user interfaces',
      'Optimize performance and SEO',
    ],
    requirements: [
      'Basic understanding of HTML, CSS, and JavaScript',
      'A computer with internet connection',
      'Eagerness to learn and practice',
    ],
    includes: [
      '50+ hours of video content',
      '100+ coding exercises',
      '20+ real-world projects',
      'Downloadable resources',
      'Certificate of completion',
      'Lifetime access',
      'Money-back guarantee',
    ],
    curriculum: [
      {
        title: 'Introduction to Modern Web Development',
        lessons: 12,
        duration: '2h 30m',
        topics: ['Web fundamentals', 'Modern JavaScript', 'ES6+ features', 'Development tools'],
      },
      {
        title: 'React Fundamentals',
        lessons: 18,
        duration: '4h 15m',
        topics: ['Components', 'Props & State', 'Hooks', 'Context API', 'React Router'],
      },
      {
        title: 'Next.js Framework',
        lessons: 15,
        duration: '3h 45m',
        topics: ['App Router', 'Server Components', 'API Routes', 'Data Fetching', 'Deployment'],
      },
      {
        title: 'TypeScript Mastery',
        lessons: 14,
        duration: '3h 20m',
        topics: ['Type system', 'Interfaces', 'Generics', 'Advanced types', 'React + TypeScript'],
      },
      {
        title: 'Full-Stack Development',
        lessons: 20,
        duration: '5h 30m',
        topics: ['RESTful APIs', 'Authentication', 'Database integration', 'File uploads', 'Real-time features'],
      },
      {
        title: 'Advanced Topics',
        lessons: 16,
        duration: '4h 10m',
        topics: ['Testing', 'Performance optimization', 'SEO', 'Security', 'Best practices'],
      },
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        rating: 5,
        date: '2 weeks ago',
        text: 'This course completely changed my career! I went from barely knowing JavaScript to building full-stack applications. The instructor explains everything clearly and the projects are real-world examples.',
      },
      {
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        rating: 5,
        date: '1 month ago',
        text: 'Best investment I\'ve made in my education. The course is well-structured, up-to-date, and covers everything you need to become a professional web developer.',
      },
      {
        name: 'Emily Rodriguez',
        avatar: '/api/placeholder/40/40',
        rating: 5,
        date: '3 weeks ago',
        text: 'I\'ve taken many online courses, but this one stands out. The quality of content, practical examples, and ongoing updates make it worth every penny.',
      },
    ],
    author: {
      name: 'Dinoverse',
      avatar: '/api/placeholder/60/60',
      bio: 'Full-stack developer with 10+ years of experience',
      students: 5000,
      courses: 12,
      rating: 4.8,
    },
    faqs: [
      {
        question: 'Is this course suitable for beginners?',
        answer: 'Yes! While basic knowledge of HTML, CSS, and JavaScript is helpful, the course starts with fundamentals and gradually progresses to advanced topics.',
      },
      {
        question: 'How long do I have access to the course?',
        answer: 'You get lifetime access to all course materials, including future updates and new content.',
      },
      {
        question: 'Do I get a certificate?',
        answer: 'Yes, upon completion of the course, you\'ll receive a certificate that you can share on LinkedIn and your resume.',
      },
      {
        question: 'What if I\'m not satisfied with the course?',
        answer: 'We offer a 30-day money-back guarantee. If you\'re not happy with the course, simply request a refund within 30 days of purchase.',
      },
    ],
  },
  // Add more products as needed
};

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products[Number(params.id) as keyof typeof products];

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <Link
          href="/store"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Store
        </Link>
      </div>

      {/* Product Header */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-w-16 aspect-h-9">
            <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-400 mb-4">
                  {product.category === 'Course' ? '🎓' : product.category === 'Template' ? '🎨' : '📁'}
                </div>
                <div className="text-lg text-gray-500">{product.category}</div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {product.category}
                </span>
                {product.bestseller && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    🔥 Bestseller
                  </span>
                )}
                {product.new && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✨ New
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Rating and Students */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-medium text-gray-900">
                  {product.rating}
                </span>
                <span className="ml-2 text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="mr-2 h-5 w-5" />
                {product.students.toLocaleString()} students
              </div>
            </div>

            {/* Price */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    ETB {product.price.toLocaleString()}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">
                        ETB {product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        {product.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-3">
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              
              <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Buy Now
              </button>

              <p className="mt-4 text-center text-sm text-gray-600">
                <ShieldCheckIcon className="inline h-4 w-4 mr-1" />
                30-day money-back guarantee
              </p>
            </div>

            {/* What's Included */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This product includes:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                  {product.format}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowDownTrayIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                  Downloadable
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowPathIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                  {product.updates} Updates
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                  Lifetime Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This {product.category}</h2>
              <div className="prose prose-lg text-gray-600">
                {product.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* What You'll Learn */}
            {product.whatYouWillLearn && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            {product.curriculum && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {product.curriculum.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Section {index + 1}: {section.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {section.lessons} lessons • {section.duration}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {section.topics.map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {product.requirements && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {product.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            {product.testimonials && product.testimonials.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                <div className="space-y-6">
                  {product.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 font-medium">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <span className="text-sm text-gray-500">{testimonial.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{testimonial.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Sticky Buy Box */}
            <div className="sticky top-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ETB {product.price.toLocaleString()}
              </div>
              {product.originalPrice > product.price && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg text-gray-500 line-through">
                    ETB {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {product.discount}% OFF
                  </span>
                </div>
              )}

              <button className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-3">
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              
              <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors mb-4">
                Buy Now
              </button>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                  <ShieldCheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  30-day money-back guarantee
                </p>
                <p className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4 text-green-500" />
                  Lifetime access
                </p>
                <p className="flex items-center">
                  <ArrowPathIcon className="mr-2 h-4 w-4 text-green-500" />
                  Free updates
                </p>
              </div>
            </div>

            {/* Includes */}
            {product.includes && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This includes:</h3>
                <ul className="space-y-3">
                  {product.includes.map((item, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Author Info */}
            {product.author && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-medium text-lg">
                      {product.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{product.author.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{product.author.bio}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>⭐ {product.author.rating} Instructor Rating</p>
                      <p>👥 {product.author.students.toLocaleString()} Students</p>
                      <p>📚 {product.author.courses} Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQs */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h3>
                <div className="space-y-4">
                  {product.faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900 mb-1">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
