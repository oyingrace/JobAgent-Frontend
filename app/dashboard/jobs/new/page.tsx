// app/dashboard/jobs/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { JobForm } from '@/components/forms/job-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/alert';
import Link from 'next/link';

export default function NewJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [readyMessage, setReadyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [remainingApplications, setRemainingApplications] = useState<number>(0);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      // Check if user is ready to start a job search
      fetch('/api/profile')
        .then(res => res.json())
        .then(profileData => {
          setProfile(profileData.profile || {});
          
          // Check LinkedIn credentials
          return fetch('/api/credentials').then(res => res.json());
        })
        .then(credentialsData => {
          const hasCredentials = credentialsData.hasCredentials;
          
          // Check resume
          return fetch('/api/resume').then(res => res.json()).then(resumeData => {
            const hasUploadedResume = resumeData.hasResume;
            
            // Fetch subscription data
            return fetch('/api/subscription').then(res => res.json()).then(subscriptionData => {
              setRemainingApplications(subscriptionData.remainingApplications);
              
              // Determine if ready
              const profileComplete = !!profile;
              const linkedInConnected = hasCredentials;
              const resumeUploaded = hasUploadedResume;
              
              if (!profileComplete) {
                setReadyMessage('Please complete your profile before starting a job search.');
              } else if (!linkedInConnected) {
                setReadyMessage('Please connect your LinkedIn account before starting a job search.');
              } else if (!resumeUploaded) {
                setReadyMessage('Please upload your resume before starting a job search.');
              } else {
                setIsReady(true);
              }
              
              setIsLoading(false);
            });
          });
        })
        .catch(err => {
          console.error('Error checking readiness:', err);
          setReadyMessage('An error occurred while checking your setup. Please try again.');
          setIsLoading(false);
        });
    }
  }, [status, router, session, profile]);
  
  const handleSubmit = async (data: any) => {
    // Make sure job doesn't exceed remaining applications
    if (data.maxApplications > remainingApplications) {
      throw new Error(`You can only apply to a maximum of ${remainingApplications} jobs based on your current subscription plan.`);
    }
    
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create job');
    }
    
    const result = await response.json();
    
    // Redirect to job details page
    router.push(`/dashboard/jobs/${result.jobId}`);
  };
  
  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Start New Job Search</h1>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Start New Job Search</h1>
      
      {remainingApplications === 0 && (
        <Alert type="warning" className="mb-6">
          <p className="font-medium">Application limit reached</p>
          <p className="text-sm">You have used all your monthly application quota. 
            <Link href="/dashboard/subscription" className="ml-1 underline">
              Upgrade your plan
            </Link> to continue applying to jobs.
          </p>
        </Alert>
      )}
      
      <JobForm 
        initialData={{
          searchKeywords: profile?.searchKeywords || '',
          searchLocation: profile?.searchLocation || '',
          maxApplications: profile?.maxApplications || (remainingApplications > 10 ? 10 : remainingApplications),
          datePosted: profile?.datePosted || 'Past Month',
        }}
        onSubmit={handleSubmit}
        isReady={isReady}
        readyMessage={readyMessage}
      />
    </div>
  );
}