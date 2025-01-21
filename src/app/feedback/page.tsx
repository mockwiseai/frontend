import React from 'react';
import Link from 'next/link'; // Ensure you have this import for the Link component

const Feedback: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">MockAI</h1>
        <h2 className="text-2xl font-bold mb-6">Submission Successful!</h2>
        <p className="text-lg text-gray-300 mb-6">
          Thank you for your submission. We appreciate your time and will get back to you shortly.
        </p>
        <Link href="/">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Feedback;