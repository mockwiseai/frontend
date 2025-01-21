'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeEnd?: () => void;
}

export default function Timer({ initialMinutes, onTimeEnd }: TimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(true);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((currentSeconds) => {
          if (currentSeconds <= 1) {
            setIsActive(false);
            onTimeEnd?.();
            return 0;
          }
          return currentSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, onTimeEnd]);

  return (
    <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
      <Clock className="text-indigo-400" size={20} />
      <span className="font-mono text-xl text-white">
        {formatTime(seconds)}
      </span>
    </div>
  );
}