'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, MessageSquare, ArrowLeft } from 'lucide-react';

export default function ServicesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className=" mx-auto px-4 sm:px-6">
        <motion.div
          className="pt-24 sm:pt-32 pb-12 sm:pb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back to Home Button - Hidden on Mobile (using fixed bottom button instead) */}
          <motion.div
            variants={itemVariants}
            className="hidden md:block mb-8 sm:mb-12"
          >
            <Link href="/">
              <button className="flex items-center text-gray-400 hover:text-white transition-colors text-base">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            className="text-center max-w-[800px] mx-auto mb-8 sm:mb-16 px-4"
            variants={itemVariants}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Choose Your Interview Preparation Path
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Select the type of interview preparation you want to focus on
            </p>
          </motion.div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mx-auto px-2 sm:px-4">
            {/* Coding Interview Card */}
            <Link href="/setup">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1E1E1E] p-4 sm:p-6 rounded-xl border border-gray-800 cursor-pointer 
                         group transition-all duration-300 hover:border-indigo-500/30"
              >
                <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 mb-4 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white group-hover:text-indigo-400 transition-colors">
                  Coding Interviews
                </h3>
                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                  Practice coding problems with real-time feedback, multiple
                  programming languages, and AI-powered guidance.
                </p>
                <div className="flex items-center text-indigo-400 font-medium text-sm sm:text-base">
                  Get Started
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2 rotate-180" />
                </div>
              </motion.div>
            </Link>

            {/* Behavioral Interview Card (Coming Soon) */}
            <motion.div
              variants={itemVariants}
              className="bg-[#1E1E1E] p-4 sm:p-6 rounded-xl border border-gray-800 opacity-75 relative"
            >
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                Coming Soon
              </div>
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-300">
                Behavioral Interviews
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                Practice common behavioral questions, get feedback on your
                responses, and improve your soft skills.
              </p>
              <div className="flex items-center text-gray-400 font-medium text-sm sm:text-base">
                Stay Tuned
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2 rotate-180" />
              </div>
            </motion.div>

            {/* System Design Interview Card (Coming Soon) */}
            <motion.div
              variants={itemVariants}
              className="bg-[#1E1E1E] p-4 sm:p-6 rounded-xl border border-gray-800 opacity-75 relative"
            >
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                Coming Soon
              </div>
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-300">
                System Design Interviews
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                Learn how to design large-scale systems, practice common
                questions, and improve your system design skills.
              </p>
              <div className="flex items-center text-gray-400 font-medium text-sm sm:text-base">
                Stay Tuned
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2 rotate-180" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Back to Home Button */}
      <div className="fixed bottom-6 left-0 right-0 md:hidden px-4">
        <Link href="/" className="block">
          <button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 
                           transition-colors text-base font-medium"
          >
            Back to Home
          </button>
        </Link>
      </div>

      {/* Bottom Padding for Mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
