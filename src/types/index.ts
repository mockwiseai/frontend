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