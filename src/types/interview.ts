export interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: number;
  }
  
  export interface Question {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    constraints: string[];
    examples: Example[];
    testCases: TestCase[];
    timeComplexity: string;
    spaceComplexity: string;
  }
  
  export interface Example {
    input: string;
    output: string;
    explanation?: string;
  }
  
  export interface TestCase {
    input: string;
    expected: string;
    isHidden?: boolean;
  }