'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  Brain,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface PricingPlan {
  period: 'weekly' | 'monthly' | 'yearly';
  price: number;
  title: string;
  features: string[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Your Progress',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Coding Questions',
    icon: Code2,
    href: '/dashboard?tab=coding',
  },
  {
    title: 'Behavioral Questions',
    icon: Brain,
    href: '/dashboard?tab=behavioral',
  },
  {
    title: 'History',
    icon: History,
    href: '/dashboard?tab=history',
  },
];

const pricingPlans: PricingPlan[] = [
  {
    period: 'weekly',
    price: 6.99,
    title: 'Weekly Pass',
    features: [
      'Unlimited practice sessions',
      'Basic AI feedback',
      'Standard question bank',
      'Community support',
    ],
  },
  {
    period: 'monthly',
    price: 14.99,
    title: 'Monthly Pro',
    features: [
      'Everything in Weekly Pass',
      'Advanced AI interview feedback',
      'Premium question bank',
      'Performance analytics',
      'Priority support',
    ],
  },
  {
    period: 'yearly',
    price: 99.99,
    title: 'Yearly Premium',
    features: [
      'Everything in Monthly Pro',
      'Custom learning path',
      'Mock interview recordings',
      'Resume review',
      'Career coaching session',
      '24/7 priority support',
    ],
  },
];

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-6 sm:py-10 px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-[90vw] sm:max-w-[400px]">
        {children}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const periodSuffix = {
    weekly: '/week',
    monthly: '/month',
    yearly: '/year',
  }[plan.period];

  const isPopular = plan.period === 'monthly';

  return (
    <div className="w-full sm:w-[400px] p-4 sm:p-8 rounded-2xl bg-gradient-to-b from-violet-600/90 to-violet-800/90 relative overflow-hidden">
      {isPopular && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-violet-500 rounded-full text-xs sm:text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.title}</h3>
      <div className="mb-4 sm:mb-6">
        <span className="text-3xl sm:text-4xl font-bold">${plan.price}</span>
        <span className="text-gray-300 ml-1">{periodSuffix}</span>
      </div>
      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 sm:gap-3">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-violet-300 flex-shrink-0" />
            <span className="text-sm sm:text-base text-gray-200">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium bg-white text-violet-700 hover:bg-gray-100 transition-colors text-sm sm:text-base">
        Get Started
      </button>
    </div>
  );
};

const PricingSelector: React.FC<{
  selected: string;
  onChange: (period: string) => void;
}> = ({ selected, onChange }) => {
  return (
    <div className="inline-flex p-1 rounded-full bg-gray-800/50 backdrop-blur-sm overflow-x-auto">
      {['weekly', 'monthly', 'yearly'].map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            selected === period
              ? 'bg-violet-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  );
};

const PricingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'weekly' | 'monthly' | 'yearly'
  >('monthly');
  const currentPlan = pricingPlans.find(
    (plan) => plan.period === selectedPeriod
  )!;

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gray-900/95 rounded-xl sm:rounded-2xl w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent text-center">
        Choose Your Plan
      </h2>
      <p className="text-gray-400 mb-6 sm:mb-8 text-center max-w-md text-sm sm:text-base">
        Get unlimited access to AI-powered interview practice and expert
        feedback
      </p>

      <PricingSelector
        selected={selectedPeriod}
        onChange={(period) =>
          setSelectedPeriod(period as 'weekly' | 'monthly' | 'yearly')
        }
      />

      <div className="mt-6 sm:mt-8 w-full sm:w-auto">
        <PricingCard plan={currentPlan} />
      </div>

      <div className="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm">
        Need help? Check out our{' '}
        <a href="#" className="text-violet-400 hover:underline">
          FAQ page
        </a>{' '}
        or{' '}
        <a href="#" className="text-violet-400 hover:underline">
          contact us
        </a>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const router = useRouter();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const isActiveLink = (href: string) => {
    const hrefTab = new URLSearchParams(href.split('?')[1]).get('tab');
    if (href === '/dashboard' && !hrefTab) {
      return pathname === href && !currentTab;
    }
    return hrefTab === currentTab;
  };

  const getAvatarText = (name: string = 'User') => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? '64px' : '240px',
        }}
        className=" bg-[#121212] border-r border-gray-800 z-40 "
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800">
            {!isCollapsed && (
              <Link href="/" className="text-lg font-semibold">
                MockWise
              </Link>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 pt-1">
            {menuItems.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center h-12 mb-1 transition-colors ${
                      isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    <div
                      className={`w-16 flex items-center justify-center ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    {!isCollapsed && (
                      <span
                        className={`${
                          isActive ? 'text-white' : 'text-gray-400'
                        } text-base font-normal`}
                      >
                        {item.title}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Button */}
          <div className="mt-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full h-14 bg-indigo-600 flex items-center justify-center hover:bg-indigo-700"
            >
              {isCollapsed ? (
                <span className="text-lg">⭐</span>
              ) : (
                <span className="text-base font-normal text-white">
                  Upgrade to Premium
                </span>
              )}
            </button>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800">
            {/* User Profile */}
            <div className="flex items-center h-14 hover:bg-gray-800 transition-colors">
              <div className="w-16 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  {user && typeof user.name === 'string' ? (
                    <span className="text-white font-normal">
                      {getAvatarText(user.name)}
                    </span>
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              {!isCollapsed && (
                <span className="text-white text-base font-normal">
                  {user?.name || 'User'}
                </span>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center h-14 transition-colors hover:bg-gray-800"
            >
              <div className="w-16 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-gray-400" />
              </div>
              {!isCollapsed && (
                <span className="text-gray-400 text-base font-normal">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Premium Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PricingModal onClose={() => setIsModalOpen(false)} />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
