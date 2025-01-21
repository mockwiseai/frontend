import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useTimer(initialTime: number = 30 * 60) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setIsRunning(false);
          router.push('/setup?timeout=true');
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, router]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  return {
    timeLeft,
    isRunning,
    isExpired: timeLeft === 0,
    startTimer,
    pauseTimer,
    resetTimer
  };
}