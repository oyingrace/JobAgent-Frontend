'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Client-side hook for handling authentication
 * Redirects to sign-in if not authenticated
 * Returns session data and loading state
 */
export function useAuth(redirectTo = '/auth/signin') {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);
  
  return {
    user: session?.user,
    isLoading,
    isAuthenticated
  };
}

/**
 * Client-side hook for checking authentication status
 * Does not redirect
 */
export function useAuthStatus() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  };
}