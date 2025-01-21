export interface CompilerState {
  code: string;
  language: string;
  output: string | null;
  error: string | null;
  isRunning: boolean;
}

export interface TestCase {
  id: string;
  input: string;
  expected: string;
  output?: string;
  status?: 'passed' | 'failed';
}

export interface Question {
  id: string;
  title: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
}