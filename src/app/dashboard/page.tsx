'use client';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, Users, ArrowLeft, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import CodingQuestions from '@/components/dashboard/CodingQuestions';
import BehavioralQuestions from '@/components/dashboard/BehavioralQuestion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/utils/baseUrl';
import History from '@/components/dashboard/History';

interface ProgressStats {
  codingQuestions: {
    solved: number;
    total: number;
  };
  behavioralQuestions: {
    solved: number;
    total: number;
  };
}

const mockStats: ProgressStats = {
  codingQuestions: { solved: 45, total: 150 },
  behavioralQuestions: { solved: 23, total: 50 },
};

const ProgressCard = ({ title, value, total, icon: Icon, color }: any) => (
  <div className="bg-gradient-start/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-[#fff] text-sm">{title}</h3>
        <p className="text-2xl text-[#fff] font-bold">{value}</p>
      </div>
    </div>
    {total && (
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(Number(value.split('/')[0]) / total) * 100}%` }}
        />
      </div>
    )}
  </div>
);

const RecentActivity = ({ type, title, time }: any) => (
  <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
    {type === 'coding' ? (
      <Code2 className="w-5 h-5 text-indigo-500" />
    ) : (
      <Users className="w-5 h-5 text-green-500" />
    )}
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-400">{time}</p>
    </div>
  </div>
);

const QuickActionButton = ({
  icon: Icon,
  title,
  description,
  href,
  color,
}: any) => (
  <Link href={href}>
    <button className="w-full text-left bg-gradient-start/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-all duration-300 group">
      <div className={`p-3 rounded-lg ${color} w-fit mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  </Link>
);

function ProgressOverview() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [recentActivityData, setRecentActivityData] = useState<any>(null);

  const fetchQuestionsCounters = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/user/question-counters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response?.data);
    } catch (error) {
      console.error('Error fetching coding questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/submissions/all/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log({
        response: response.data,
      });

      setRecentActivityData(response?.data?.data || []);

      // setData(response?.data);
    } catch (error) {
      console.error('Error fetching coding questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsCounters();
    fetchRecentSubmissions();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[#fff]">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-400">
          Track your interview preparation journey
        </p>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressCard
            title="Coding Questions"
            value={`${data?.codingQuestions?.completedCodingQuestions}/${data?.codingQuestions?.totalCodingQuestions}`}
            total={data?.codingQuestions?.totalCodingQuestions}
            icon={Code2}
            color="bg-indigo-500/20 text-[#fff]"
          />
          <ProgressCard
            title="Behavioral Questions"
            value={`${data?.behavioralQuestions?.completedBehavioralQuestions}/${data?.behavioralQuestions?.totalBehavioralQuestions}`}
            total={data?.behavioralQuestions?.totalBehavioralQuestions}
            icon={Users}
            color="bg-green-500/20 text-[#fff]"
          />
        </div>
      )}

      <div className="bg-gradient-start/50 backdrop-blur-sm p-6 text-[#fff] rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivityData && recentActivityData?.length > 0 ? (
            recentActivityData?.map((activity: any) => {
              const type =
                activity.questionType === 'CodingQuestion'
                  ? 'coding'
                  : 'behavioral';
              const title =
                activity.questionId?.question ||
                `Attempted ${activity.questionType} question`;
              const time = new Date(activity.submittedAt).toLocaleString();

              return (
                <RecentActivity
                  key={activity._id}
                  type={type}
                  title={title}
                  time={time}
                />
              );
            })
          ) : (
            <p className="text-gray-400">No recent activity found.</p>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="text-[#fff]">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionButton
            icon={ArrowLeft}
            title="Go back to services"
            description="Return to services selection"
            href="/services"
            color="bg-indigo-500/20 text-indigo-500"
          />
          <QuickActionButton
            icon={Code2}
            title="Practice Coding"
            description="Start coding practice"
            href="/setup"
            color="bg-green-500/20 text-green-500"
          />
          <QuickActionButton
            icon={Brain}
            title="Practice Behavioral"
            description="Practice interview questions"
            href="/dashboard?tab=behavioral"
            color="bg-purple-500/20 text-purple-500"
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const renderContent = () => {
    switch (currentTab) {
      case 'coding':
        return <CodingQuestions />;
      case 'behavioral':
        return <BehavioralQuestions />;
      case 'learning':
      case 'history':
        return <History />;
      case 'achievement':
      case 'settings':
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
              </h2>
              <p className="text-gray-400">Coming Soon...</p>
            </div>
          </div>
        );
      default:
        return <ProgressOverview />;
    }
  };

  return renderContent();
}
