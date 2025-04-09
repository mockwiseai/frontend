import api from './api';

export const interviewService = {
  async startInterview(difficulty: string) {
    const response = await api.post('/api/interview/start', { difficulty });
    return response.data;
  },

  async sendMessage(message: string) {
    const response = await api.post('/api/interview/message', { message });
    return response.data;
  },

  async getQuestion(difficulty: string) {
    const response = await api.get(`/api/questions?difficulty=${difficulty}`);
    return response.data;
  },

  async submitSolution(code: string, questionId: string) {
    const response = await api.post('/api/interview/submit', {
      code,
      questionId,
    });
    return response.data;
  },
};