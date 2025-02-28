'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, BarChart, LogOut, Home, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserMedia from '@/components/practice/UserMedia';

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
type Timer =
    | '15'
    | '20'
    | '25'
    | '30'
    | '35'
    | '40'
    | '45'
    | '50'
    | '55'
    | '60';

export default function Setup() {
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [timer, setTimer] = useState<Timer>('30');
    const [showTestCases, setShowTestCases] = useState<boolean>(false);
    const [showCompiler, setShowCompiler] = useState<boolean>(false);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const router = useRouter();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    useEffect(() => {
        // Request camera and microphone permissions on load
        const requestPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setIsPermissionGranted(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (err) {
                setError('You need to allow camera and microphone permissions to proceed.');
            }
        };

        requestPermissions();

        // Cleanup function to stop media tracks on unmount
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const handleStart = () => {
        if (isPermissionGranted) {
            const query = new URLSearchParams({
                difficulty,
                timer,
                showTests: showTestCases.toString(),
                showCompiler: showCompiler.toString(),
            }).toString();
            router.push(`/demo/practice?${query}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-8 sm:mb-12">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-base"
                    >
                        <Home className="w-5 h-5" />
                        Home
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-base"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

                {/* Main Setup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[600px] mx-auto"
                >
                    <div className="bg-[#1E1E1E] rounded-xl p-4 sm:p-8 border border-gray-800">
                        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">
                            Interview Setup
                        </h1>

                        {/* Camera Preview */}
                        <div className="mb-6">
                            {isPermissionGranted ? (
                                <UserMedia />
                            ) : (
                                <p className="text-sm text-red-400">
                                    {error || 'Requesting camera and microphone permissions...'}
                                </p>
                            )}
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                            {/* Difficulty Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-base sm:text-lg font-medium">
                                    <BarChart className="w-5 h-5 text-indigo-400" />
                                    Select Difficulty
                                </label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 sm:py-3 px-4 
                           text-base text-white focus:border-indigo-500 transition-colors appearance-none
                           hover:border-gray-600"
                                    style={{
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                    }}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                    <option value="random">Random</option>
                                </select>
                            </div>

                            {/* Timer Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-base sm:text-lg font-medium">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                    Select Time Limit
                                </label>
                                <select
                                    value={timer}
                                    onChange={(e) => setTimer(e.target.value as Timer)}
                                    className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 sm:py-3 px-4 
                           text-base text-white focus:border-indigo-500 transition-colors appearance-none
                           hover:border-gray-600"
                                    style={{
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                    }}
                                >
                                    {Array.from({ length: 10 }, (_, i) =>
                                        (i * 5 + 15).toString()
                                    ).map((time) => (
                                        <option key={time} value={time}>
                                            {time} minutes
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Test Cases Toggle */}
                            <div className="flex justify-between items-center w-full py-2">
                                <label
                                    htmlFor="toggleTestCases"
                                    className="flex justify-between items-center w-full cursor-pointer"
                                >
                                    <span className="text-base font-medium">
                                        Want to See Test Cases?
                                    </span>
                                    <div className="relative">
                                        <input
                                            id="toggleTestCases"
                                            type="checkbox"
                                            className="sr-only"
                                            checked={showTestCases}
                                            onChange={(e) => setShowTestCases(e.target.checked)}
                                        />
                                        <div className="block bg-gray-700 w-12 h-7 rounded-full"></div>
                                        <div
                                            className={`absolute left-1 top-1 w-5 h-5 rounded-full transition-all duration-300 ${showTestCases
                                                ? 'translate-x-5 bg-indigo-500'
                                                : 'translate-x-0 bg-white'
                                                }`}
                                        ></div>

                                    </div>
                                </label>
                            </div>

                            {/* Want to show compiler Toggle */}
                            <div className="flex justify-between items-center w-full py-2">
                                <label
                                    htmlFor="toggleCompiler"
                                    className="flex justify-between items-center w-full cursor-pointer"
                                >
                                    <span className="text-base font-medium">
                                        Want to Use Compiler?
                                    </span>
                                    <div className="relative">
                                        <input
                                            id="toggleCompiler"
                                            type="checkbox"
                                            className="sr-only"
                                            checked={showCompiler}
                                            onChange={(e) => setShowCompiler(e.target.checked)}
                                        />
                                        <div className="block bg-gray-700 w-12 h-7 rounded-full"></div>
                                        <div
                                            className={`absolute left-1 top-1 w-5 h-5 rounded-full transition-all duration-300 ${showCompiler
                                                ? 'translate-x-5 bg-indigo-500'
                                                : 'translate-x-0 bg-white'
                                                }`}
                                        ></div>
                                    </div>
                                </label>
                            </div>

                            {/* Start Button */}
                            <motion.button
                                whileHover={{ scale: isPermissionGranted ? 1.02 : 1 }}
                                whileTap={{ scale: isPermissionGranted ? 0.98 : 1 }}
                                onClick={handleStart}
                                disabled={!isPermissionGranted}
                                className={`w-full py-3 rounded-lg text-base font-medium transition-colors mt-6 ${isPermissionGranted
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                {isPermissionGranted ? 'Start Mock Interview' : 'Enable Camera & Mic to Proceed'}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Back to Home - Visible only on Mobile */}
            <div className="fixed bottom-6 left-0 right-0 md:hidden px-4">
                <button
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 
                   transition-colors text-base font-medium"
                >
                    Back to Home
                </button>
            </div>

            {/* Bottom Padding for Mobile */}
            <div className="h-20 md:hidden" />
        </div>
    );
}
