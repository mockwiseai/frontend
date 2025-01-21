'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { baseUrl } from '@/utils/baseUrl';

// Types
interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solved: boolean;
}

// Mock Data
const mockQuestions: Question[] = Array.from({ length: 100 }, (_, i) => ({
  id: `q${i + 1}`,
  title: `Two Sum ${i + 1}`,
  difficulty: ['Easy', 'Medium', 'Hard'][
    Math.floor(Math.random() * 3)
  ] as Question['difficulty'],
  category: ['Arrays', 'Strings', 'Trees', 'Dynamic Programming'][
    Math.floor(Math.random() * 4)
  ],
  solved: Math.random() > 0.5,
}));

// Difficulty Badge Component
const DifficultyBadge = ({
  difficulty,
}: {
  difficulty: Question['difficulty'];
}) => {
  const colors = {
    easy: 'bg-green-500/20 text-green-500',
    medium: 'bg-yellow-500/20 text-yellow-500',
    hard: 'bg-red-500/20 text-red-500',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm ${colors[difficulty]} whitespace-nowrap`}
    >
      {difficulty}
    </span>
  );
};

// Main Component
export default function History() {
  const { token, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const questionsPerPage = 10;

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

      setData(response?.data?.data || []);

      // setData(response?.data);
    } catch (error) {
      console.error('Error fetching coding questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentSubmissions();
  }, []);

  // Filter questions based on search and difficulty
  const filteredQuestions = data?.filter((question: any) => {
    const questionId = question.questionId || {};

    const searchField =
      question.questionType === 'CodingQuestion'
        ? questionId.title || '' // For Coding Questions
        : questionId.question || ''; // For Behavioral Questions

    return searchField.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const visibleQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  console.log({
    visibleQuestions,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
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
    <div className="relative w-full px-5  bg-[#121212] min-h-screen">
      {/* Main content wrapper with proper spacing from sidebar */}
      <div
        className="relative transition-all duration-300
          /* Sidebar spacing */
        pr-4 sm:pr-6 lg:pr-8  /* Right padding */
        "
      >
        <div className="w-full mx-auto">
          {' '}
          {/* Centered container with max width */}
          <div className="py-6 sm:py-8 space-y-4 sm:space-y-6">
            {/* Header Section */}
            <div className="px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                Your History
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                View your attempted questions and progress.
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
            </div>

            {data && data?.length > 0 && (
              <>
                <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
                  {visibleQuestions.map((question: any) => (
                    <motion.div
                      key={question._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 sm:p-4 bg-[#1E1E1E] border border-gray-700 rounded-xl hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {' '}
                          {/* Added min-w-0 to prevent text overflow */}
                          <h3 className="text-base sm:text-lg font-semibold truncate mb-2 text-white">
                            {question.questionType === 'CodingQuestion'
                              ? question.questionId?.title || 'Untitled'
                              : question.questionId?.question || 'Untitled'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            {question.questionType === 'CodingQuestion' &&
                              question.questionId?.difficulty && (
                                <DifficultyBadge
                                  difficulty={question.questionId.difficulty}
                                />
                              )}
                            <span className="text-xs sm:text-sm text-gray-400">
                              {question.category || 'General'}
                            </span>
                          </div>
                        </div>

                        <span className="text-sm sm:text-base text-green-500 flex-shrink-0">
                          Solved
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

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
                            typeof page === 'number'
                              ? handlePageChange(page)
                              : null
                          }
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base min-w-[32px] sm:min-w-[40px] ${
                            page === currentPage
                              ? 'bg-indigo-600 text-white'
                              : 'bg-[#1E1E1E] border border-gray-700 hover:bg-[#2A2A2A] text-white'
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
