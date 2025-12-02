'use client';

import { 
  CodeBracketIcon, 
  PaintBrushIcon, 
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  HeartIcon,
  LightBulbIcon,
  CheckBadgeIcon,
  CalendarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

const skills = [
  {
    category: 'Web Development',
    icon: CodeBracketIcon,
    items: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB'],
    color: 'from-[#2642fe] to-[#3b52ff]'
  },
  {
    category: 'Mobile Development',
    icon: DevicePhoneMobileIcon,
    items: ['React Native', 'Expo', 'iOS', 'Android', 'Cross-platform'],
    color: 'from-[#2642fe] to-[#3b52ff]'
  },
  {
    category: 'Design & Content',
    icon: PaintBrushIcon,
    items: ['Graphic Design', 'Logo Design', 'Brand Identity', 'UI/UX Design', 'Video Content Creation', 'YouTube'],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    category: 'Trading & Analysis',
    icon: LightBulbIcon,
    items: ['Cryptocurrency Trading', 'Forex Trading', 'Market Analysis', 'Financial Planning'],
    color: 'from-green-500 to-emerald-600'
  },
];

const journey = [
  {
    year: '2009-2016',
    title: 'Foundation',
    description: 'Completed primary education at Abebe Kolu Primary School, laying the foundation for my academic journey.',
    icon: AcademicCapIcon,
  },
  {
    year: '2017-2018',
    title: 'High School',
    description: 'Attended Regasa Bulto (Grade 9) and Jeldu High School (Grade 10), continuing my educational path.',
    icon: AcademicCapIcon,
  },
  {
    year: '2019-2020',
    title: 'Completion',
    description: 'Advanced through Jeldu Preparatory School (Grade 11) and completed secondary education at Burka Nono (Grade 12).',
    icon: CheckBadgeIcon,
  },
  {
    year: '2025',
    title: 'Graduation',
    description: 'Completed Computer Science degree from Dilla University, equipped with comprehensive knowledge in technology, development, and design.',
    icon: CheckBadgeIcon,
  },
  {
    year: 'Present',
    title: 'Dinoverse',
    description: 'Building a multifaceted career combining web/mobile development, graphic design, trading, and content creation.',
    icon: RocketLaunchIcon,
  },
];

const values = [
  {
    title: 'Quality First',
    description: 'Every project is crafted with attention to detail and best practices.',
    icon: CheckBadgeIcon,
  },
  {
    title: 'Client-Centric',
    description: 'Your vision drives everything. Clear communication and collaboration throughout.',
    icon: HeartIcon,
  },
  {
    title: 'Innovation',
    description: 'Staying current with latest technologies and design trends to deliver cutting-edge solutions.',
    icon: LightBulbIcon,
  },
  {
    title: 'Reliability',
    description: 'On-time delivery, transparent process, and ongoing support when you need it.',
    icon: RocketLaunchIcon,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#010333] via-[#1a1f4a] to-[#010333]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#010333]/50 to-transparent"></div>
        
        <div className="relative z-10 px-6 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-md mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <HeartIcon className="h-5 w-5 text-[#2642fe]" />
              About Dinoverse
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-white to-[#2642fe] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(38,66,254,0.25)]">
                Crafting Digital
              </span>
              <br />
              <span className="text-3xl sm:text-4xl font-bold text-white/90 mt-4 block">
                Experiences That Matter
              </span>
            </motion.h1>

            {/* Intro paragraph */}
            <motion.p
              className="text-xl sm:text-2xl font-medium text-white/80 leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hi, I'm <span className="text-[#2642fe] font-semibold">Dinaol Sisay</span> — a Computer Science graduate from Dilla University (2025), passionate developer, designer, and creator dedicated to turning ideas into beautiful, functional digital experiences.
            </motion.p>

            {/* Floating decorative elements */}
            <div className="absolute top-20 right-10 hidden lg:block">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 1.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <StarIcon className="w-6 h-6 text-[#2642fe]/40" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {/* Story Section */}
        <motion.div
          className="mx-auto max-w-3xl mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-[#010333] mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            My Story
          </motion.h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              My name is <span className="font-semibold text-[#010333]">Dinaol Sisay</span>, and I am a dedicated 
              Computer Science graduate from <span className="font-semibold">Dilla University</span> (class of 2025). 
              Dinoverse represents my passion for creating digital experiences that combine technical excellence with 
              creative vision.
            </p>
            <p>
              My educational journey began at Abebe Kolu Primary School, where I laid the foundation for my 
              academic pursuits from 2009 to 2016. I continued my studies through high 
              school, attending Regasa Bulto for Grade 9 in 2017, followed by Jeldu High School for Grade 10 in 
              2018. I further advanced my education at Jeldu Preparatory School during Grade 11 in 2019 and 
              completed my secondary education at Burka Nono in Grade 12 in 2020.
            </p>
            <p>
              Beyond my academic achievements, I possess a diverse skill set that extends into various fields. 
              I am proficient in crypto and forex trading, showcasing my analytical abilities and understanding of 
              financial markets. Additionally, I have experience in graphic design and web and mobile app development. 
              I am also an active YouTuber, where I share insights and engage with a broader audience.
            </p>
            <p>
              My multifaceted talents reflect my commitment to continuous learning and innovation, making me a 
              promising figure in the tech community. Whether you're a startup launching your first product, a 
              business looking to modernize, or a creator needing design work, I'm here to help you succeed.
            </p>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[#010333] mb-3">Skills & Expertise</h2>
            <p className="text-lg text-gray-600">Technologies and tools I work with daily</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.category}
                  className="group relative rounded-3xl border-2 border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.color} text-white shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#010333] mb-4">{skill.category}</h3>
                  <ul className="space-y-2">
                    {skill.items.map((item, i) => (
                      <motion.li
                        key={item}
                        className="flex items-center text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + i * 0.05 }}
                      >
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#2642fe]"></span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[#010333] mb-3">Journey</h2>
            <p className="text-lg text-gray-600">The path that led to Dinoverse</p>
          </motion.div>

          <div className="relative">
            {/* Animated Timeline line */}
            <motion.div
              className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-[#2642fe] via-blue-400 to-[#2642fe] hidden md:block"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />

            <div className="space-y-12">
              {journey.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="relative flex items-start gap-6"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    {/* Icon */}
                    <motion.div
                      className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2642fe] to-blue-600 text-white shadow-lg ring-4 ring-white"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      className="flex-1 pt-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    >
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-sm font-bold text-[#2642fe]">{item.year}</span>
                        <h3 className="text-xl font-bold text-[#010333]">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[#010333] mb-3">What I Value</h2>
            <p className="text-lg text-gray-600">The principles that guide my work</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2642fe]/10 text-[#2642fe]"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-[#010333] mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="rounded-3xl bg-gradient-to-r from-[#2642fe] to-blue-600 p-12 text-center text-white shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
          
          <div className="relative z-10">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Let's Work Together
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Have a project in mind? I'd love to hear about it and explore how we can bring your vision to life.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-[#2642fe] shadow-lg hover:opacity-90 transition"
                >
                  Get in Touch
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition"
                >
                  View My Work
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

