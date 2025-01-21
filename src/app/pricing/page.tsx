'use client';
import { motion } from 'framer-motion';
import PricingCard, { PricingCardProps } from '@/components/pricing/PricingCard';

const plans: PricingCardProps[] = [
  {
    title: 'Weekly Pass',
    price: 6.99,
    period: 'week',
    features: [
      'Unlimited practice sessions',
      'Basic AI feedback',
      'Standard question bank',
      'Community support',
    ],
    isPopular: false,
  },
  {
    title: 'Monthly Pro',
    price: 14.99,
    period: 'month',
    isPopular: true,
    features: [
      'Everything in Weekly Pass',
      'Advanced AI interview feedback',
      'Premium question bank',
      'Performance analytics',
      'Priority support',
    ],
  },
  {
    title: 'Yearly Premium',
    price: 99.99,
    period: 'year',
    features: [
      'Everything in Monthly Pro',
      'Custom learning path',
      'Mock interview recordings',
      'Resume review',
      'Career coaching session',
      '24/7 priority support',
    ],
    isPopular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <motion.div
        className="container mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get unlimited access to AI-powered interview practice and expert feedback to accelerate your career
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.title}
              variants={itemVariants}
            >
              <PricingCard
                title={plan.title}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                isPopular={plan.isPopular}
              />
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 text-center"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Need help? Check out our{' '}
            <a href="/faq" className="text-indigo-500 hover:text-indigo-400 underline">
              FAQ page
            </a>
            {' '}or{' '}
            <a href="/contact" className="text-indigo-500 hover:text-indigo-400 underline">
              contact us
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
