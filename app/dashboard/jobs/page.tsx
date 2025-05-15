// app/dashboard/jobs/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { JobsList } from '@/components/dashboard/jobs-list';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function JobsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      // Fetch user's jobs
      fetch('/api/jobs')
        .then(res => res.json())
        .then(data => {
          setJobs(data.jobs || []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching jobs:', err);
          setIsLoading(false);
        });
    }
  }, [status, router]);
  
  const handleCancelJob = async (jobId: string) => {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel job');
    }
    
    // Update local state
    setJobs(prev => 
      prev.map(job => 
        job._id === jobId ? { ...job, status: 'cancelled' } : job
      )
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <Link href="/dashboard/jobs/new">
          <Button>Start New Job Search</Button>
        </Link>
      </div>
      
      <JobsList 
        jobs={jobs}
        isLoading={isLoading}
        onCancelJob={handleCancelJob}
      />
    </div>
  );
}