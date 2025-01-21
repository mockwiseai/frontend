'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import api from '@/services/api';

interface BehavioralQuestion {
  id: string;
  question: string;
  category: string;
  answered: boolean;
  userAnswer?: string | undefined;
}

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: BehavioralQuestion | null;
  onAnswerSaved: (updatedQuestion: BehavioralQuestion) => void;
}

export default function AnswerModal({
  isOpen,
  onClose,
  onAnswerSaved,
  question,
}: AnswerModalProps) {
  const [answer, setAnswer] = useState<string | undefined>('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    setAnswer(question?.userAnswer);
  }, [question]);

  const handleEnhanceWithAI = () => {
    setIsEnhancing(true);
    // AI enhancement logic will be implemented later
    setTimeout(() => {
      setIsEnhancing(false);
    }, 2000);
  };

  const handleSave = async () => {
    // Save logic will be implemented later

    try {
      const response = await api.post(
        `/api/submissions/behavioral/${question?.id}`,
        {
          userAnswer: answer,
        }
      );

      if (response?.data?.success) {
        console.log('Answer saved successfully');
        onAnswerSaved({
          ...question!,
          answered: true,
          userAnswer: answer,
        });

        setTimeout(() => {
          onClose();
        }, 700);
      }
    } catch (error) {
      console.log('Error saving answer:', error);
    }
  };

  if (!question) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#1E1E1E] rounded-xl w-full max-w-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#fff]">
                  Add Your Answer
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Question:</p>
                <p className="text-lg text-[#fff]">{question.question}</p>
              </div>
            </div>

            {/* Answer Area */}
            <div className="p-6">
              <textarea
                value={answer || ''}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-48 p-4 bg-[#2A2A2A] border border-gray-700 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         text-white placeholder-gray-400 resize-none text-base"
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
              <button
                onClick={handleEnhanceWithAI}
                disabled={isEnhancing || !answer?.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors
                         text-white font-medium flex items-center gap-2 disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors
                           text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!answer?.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors
                           text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
