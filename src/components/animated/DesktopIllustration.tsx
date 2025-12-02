'use client';

import { motion } from 'framer-motion';
import { ComputerDesktopIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function DesktopIllustration() {
  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center justify-center">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <motion.div
          className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-10 lg:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#2642fe]/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-400/10 rounded-full blur-2xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-1/2 right-8 sm:right-12 lg:right-20 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-cyan-400/10 rounded-full blur-lg"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Desktop Illustration */}
      <div className="relative z-10">
        {/* Monitor/Desktop */}
        <motion.div
          className="relative mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Monitor Screen */}
          <div className="relative w-48 h-32 sm:w-56 sm:h-36 lg:w-64 lg:h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl border-4 border-gray-700 overflow-hidden">
            {/* Screen glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#2642fe]/20 to-blue-600/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Screen content simulation */}
            <div className="absolute inset-2 bg-white rounded">
              {/* Code lines animation */}
              <div className="p-3 space-y-2">
                {[1, 2, 3, 4, 5].map((line, i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 bg-gray-200 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: ['0%', '100%', '100%'] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                ))}
              </div>

              {/* Floating code icon */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                <ComputerDesktopIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#2642fe]/30" />
              </motion.div>
            </div>

            {/* Monitor stand */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-16 h-6 sm:w-[72px] sm:h-7 lg:w-20 lg:h-8 bg-gray-700 rounded-b-lg" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-full w-24 h-2 sm:w-28 sm:h-2.5 lg:w-32 lg:h-3 bg-gray-600 rounded" />
          </div>

          {/* Floating sparkles */}
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${20 + i * 20}%`,
                left: `${15 + i * 25}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <SparklesIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-[#2642fe]" />
            </motion.div>
          ))}
        </motion.div>

        {/* Person silhouette (simplified) */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Head */}
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full mx-auto mb-1 sm:mb-2 relative"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Glasses reflection */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#2642fe]/20 to-transparent rounded-full"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Body */}
          <div className="w-12 h-14 sm:w-14 sm:h-16 lg:w-16 lg:h-20 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-full mx-auto" />
        </motion.div>

        {/* Typing indicator */}
        <motion.div
          className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#2642fe] rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

