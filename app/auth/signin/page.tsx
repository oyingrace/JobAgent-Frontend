// app/auth/signin/page.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const error = searchParams?.get('error');
  
  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Sign in to LinkedIn Job Pilot</h2>
      </div>
      
      {error && (
        <Alert type="error" className="mb-4">
          {error === 'CredentialsSignin' 
            ? 'Invalid credentials'
            : 'An error occurred. Please try again.'}
        </Alert>
      )}
      
      <div className="space-y-4">
        <Button
          className="w-full flex items-center justify-center"
          onClick={() => signIn('google', { callbackUrl })}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545 12.151L12.545 12.151 12.545 12.151 9.817 14.998 9.817 14.998 9.817 14.998 12.545 12.151M12.545 12.151L15.273 14.998 18.004 12.151M12.545 12.151L9.817 9.304 12.545 6.456 15.273 9.304 12.545 12.151M5.357 5.357C8.913 1.8 14.797 1.8 18.353 5.357 21.909 8.913 21.909 14.797 18.353 18.353 14.797 21.909 8.913 21.909 5.357 18.353 1.8 14.797 1.8 8.913 5.357 5.357"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>
    </AuthLayout>
  );
}