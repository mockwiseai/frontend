'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, getProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    // Check if token exists but user is not loaded
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');
    
    if (!isLoading) {
      if (hasToken && !user) {
        // If we have a token but no user, try to get the profile
        getProfile();
      } else if (!hasToken && !user) {
        // Only redirect if no token and no user
        if (redirect) {
          router.push(`/auth/login?redirect=${redirect}`);
        } else {
          router.push('/auth/login');
        }
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Check for token before returning null
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');
  if (!user && !hasToken) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#121212]">{children}</main>
    </div>
  );
}
