'use client';

import { motion } from 'framer-motion';
import { Terminal, AlertCircle, CheckCircle, Clock, Database } from 'lucide-react';

interface OutputProps {
  output: string | null;
  error: string | null;
  isLoading: boolean;
  executionTime?: number | null;
  memory?: number | null;
}

export default function Output({ output, error, isLoading, executionTime, memory }: OutputProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-indigo-400" />
          <h3 className="text-white font-medium">Output</h3>
        </div>
        {(executionTime || memory) && (
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {executionTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{executionTime}s</span>
              </div>
            )}
            {memory && (
              <div className="flex items-center gap-1">
                <Database size={14} />
                <span>{Math.round(memory / 1024)} KB</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 text-red-400"
          >
            <AlertCircle size={18} className="mt-1 flex-shrink-0" />
            <pre className="text-sm whitespace-pre-wrap font-mono">{error}</pre>
          </motion.div>
        ) : output ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 text-green-400"
          >
            <CheckCircle size={18} className="mt-1 flex-shrink-0" />
            <pre className="text-sm whitespace-pre-wrap font-mono">{output}</pre>
          </motion.div>
        ) : (
          <p className="text-gray-400 text-sm text-center">
            Run your code to see the output
          </p>
        )}
      </div>
    </div>
  );
}