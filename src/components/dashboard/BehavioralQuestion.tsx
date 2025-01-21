'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  PenSquare,
  Play,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AnswerModal from './AnswerModal';
import axios from 'axios';
import { baseUrl } from '@/utils/baseUrl';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

interface BehavioralQuestion {
  id: string;
  question: string;
  category: string;
  answered: boolean;
}

const CategoryBadge = ({ category }: { category: string }) => {
  const colors: Record<string, string> = {
    Leadership: 'bg-purple-500/20 text-purple-500',
    'Problem Solving': 'bg-blue-500/20 text-blue-500',
    Teamwork: 'bg-green-500/20 text-green-500',
    Communication: 'bg-pink-500/20 text-pink-500',
    Adaptability: 'bg-orange-500/20 text-orange-500',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm ${
        colors[category] || 'bg-gray-500/20 text-gray-500'
      } whitespace-nowrap`}
    >
      {category}
    </span>
  );
};

export default function BehavioralQuestions() {
  const { token, user } = useAuth();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<BehavioralQuestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BehavioralQuestion[]>([]);

  const questionsPerPage = 10;

  // Fetch behavioral questions from API
  const fetchAllBehaviourQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${baseUrl}/api/questions/behaviour/all`);

      const fetchedQuestions = response?.data?.data.map((question: any) => ({
        id: question._id,
        question: question.question,
        category: question.category,
        answered: question.answered,
        userAnswer: question.userAnswer,
      }));
      // console.log('fetchedQuestions: ', fetchedQuestions);
      setData(fetchedQuestions);
    } catch (error) {
      console.error('Error fetching behavioral questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBehaviourQuestions();
  }, []);

  // Update the question locally after saving the answer
  const handleUpdateAnswer = (updatedQuestion: BehavioralQuestion) => {
    setData((prevData) =>
      prevData.map((question) =>
        question.id === updatedQuestion.id
          ? { ...question, ...updatedQuestion }
          : question
      )
    );
  };

  // Filter questions based on search and category
  const filteredQuestions = data.filter((question) => {
    const matchesSearch = question.question
      ?.toLowerCase()
      ?.includes(searchQuery.toLowerCase());
    const matchesCategory =
      category === 'All' || question.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const visibleQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeNow = () => {
    console.log('Practice Now clicked');
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range: (string | number)[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="relative px-5 w-full bg-[#121212] min-h-screen">
      <div
        className="relative transition-all duration-300
          /* Sidebar spacing */
        pr-4 sm:pr-6 lg:pr-8  /* Right padding */
        "
      >
        <div className="w-full mx-auto">
          <div className="py-6 sm:py-8 space-y-4 sm:space-y-6">
            {/* Header Section */}
            <div className="px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                Behavioral Questions
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Practice common behavioral interview questions
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0">
              <div className="relative flex-1">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    isFocused ? 'text-indigo-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder={isFocused ? '' : 'Search questions...'}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#1E1E1E] border border-gray-700 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           text-white placeholder-gray-400 transition-all text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <select
                className="px-4 py-2.5 sm:py-3 bg-[#1E1E1E] border border-gray-700 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         text-white cursor-pointer w-full sm:w-[180px]
                         hover:border-gray-600 transition-colors text-sm sm:text-base"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
              >
                <option value="All">All Categories</option>
                {Array.from(new Set(data.map((q) => q.category))).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions List */}
            <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
              {visibleQuestions.map((question) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl hover:bg-[#2A2A2A] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {question.question}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <CategoryBadge category={question.category} />
                        {question.answered && (
                          <span className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            Answered
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setSelectedQuestion(question);
                          setIsModalOpen(true);
                        }}
                        className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors
                                 text-white font-medium flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                      >
                        <PenSquare className="w-4 h-4" />
                        <span>
                          {question.answered ? 'Edit Answer' : 'Add Answer'}
                        </span>
                      </button>
                      <button
                        onClick={handlePracticeNow}
                        className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors
                                 text-white font-medium flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                      >
                        <Play className="w-4 h-4" />
                        <span>Practice Now</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 sm:gap-2 py-4 px-2 sm:px-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg bg-[#1E1E1E] border border-gray-700 disabled:opacity-50 
                           disabled:cursor-not-allowed hover:bg-[#2A2A2A] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="flex gap-1 sm:gap-2 overflow-x-auto px-2 scrollbar-hide">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === 'number' ? handlePageChange(page) : null
                      }
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base min-w-[32px] sm:min-w-[40px] ${
                        page === currentPage
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#1E1E1E] border border-gray-700 hover:bg-[#2A2A2A]'
                      } ${page === '...' ? 'cursor-default' : ''}`}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg bg-[#1E1E1E] border border-gray-700 disabled:opacity-50 
                           disabled:cursor-not-allowed hover:bg-[#2A2A2A] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnswerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        onAnswerSaved={handleUpdateAnswer}
      />
    </div>
  );
}
