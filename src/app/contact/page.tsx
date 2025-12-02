'use client';

import { useEffect, useRef, useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    service: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const lottieCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize DotLottie animation (client-only)
  useEffect(() => {
    let dot: any;
    const init = async () => {
      try {
        const { DotLottie } = await import('@lottiefiles/dotlottie-web');
        const src = process.env.NEXT_PUBLIC_DOTLOTTIE_URL; // e.g. https://lottie.host/your-id.lottie
        if (!src || !lottieCanvasRef.current) return;
        dot = new DotLottie({
          autoplay: true,
          loop: true,
          canvas: lottieCanvasRef.current,
          src,
        });
      } catch {
        // silently ignore on first load if not configured
      }
    };
    init();
    return () => {
      try {
        dot?.destroy?.();
      } catch {}
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setShowSuccessPopup(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        // Prefer server message; if Zod errors are present, extract the first one
        let serverMsg = data?.message as string | undefined;
        if (!serverMsg && data?.errors?.fieldErrors) {
          const fields = Object.keys(data.errors.fieldErrors);
          for (const f of fields) {
            const msgs = data.errors.fieldErrors[f];
            if (Array.isArray(msgs) && msgs.length > 0) {
              serverMsg = `${f}: ${msgs[0]}`;
              break;
            }
          }
        }
        throw new Error(serverMsg || 'Failed to send');
      }

      // Success
      await res.json().catch(() => null);

      setSubmitStatus('success');
      setShowSuccessPopup(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        service: '',
      });

      // Hide popup after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setTimeout(() => setSubmitStatus('idle'), 300);
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </div>
              </motion.div>

              {/* Message */}
              <div className="flex-1 pt-1">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-green-900 mb-1"
                >
                  Message Sent Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-700 text-sm"
                >
                  Thank you for reaching out! I'll get back to you as soon as possible.
                </motion.p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setTimeout(() => setSubmitStatus('idle'), 300);
                }}
                className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="mt-4 h-1.5 bg-green-200 rounded-full overflow-hidden"
            >
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#010333] via-[#1a1f4a] to-[#010333]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#010333]/50 to-transparent"></div>
        
        <div className="relative z-10 px-6 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-md mb-8">
              <EnvelopeIcon className="h-5 w-5 text-[#2642fe]" />
              Let's Connect
            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
              <span className="bg-gradient-to-r from-white via-white to-[#2642fe] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(38,66,254,0.25)]">
                Get in Touch
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl font-medium text-white/80 leading-relaxed max-w-3xl mx-auto">
              Have a project in mind or questions about my services? I'd love to hear from you. 
              Let's discuss how we can work together to bring your ideas to life.
            </p>
          </div>
        </div>
      </div>

      {/* Lottie Animation - Top visual */}
      <div className="mx-auto max-w-7xl px-6 pt-4 pb-8 lg:px-8">
        <motion.div
          className="mb-6 rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 border border-gray-200 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full grid place-items-center">
            <canvas
              id="dotlottie-canvas"
              ref={lottieCanvasRef}
              className="w-full max-w-[520px] h-[260px] sm:h-[340px] md:h-[380px]"
            />
            {!process.env.NEXT_PUBLIC_DOTLOTTIE_URL && (
              <p className="mt-3 text-sm text-gray-500 text-center">
                Add your Lottie URL in <span className="font-mono">NEXT_PUBLIC_DOTLOTTIE_URL</span> to display the animation.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Contact Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[#010333] mb-4">Send a Message</h2>
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">✗ Something went wrong!</p>
                <p className="text-red-600 text-sm mt-1">{errorMessage || 'Please try again or contact me directly via email.'}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#010333] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-[#010333] placeholder:text-gray-400 focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe] transition-all hover:border-gray-300 focus:shadow-lg"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#010333] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-[#010333] placeholder:text-gray-400 focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe] transition-all hover:border-gray-300 focus:shadow-lg"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Service */}
              <div>
                <label htmlFor="service" className="block text-sm font-semibold text-[#010333] mb-2">
                  Service Interested In
                </label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="block w-full px-4 py-3.5 pr-10 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-[#010333] focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe] transition-all hover:border-gray-300 focus:shadow-lg cursor-pointer appearance-none"
                    style={{ color: formData.service ? '#010333' : '#9ca3af' }}
                  >
                    <option value="" style={{ color: '#9ca3af' }}>Select a service</option>
                    <option value="web-development" style={{ color: '#010333' }}>Web Development</option>
                    <option value="mobile-development" style={{ color: '#010333' }}>Mobile App Development</option>
                    <option value="ui-ux-design" style={{ color: '#010333' }}>UI/UX Design</option>
                    <option value="database-design" style={{ color: '#010333' }}>Database Design & Optimization</option>
                    <option value="devops" style={{ color: '#010333' }}>DevOps & Cloud Deployment</option>
                    <option value="consulting" style={{ color: '#010333' }}>Technical Consulting</option>
                    <option value="other" style={{ color: '#010333' }}>Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-[#010333] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-[#010333] placeholder:text-gray-400 focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe] transition-all hover:border-gray-300 focus:shadow-lg"
                  placeholder="Project inquiry"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[#010333] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-[#010333] placeholder:text-gray-400 focus:ring-2 focus:ring-[#2642fe] focus:border-[#2642fe] transition-all hover:border-gray-300 focus:shadow-lg resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-[#2642fe] to-blue-600 hover:from-[#1e35e0] hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2642fe] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      Send Message
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-2xl font-bold text-[#010333] mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Feel free to reach out through any of these channels. I typically respond within 24 hours.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2642fe] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <EnvelopeIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#010333] mb-1">Email</h3>
                  <a href="mailto:dinaolsisay18@gmail.com" className="text-[#2642fe] hover:text-blue-700 transition-colors font-medium">
                    dinaolsisay18@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Best for detailed inquiries</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <PhoneIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#010333] mb-1">Phone</h3>
                  <a href="tel:+251973403227" className="text-green-600 hover:text-green-700 transition-colors font-medium">
                    +251 97 340 3227
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Available for calls and WhatsApp</p>
                </div>
              </div>

              {/* Telegram */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <PaperAirplaneIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#010333] mb-1">Telegram</h3>
                  <a href="https://t.me/dinaols" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 transition-colors font-medium">
                    @dinaols
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Direct messaging available</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPinIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#010333] mb-1">Location</h3>
                  <p className="text-gray-700 font-medium">Ethiopia, Shager City Administration — Gefersa Guje Sub-city</p>
                  <p className="text-sm text-gray-600 mt-1">Available for remote collaboration worldwide</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#010333] mb-1">Response Time</h3>
                  <p className="text-gray-700 font-medium">Typically within 24 hours</p>
                  <p className="text-sm text-gray-600 mt-1">Available for projects and inquiries</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
              <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-[#010333] mb-4">Connect on Social Media</h3>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a
                  href="https://facebook.com/dinoverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  title="Facebook"
                >
                  <span className="text-xl">f</span>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com/dinoverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  title="Instagram"
                >
                  <span className="text-xl">◎</span>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/dinoverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  title="LinkedIn"
                >
                  <span className="text-xl">in</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#010333] mb-3">Common Questions</h2>
              <p className="text-lg text-gray-600">Quick answers to help you get started</p>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-[#010333] mb-2">
                  How long does it take to get a response?
                </h3>
                <p className="text-gray-600">
                  I typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please mention it in your message.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-[#010333] mb-2">
                  Do you work with international clients?
                </h3>
                <p className="text-gray-600">
                  Yes! I work with clients from all over the world. I'm experienced in remote collaboration 
                  and can accommodate different time zones.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-[#010333] mb-2">
                  What information should I include in my message?
                </h3>
                <p className="text-gray-600">
                  Please provide details about your project, timeline, budget range, and any specific 
                  requirements you have. The more information you provide, the better I can assist you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
