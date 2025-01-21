'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

export interface PricingCardProps {
  title: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  period, 
  features, 
  isPopular = false 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-2xl backdrop-blur-sm ${
        isPopular 
          ? 'bg-gradient-to-b from-indigo-600/90 to-purple-600/90 border-2 border-indigo-400'
          : 'bg-gradient-start/50 border border-gray-700'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 rounded-full text-sm font-medium">
          Most Popular
        </span>
      )}
      
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      
      <div className="mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-400">/{period}</span>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-indigo-500" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link href="/auth/register">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isPopular
              ? 'bg-white text-indigo-600 hover:bg-gray-100'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          Get Started
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default PricingCard;
