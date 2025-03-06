import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScriptedInterviewProps {
  baseUrl: string;
  sessionId: string;
}

interface InterviewResponse {
  type: string;
  transcript?: string;
  feedback?: string;
  audio?: string;
}

const useScriptedInterview = ({ baseUrl, sessionId }: UseScriptedInterviewProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);

  // Use refs to manage audio queue state without re-renders
  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const playedAudiosRef = useRef(new Set<string>()); // Track played audios

  // Play the next audio in the queue
  const playNextAudio = useCallback(() => {
    // If already playing or queue is empty, do nothing
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    // Get the next audio and mark as playing
    const nextAudioBase64 = audioQueueRef.current.shift();
    if (!nextAudioBase64) return;

    // Skip if already played
    if (playedAudiosRef.current.has(nextAudioBase64)) {
      console.log('Audio already played, skipping');
      playNextAudio();
      return;
    }

    // Mark this audio as playing
    isPlayingRef.current = true;

    try {
      // Create and play the audio
      const audioUrl = `data:audio/mp3;base64,${nextAudioBase64}`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      // Track this audio as played
      playedAudiosRef.current.add(nextAudioBase64);

      console.log(`Playing audio, queue length: ${audioQueueRef.current.length}`);

      // Set up audio event handlers
      audio.onended = () => {
        console.log('Audio finished playing');
        currentAudioRef.current = null;

        // Add a small pause between responses
        setTimeout(() => {
          isPlayingRef.current = false;
          playNextAudio(); // Play the next audio in queue
        }, 1000);
      };

      audio.onerror = () => {
        console.error('Audio playback error');
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        playNextAudio(); // Try the next one
      };

      audio.play().catch(err => {
        console.error('Failed to play audio:', err);
        isPlayingRef.current = false;
        playNextAudio(); // Try the next one
      });
    } catch (err) {
      console.error('Error setting up audio playback:', err);
      isPlayingRef.current = false;
      playNextAudio(); // Try the next one
    }
  }, []);

  // Add audio to queue and start playback if needed
  const queueAudio = useCallback((audioBase64: string) => {
    // Add to queue
    audioQueueRef.current.push(audioBase64);

    // Start playback if not already playing
    if (!isPlayingRef.current) {
      playNextAudio();
    }
  }, [playNextAudio]);

  // WebSocket connection management
  useEffect(() => {
    // Reset all state on reconnection
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    playedAudiosRef.current.clear();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    // Clean up previous connection if exists
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Create WebSocket connection
    try {
      const wsUrl = `${baseUrl.replace(/^http/, 'ws')}/${sessionId}`;
      console.log(`Connecting to ${wsUrl}`);

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as InterviewResponse;
          console.log('Received message:', data);

          // Add response to list
          setResponses(prev => [...prev, data]);

          // Queue audio for playback if available
          if (data.audio) {
            queueAudio(data.audio);
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect');
    }

    // Clean up on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Clean up any playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, [baseUrl, sessionId, queueAudio]);

  return {
    isConnected,
    error,
    responses,
    isPlaying: isPlayingRef.current
  };
};

export default useScriptedInterview;