import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, StarIcon, CheckIcon, ClockIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// Mock data - will be replaced with real data later
const services = {
  1: {
    id: 1,
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies like React, Next.js, and Node.js.',
    longDescription: `I specialize in creating responsive, scalable web applications using the latest technologies. From simple websites to complex web applications, I deliver high-quality solutions tailored to your business needs.

With years of experience in web development, I follow industry best practices to ensure your application is secure, performant, and maintainable. Whether you need a landing page, e-commerce platform, or enterprise application, I can help bring your vision to life.`,
    category: 'Development',
    subcategory: 'Frontend',
    price: 4100,
    priceType: 'hourly',
    duration: '2-8 weeks',
    rating: 4.9,
    reviews: 127,
    image: '/api/placeholder/800/600',
    features: [
      'Responsive Design',
      'Modern UI/UX',
      'SEO Optimized',
      'Fast Loading',
      'Mobile Friendly',
      'Cross-browser Compatible',
      'Accessibility Standards',
      'Performance Optimization'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    deliveryTime: '2-8 weeks',
    revisions: 3,
    featured: true,
    available: true,
    packages: [
      {
        name: 'Basic',
        price: 27500,
        description: 'Perfect for small projects',
        features: [
          'Up to 5 pages',
          'Responsive design',
          'Basic SEO',
          '1 revision',
          '2 weeks delivery',
        ],
        delivery: '2 weeks',
      },
      {
        name: 'Standard',
        price: 82500,
        description: 'Ideal for most projects',
        features: [
          'Up to 15 pages',
          'Responsive design',
          'Advanced SEO',
          'CMS integration',
          '3 revisions',
          '4 weeks delivery',
        ],
        delivery: '4 weeks',
        recommended: true,
      },
      {
        name: 'Premium',
        price: 192500,
        description: 'For complex applications',
        features: [
          'Unlimited pages',
          'Custom functionality',
          'Advanced features',
          'API integration',
          '5 revisions',
          '8 weeks delivery',
        ],
        delivery: '8 weeks',
      },
    ],
    faqs: [
      {
        question: 'What technologies do you use?',
        answer: 'I primarily work with React, Next.js, TypeScript, and Tailwind CSS for frontend development, and Node.js with Express for backend. I choose the best technology stack based on your project requirements.',
      },
      {
        question: 'Do you provide ongoing support?',
        answer: 'Yes, I offer ongoing support and maintenance packages. We can discuss the specific needs of your project and create a custom support plan.',
      },
      {
        question: 'Can you work with my existing codebase?',
        answer: 'Absolutely! I have experience working with existing codebases and can help improve, refactor, or add new features to your application.',
      },
      {
        question: 'What is your development process?',
        answer: 'I follow an agile development process with regular check-ins and updates. You\'ll have visibility into the progress throughout the project lifecycle.',
      },
    ],
    testimonials: [
      {
        name: 'John Smith',
        company: 'TechCorp',
        rating: 5,
        text: 'Excellent work! The web application exceeded our expectations. Very professional and delivered on time.',
      },
      {
        name: 'Sarah Johnson',
        company: 'StartupXYZ',
        rating: 5,
        text: 'Great communication and technical expertise. Would definitely work together again on future projects.',
      },
    ],
  },
  // Add more services as needed
};

interface ServicePageProps {
  params: {
    id: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services[params.id as keyof typeof services];

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-white pt-24">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </div>

      {/* Service Header */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Service Image */}
          <div className="aspect-w-16 aspect-h-9">
            <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-400 mb-4">⚙️</div>
                <div className="text-lg text-gray-500">Professional Service</div>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
                {service.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {service.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {service.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(service.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-medium text-gray-900">
                {service.rating}
              </span>
              <span className="ml-2 text-gray-600">
                ({service.reviews} reviews)
              </span>
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                  Starting Price
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ETB {service.price.toLocaleString()}/{service.priceType}
                </div>
              </div>
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <ClockIcon className="mr-2 h-5 w-5" />
                  Duration
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {service.duration}
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
              <div className="grid grid-cols-2 gap-2">
                {service.features.slice(0, 6).map((feature) => (
                  <div key={feature} className="flex items-center text-sm text-gray-600">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href={`/contact?service=${service.id}`}
                className="inline-flex items-center w-full justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Request Quote
              </Link>
              <p className="mt-2 text-sm text-gray-500 text-center">
                <ShieldCheckIcon className="inline h-4 w-4 mr-1" />
                100% Satisfaction Guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Overview</h2>
              <div className="prose prose-lg text-gray-600">
                {service.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Packages</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`relative rounded-lg border-2 p-6 ${
                      pkg.recommended
                        ? 'border-blue-600 shadow-lg'
                        : 'border-gray-200'
                    }`}
                  >
                    {pkg.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                          Recommended
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                      <div className="text-3xl font-bold text-gray-900">
                        ETB {pkg.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Delivery: {pkg.delivery}
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start text-sm text-gray-600">
                          <CheckIcon className="mr-2 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/contact?service=${service.id}&package=${pkg.name}`}
                      className={`block w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        pkg.recommended
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Select Package
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {service.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Delivery Time</dt>
                  <dd className="text-sm font-medium text-gray-900">{service.deliveryTime}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Revisions</dt>
                  <dd className="text-sm font-medium text-gray-900">{service.revisions} included</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Availability</dt>
                  <dd className="text-sm font-medium text-green-600">Available Now</dd>
                </div>
              </dl>
            </div>

            {/* Testimonials */}
            {service.testimonials && service.testimonials.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Reviews</h3>
                <div className="space-y-4">
                  {service.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
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
                      <p className="text-sm text-gray-600 mb-2">{testimonial.text}</p>
                      <p className="text-xs text-gray-500">
                        {testimonial.name} - {testimonial.company}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Have Questions?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get in touch to discuss your project requirements and receive a custom quote.
              </p>
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
