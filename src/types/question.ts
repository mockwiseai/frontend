export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  output: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  examples: Example[];
  testCases: TestCase[];
  constraints: string[]; // Changed from optional to required
  timeComplexity?: string;
  spaceComplexity?: string;
  solution?: string;
  starterCode?: string;
  createdAt?: string;
  updatedAt?: string;
}
