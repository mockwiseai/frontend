'use client';
import { useEffect, Suspense, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Brain, Timer, Award, Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-20 w-20 sm:h-32 sm:w-32 border-b-2 border-white"></div>
    </div>
  ),
});

// Mobile Menu Component
const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-64 bg-[#121212] border-l border-gray-800 z-50 md:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="p-4 flex justify-end border-b border-gray-800">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-4">
            <nav className="flex flex-col px-4 space-y-2">
              <Link
                href="/pricing"
                className="flex items-center h-12 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                onClick={onClose}
              >
                Pricing
              </Link>
              <Link
                href="/career"
                className="flex items-center h-12 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                onClick={onClose}
              >
                Career
              </Link>
              <Link
                href="/contact"
                className="flex items-center h-12 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                onClick={onClose}
              >
                Contact
              </Link>
              <Link
                href="/recruiter/dashboard"
                className="flex items-center h-12 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                onClick={onClose}
              >
                Enterprise
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center h-12 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                onClick={onClose}
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const splineContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = splineContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const event = new MouseEvent('mousemove', {
          clientX: e.clientX - rect.left,
          clientY: e.clientY - rect.top,
          bubbles: true,
        });
        container.dispatchEvent(event);
      }
    };

    const container = splineContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

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

  const features = [
    {
      icon: (
        <Brain className="w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4 text-indigo-500" />
      ),
      title: 'AI-Powered Learning',
      description:
        'Get real-time feedback and personalized guidance from our advanced AI system',
    },
    {
      icon: (
        <Code2 className="w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4 text-indigo-500" />
      ),
      title: 'Multiple Languages',
      description:
        'Practice in Python, JavaScript, Java, C++, and more with full language support',
    },
    {
      icon: (
        <Timer className="w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4 text-indigo-500" />
      ),
      title: 'Real Interview Simulation',
      description:
        'Experience time-bound coding challenges with real interview conditions',
    },
    {
      icon: (
        <Award className="w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4 text-indigo-500" />
      ),
      title: 'Performance Analytics',
      description:
        'Track your progress with detailed performance metrics and improvement suggestions',
    },
  ];

  return (
    <div className="min-h-screen px-5 md:px-12 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg sm:text-xl font-bold">
              MockAI
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/pricing"
                className="text-base text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/career"
                className="text-base text-gray-300 hover:text-white transition-colors"
              >
                Career
              </Link>
              <Link
                href="/contact"
                className="text-base text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/recruiter/dashboard"
                className="flex items-center h-12 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Enterprise
              </Link>
              <Link href="/dashboard">
                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors text-base">
                  Dashboard
                </button>
              </Link>
            </div>
            <button
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="pt-24 sm:pt-16 pb-12 sm:pb-20">
          <motion.div
            className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 3D Model for Mobile - Shows First */}
            <motion.div
              variants={itemVariants}
              className="w-full aspect-square relative md:hidden order-first"
              ref={splineContainerRef}
            >
              <div className="absolute inset-0">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-white"></div>
                    </div>
                  }
                >
                  <Spline
                    scene="https://prod.spline.design/6u0mm1zNlsXcYp0h/scene.splinecode"
                    className="w-full h-full"
                  />
                </Suspense>
              </div>
            </motion.div>

            {/* Left Side Content */}
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Master Your Coding Interviews
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                Practice real coding interviews with AI-powered feedback and
                real-time guidance. Boost your confidence and ace your next
                technical interview.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/demo" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Start Free Demo{' '}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border border-white hover:bg-white hover:text-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base font-medium transition-colors"
                  >
                    Join Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* 3D Model for Desktop */}
            <motion.div
              variants={itemVariants}
              className="hidden md:block w-full aspect-square relative"
              ref={splineContainerRef}
            >
              <div className="absolute inset-0">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                    </div>
                  }
                >
                  <Spline
                    scene="https://prod.spline.design/6u0mm1zNlsXcYp0h/scene.splinecode"
                    className="w-full h-full"
                  />
                </Suspense>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="py-12 sm:py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl hover:transform hover:scale-102 transition-transform duration-300"
              >
                {feature.icon}
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="py-12 sm:py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center">
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6"
            >
              Ready to Improve Your Interview Skills?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8"
            >
              Join thousands of developers who are mastering their technical
              interviews.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/auth/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
                >
                  Get Started Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Back to Home Button */}
      <div className="fixed bottom-6 left-0 right-0 md:hidden px-4">
        <Link href="/" className="block">
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 transition-colors text-base font-medium">
            Back to Home
          </button>
        </Link>
      </div>

      {/* Bottom Padding for Mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
