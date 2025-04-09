'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, User, Mail, Video, Mic, Info } from 'lucide-react';
import UserMedia from '@/components/practice/UserMedia';
import { API_BASE_URL } from '@/lib/utils';
import { useInterview } from '@/hooks/useInterview';

type UserDetails = {
  name: string;
  email: string;
};

export default function LiveInterviewSetup() {
  const router = useRouter();
  const params = useParams();
  const { interviewId } = params;
  
  const [error, setError] = useState<string | null>(null);
  const { setUser, interview: interviewInfo, isLoading } = useInterview();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
  });

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Handle media permissions
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setIsPermissionGranted(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Failed to get media permissions:', err);
        setMediaError('Camera and microphone access is required for the interview.');
      }
    };

    requestPermissions();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setUser({ email: userDetails.email, name: userDetails.name });
  };

  const handleStart = async () => {
    if (!isPermissionGranted) {
      setMediaError('Please enable camera and microphone access');
      return;
    }

    if (!userDetails.name || !userDetails.email) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      if (typeof window === 'undefined') {
        return;
      }

      localStorage.setItem('user', JSON.stringify(userDetails));
      const response = await fetch(`${API_BASE_URL}/candidates/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          ...userDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      router.push(`/live/${interviewId}/session`);
    } catch (err) {
      setError('Failed to start interview. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[600px] mx-auto"
        >
          <div className="bg-[#1E1E1E] rounded-xl p-4 sm:p-8 border border-gray-800">
            {/* Interview Information */}
            <div className="mb-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                {interviewInfo?.title || 'Interview Setup'}
              </h1>
              <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Duration: {interviewInfo?.totalTime} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>Difficulty: {interviewInfo?.difficulty}</span>
                </div>
              </div>
            </div>

            {/* User Details Form */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-medium">
                  <User className="w-5 h-5 text-indigo-400" />
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleDetailsChange}
                  className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 px-4 
                           text-white focus:border-indigo-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-medium">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleDetailsChange}
                  className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 px-4 
                           text-white focus:border-indigo-500 transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Camera Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-base font-medium">
                    <Video className="w-5 h-5 text-indigo-400" />
                    Camera Preview
                  </label>
                  <div className="flex items-center gap-2">
                    <Video className={`w-4 h-4 ${isPermissionGranted ? 'text-green-400' : 'text-red-400'}`} />
                    <Mic className={`w-4 h-4 ${isPermissionGranted ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden bg-[#2A2A2A]">
                  {isPermissionGranted ? (
                    <UserMedia />
                  ) : (
                    <div className="p-4 text-sm text-red-400">
                      {mediaError || 'Requesting camera and microphone access...'}
                    </div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full py-3 rounded-lg text-base font-medium bg-indigo-600 
                         hover:bg-indigo-700 transition-colors mt-6"
              >
                Join Interview
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}