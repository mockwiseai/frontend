'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/utils';
import { useInterview } from '@/hooks/useInterview';

type Question = {
  questionId: string;
  questionType: 'CodingQuestion' | 'BehavioralQuestion';
  title: string;
  description: string;
  difficulty?: string;
};

type InterviewSession = {
  id: string;
  title: string;
  totalTime: number;
  questions: Question[];
  submission: {
    answers: {
      questionId: string;
      answer: string;
    }[];
  };
  status: 'pending' | 'completed' | 'in-progress';
};

export default function InterviewSession() {
  const router = useRouter();
  const params = useParams();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { interview } = useInterview();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        let user = localStorage.getItem('user') || JSON.stringify({ email: '' });
        if (user) user = JSON.parse(user);
        const response = await fetch(`${API_BASE_URL}/recruiter/interviews/session/${params.interviewId}?email=${user?.email}`);
        if (!response.ok) throw new Error('Failed to fetch interview');
        const data = await response.json();

        setSession(data.data);
      } catch (err) {
        setError('Failed to load interview session');
      } finally {
        setIsLoading(false);
      }
    };


    fetchSession();
  }, [params.interviewId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-wrap gap-6">
          {session.questions.map((question) => (
            <div
              key={question.questionId}
              className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 w-full"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
                  <div className="text-sm text-gray-400">
                    {question.difficulty && `${question.difficulty} • `}
                    {question.questionType === 'CodingQuestion' ? '💻 Coding' : '💭 Behavioral'}
                  </div>
                </div>
                <button
                  disabled={session?.submission?.answers?.find((ans: any) => ans.questionId === question.questionId) !== undefined}
                  onClick={() => router.push(`/live/${params.interviewId + "/session/" + question.questionId}`)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-sm"
                >
                  {
                    session?.submission?.answers?.find((ans: any) => ans.questionId === question.questionId)
                      ? 'Submitted'
                      : 'Start'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-center mt-8'>
          <button
            onClick={() => {
              
              router.push(`/live/${interview?._id}/complete`)
            }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Submit Interview
          </button>
        </div>
      </div>
    </div>
  );
}