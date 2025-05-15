
// app/dashboard/linkedin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { LinkedInForm } from '@/components/forms/linkedin-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

export default function LinkedInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailHint, setEmailHint] = useState('');
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      // Check if user has LinkedIn credentials
      fetch('/api/credentials')
        .then(res => res.json())
        .then(data => {
          setHasCredentials(data.hasCredentials);
          setEmailHint(session?.user?.email || '');
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error checking credentials:', err);
          setIsLoading(false);
        });
    }
  }, [status, router, session]);
  
  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save credentials');
    }
    
    // Update local state
    setHasCredentials(true);
  };
  
  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">LinkedIn Credentials</h1>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">LinkedIn Credentials</h1>
      
      {hasCredentials && (
        <Card className="mb-6">
          <Alert type="success">
            <p className="font-medium">LinkedIn credentials saved</p>
            <p className="text-sm">You can update your credentials below if needed.</p>
          </Alert>
        </Card>
      )}
      
      <LinkedInForm 
        initialEmail={emailHint}
        onSubmit={handleSubmit}
      />
    </div>
  );
}