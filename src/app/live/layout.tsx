"use client";
import { InterviewProvider } from '@/hooks/useInterview';
import React from 'react'

const InterviewLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <InterviewProvider>
            <div className="min-h-screen bg-[#121212] text-white">
                {children}
            </div>
        </InterviewProvider>
    )
}

export default InterviewLayout