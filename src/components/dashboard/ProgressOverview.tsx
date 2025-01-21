'use client';
import { motion } from 'framer-motion';
import { Code2, Users, Timer, Trophy } from 'lucide-react';

interface ProgressStats {
  codingQuestions: {
    solved: number;
    total: number;
  };
  behavioralQuestions: {
    solved: number;
    total: number;
  };
  timeSpent: string;
  streak: number;
}

const mockStats: ProgressStats = {
  codingQuestions: { solved: 45, total: 150 },
  behavioralQuestions: { solved: 23, total: 50 },
  timeSpent: '47h',
  streak: 7,
};

const ProgressCard = ({ title, value, total, icon: Icon, color }: any) => (
  <div className="bg-gradient-start/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
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

export default function ProgressOverview() {
  return (
    <div className="relative w-full bg-[#121212] min-h-screen">
      {/* Main content with responsive sidebar spacing */}
      <div
        className="relative transition-all duration-300
          /* Sidebar spacing */
        pr-4 sm:pr-6 lg:pr-8  /* Right padding */
        py-6 sm:py-8"
      >
        <div className="w-full mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Your Progress
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Track your interview preparation journey
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
              <ProgressCard
                title="Coding Questions"
                value={`${mockStats.codingQuestions.solved}/${mockStats.codingQuestions.total}`}
                total={mockStats.codingQuestions.total}
                icon={Code2}
                color="bg-indigo-500/20 text-indigo-500"
              />
              <ProgressCard
                title="Behavioral Questions"
                value={`${mockStats.behavioralQuestions.solved}/${mockStats.behavioralQuestions.total}`}
                total={mockStats.behavioralQuestions.total}
                icon={Users}
                color="bg-green-500/20 text-green-500"
              />
              <ProgressCard
                title="Time Practiced"
                value={mockStats.timeSpent}
                icon={Timer}
                color="bg-yellow-500/20 text-yellow-500"
              />
              <ProgressCard
                title="Current Streak"
                value={`${mockStats.streak} days`}
                icon={Trophy}
                color="bg-purple-500/20 text-purple-500"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-start/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gray-700 mx-2 sm:mx-0">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <RecentActivity
                  type="coding"
                  title="Solved 'Two Sum' problem"
                  time="2 hours ago"
                />
                <RecentActivity
                  type="behavioral"
                  title="Completed 'Leadership Experience' question"
                  time="5 hours ago"
                />
                <RecentActivity
                  type="coding"
                  title="Attempted 'Valid Parentheses' problem"
                  time="1 day ago"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
