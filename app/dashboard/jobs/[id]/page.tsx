// app/dashboard/jobs/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { JobDetail } from '@/components/dashboard/job-detail';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert } from '@/components/ui/alert';

export default function JobDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Set up polling for job status updates
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (!jobId) {
      router.push('/dashboard/jobs');
      return;
    }
    
    if (status === 'authenticated') {
      // Fetch job details
      fetchJobDetails();
      
      // Set up polling for active jobs
      const intervalId = setInterval(() => {
        if (job && ['pending', 'processing', 'running'].includes(job.status)) {
          fetchJobDetails(true);
        }
      }, 5000); // Poll every 5 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [status, router, jobId, job?.status]);
  
  const fetchJobDetails = async (isPolling = false) => {
    if (isPolling) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Job not found');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch job details');
        }
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      
      const data = await response.json();
      setJob(data.job);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('An error occurred while fetching job details');
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleCancel = async () => {
    if (!jobId || !job || job.status !== 'pending') return;
    
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel job');
      }
      
      // Update job status locally
      setJob({ ...job, status: 'cancelled' });
    } catch (err) {
      console.error('Error cancelling job:', err);
      setError('Failed to cancel job');
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
          <Link href="/dashboard/jobs">
            <Button variant="outline">Back to Jobs</Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
          <Link href="/dashboard/jobs">
            <Button variant="outline">Back to Jobs</Button>
          </Link>
        </div>
        <Alert type="error">{error}</Alert>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
        <div className="flex space-x-2">
          {job?.status === 'pending' && (
            <Button variant="danger" onClick={handleCancel}>
              Cancel Job
            </Button>
          )}
          {isRefreshing ? (
            <Button variant="outline" disabled>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing
            </Button>
          ) : (
            <Button variant="outline" onClick={() => fetchJobDetails()}>
              Refresh
            </Button>
          )}
          <Link href="/dashboard/jobs">
            <Button variant="outline">Back to Jobs</Button>
          </Link>
        </div>
      </div>
      
      <JobDetail job={job} />
    </div>
  );
}