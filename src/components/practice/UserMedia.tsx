'use client';

import { Video, VideoOff, Mic, MicOff, Activity } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type UserMediaProps = {
  isMutedByDefault?: boolean;
  isVideoOffByDefault?: boolean;
};
export default function UserMedia({
  isMutedByDefault = true,
  isVideoOffByDefault = true,
}: UserMediaProps) {
  const [isMuted, setIsMuted] = useState(isMutedByDefault);
  const [isVideoOff, setIsVideoOff] = useState(isVideoOffByDefault);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const initializeStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError('Failed to access camera or microphone.');
      console.error('Error accessing media devices:', err);
    }
  };

  useEffect(() => {
    initializeStream();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      
      if (isVideoOff) {
        // Turning video back on
        initializeStream();
      } else {
        // Turning video off
        videoTracks.forEach((track) => {
          track.stop();
        });
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="w-full">
      <div className="relative bg-zinc-900 rounded-xl p-4 aspect-video border border-red-900/20 shadow-lg shadow-red-900/10">
        <div className="absolute top-4 right-4">
          <Activity className="w-6 h-6 text-emerald-500" />
        </div>

        {error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : isVideoOff ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] aspect-square">
            <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center">
              <span className="text-zinc-400 text-4xl">r</span>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover rounded-lg"
          />
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            onClick={toggleMute}
            className="p-3 bg-red-900 rounded-full hover:bg-red-800 transition-colors"
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className="p-3 bg-red-900 rounded-full hover:bg-red-800 transition-colors"
            aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? (
              <VideoOff className="w-5 h-5 text-white" />
            ) : (
              <Video className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}