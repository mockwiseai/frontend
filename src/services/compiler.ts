import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const compilerService = {
  async runCode(code: string, language: string, input?: string) {
    const response = await axios.post(`${API_URL}/api/compiler/run`, {
      code,
      language,
      input,
    });
    return response.data;
  },

  async runTestCases(code: string, language: string, testCases: any[]) {
    const response = await axios.post(`${API_URL}/api/compiler/test`, {
      code,
      language,
      testCases,
    });
    return response.data;
  },
};