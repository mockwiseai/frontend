// contexts/InterviewContext.tsx
'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Question } from '@/types/interview';
import { API_BASE_URL } from '@/lib/utils';

type InterviewSession = {
    _id: string;
    title: string;
    totalTime: number;
    questions: Question[];
    status: 'pending' | 'completed' | 'in-progress';
    completedQuestions?: string[];
    userEmail: string;
    userName: string;
};
type InterviewContextType = {
    interview: InterviewSession | null;
    questions: Question[];
    currentQuestion: Question | null;
    completedQuestions: string[];
    timeRemaining: number;
    isLoading: boolean;
    error: string | null;
    user: {
        email: string;
        name: string;
    } | null;
    setInterview: (interview: InterviewSession) => void;
    setQuestions: (questions: Question[]) => void;
    setCurrentQuestion: (question: Question) => void;
    updateCompletedQuestions: (questionId: string) => void;
    submitAnswer: (questionId: string, answer: string) => Promise<void>;
    formatTime: (seconds: number) => string;
};

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const params = useParams();
    const [interview, setInterview] = useState<InterviewSession | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);

    // Fetch interview session data
    useEffect(() => {
        const fetchInterviewSession = async () => {
            try {
                const response = await fetch(API_BASE_URL +
                    `/recruiter/interviews/unique-link/${params.interviewId}`
                );
                if (!response.ok) throw new Error('Failed to fetch interview session');

                const data = await response.json();
                setInterview(data?.data);
                setQuestions(data?.data?.questions);
                setTimeRemaining(data?.data?.totalTime * 60);
                setCompletedQuestions(data.data?.completedQuestions || []);
                setUser({ email: data.email, name: data.name });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterviewSession();
    }, [params.interviewId]);

    // Timer management
    useEffect(() => {
        if (!interview || interview.status !== 'in-progress') return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleCompleteInterview();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [interview?.status]);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const updateCompletedQuestions = useCallback((questionId: string) => {
        setCompletedQuestions((prev) => [...prev, questionId]);
    }, []);

    const handleCompleteInterview = async () => {
        try {
            await fetch(API_BASE_URL + `/interview/session/${params.interviewId}/complete`, {
                method: 'PUT',
            });
            router.push(`/interview/${params.interviewId}/complete`);
        } catch (err) {
            setError('Failed to complete interview');
        }
    };

    const submitAnswer = async (questionId: string, answer: string) => {
        if (!user) return;

        try {
            await fetch(API_BASE_URL + '/interview/session/candidate-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewId: params.interviewId,
                    questionId,
                    answer,
                    email: user.email,
                    name: user.name,
                }),
            });

            updateCompletedQuestions(questionId);
            setCurrentQuestion(null);
        } catch (err) {
            setError('Failed to submit answer');
        }
    };

    return (
        <InterviewContext.Provider
            value={{
                interview,
                questions,
                currentQuestion,
                completedQuestions,
                timeRemaining,
                isLoading,
                error,
                user,
                setInterview,
                setQuestions,
                setCurrentQuestion,
                updateCompletedQuestions,
                submitAnswer,
                formatTime,
            }
            }
        >
            {children}
        </InterviewContext.Provider>
    );
}

export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider');
    }
    return context;
};