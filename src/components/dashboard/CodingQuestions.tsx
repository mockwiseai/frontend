import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { baseUrl } from '@/utils/baseUrl';

// Types
interface Question {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solved: boolean;
}

// Difficulty Badge Component
const DifficultyBadge = ({ difficulty }: { difficulty: Question['difficulty']; }) => {
  const colors = {
    easy: 'bg-green-500/20 text-green-500',
    medium: 'bg-yellow-500/20 text-yellow-500',
    hard: 'bg-red-500/20 text-red-500',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[difficulty]} whitespace-nowrap`}>
      {difficulty}
    </span>
  );
};

export default function CodingQuestions() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const questionsPerPage = 10;

  // Fetch coding questions with search and filter parameters
  const fetchAllCodingQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/questions/coding/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          title: searchQuery || undefined,
          difficulty: difficulty !== 'All' ? difficulty : undefined,
          page: currentPage,
          limit: questionsPerPage,
        },
      });

      setData(response.data.data.questions);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching coding questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCodingQuestions();
  }, [searchQuery, difficulty, currentPage]); 

  return (
    <div className="relative px-5 w-full bg-[#121212] min-h-screen">
      <div className="relative transition-all duration-300 pr-4 sm:pr-6 lg:pr-8">
        <div className="w-full mx-auto">
          <div className="py-6 sm:py-8 space-y-4 sm:space-y-6">
            <div className="px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Coding Questions</h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Practice coding problems and improve your skills
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder='Search questions...'
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1E1E1E] border border-gray-700 rounded-lg text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2.5 bg-[#1E1E1E] border border-gray-700 rounded-lg text-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="All">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-12"
              >
                <div className="w-8 h-8 border-2 border-t-[4px] border-gray-700 rounded-full animate-spin"></div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {data?.map((question) => (
                  <motion.div key={question?._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="p-4 bg-[#1E1E1E] border border-gray-700 rounded-lg">
                      <h3 className="text-white">{question.title}</h3>
                      <DifficultyBadge difficulty={question.difficulty} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-2 py-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-[#1E1E1E] border border-gray-700 text-white rounded-lg"
              >
                <ChevronLeft />
              </button>
              <span className="text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-[#1E1E1E] border border-gray-700 text-white rounded-lg"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
