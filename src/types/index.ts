export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: TestCase[];
  examples?: any[];
}

export interface TestCase {
  input: string;
  output: string;
  isHidden?: boolean;
}

export interface CodeState {
  code: string;
  language: string;
  output: string;
  isRunning: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  code: CodeState;
}

export type QuestionType = {
  id?: string;
  _id?: string;
  type: "mcq" | "coding" | "behavioral" | "oneword" | "multiselect";
  text: string;
  options?: string[];
  correctAnswer?: number | string; // Updated to allow string for oneword
  correctAnswers?: number[]; // for multiselect
  testCases?: {
    input: string;
    output: string;
  }[];
  includeTestCases?: boolean;
};

export type Interview = {
  id?: string;
  _id?: string;
  title: string;
  uniqueLink: string;
  description: string;
  duration: string;
  questions: QuestionType[];
  status: "draft" | "published";
  shareLink?: string;
  createdAt: string;
  candidates?: any[];
  recruiterId?: string;
  jobRole?: string;
  totalTime?: number;
  showTestCases?: boolean;
  startTime?: string;
  difficulty?: string;
  questionsCount?: number;
};