import React, { useState } from 'react';
import axios from 'axios';
import { Question } from '@/types';

interface PracticePageProps {
  // Add any props if needed
}

const PracticePage: React.FC<PracticePageProps> = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium');

  const fetchQuestion = async (difficulty: string) => {
    try {
      const response = await axios.get(`/api/questions/random?difficulty=${difficulty}`);
      setQuestion(response.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleStart = () => {
    fetchQuestion(selectedDifficulty);
  };

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6">
        <select 
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="random">Random</option>
        </select>
        <button 
          onClick={handleStart}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start Mock Interview
        </button>
      </div>

      {question && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
          <p className="text-gray-700 mb-4">Difficulty: {question.difficulty}</p>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Description:</h3>
            <p>{question.description}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Examples:</h3>
            {question.examples?.map((example, index) => (
              <div key={index} className="mb-2">
                <p>Input: {example.input}</p>
                <p>Output: {example.output}</p>
                {example.explanation && <p>Explanation: {example.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;