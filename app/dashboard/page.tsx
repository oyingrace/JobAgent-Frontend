// app/dashboard/page.tsx
import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUserProfile, hasLinkedInCredentials, hasResume, getUserJobs } from '@/lib/db';
import { Card } from '@/components/ui/card';
import { SetupProgress } from '@/components/dashboard/setup-progress';
import { StatusCard } from '@/components/dashboard/status-card';
import { JobsList } from '@/components/dashboard/jobs-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null; // This should be handled by the layout
  }
  
  // Fetch user data in parallel
  const [profile, hasCredentials, userHasResume, jobs] = await Promise.all([
    getUserProfile(user.id),
    hasLinkedInCredentials(user.id),
    hasResume(user.id),
    getUserJobs(user.id)
  ]) as [any, boolean, boolean, Job[]];
  
  // Check if all required setup is complete
  const profileComplete = !!profile;
  const linkedInConnected = hasCredentials;
  const resumeUploaded = userHasResume;
  const setupComplete = profileComplete && linkedInConnected && resumeUploaded;
  
  // Calculate statistics
  const activeJobs = jobs.filter(j => ['pending', 'processing', 'running'].includes(j.status)).length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const totalApplications = jobs.reduce((sum, job) => sum + (job.jobsApplied || 0), 0);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user.name}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SetupProgress 
            profileComplete={profileComplete}
            linkedInConnected={linkedInConnected}
            resumeUploaded={resumeUploaded}
          />
          
          {setupComplete && (
            <div className="mb-6">
              <Link href="/dashboard/jobs/new">
                <Button>Start New Job Search</Button>
              </Link>
            </div>
          )}
          
          <Card title="Recent Job Applications" className="mb-6">
            <JobsList jobs={jobs.slice(0, 5)} />
            {jobs.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/jobs">
                  <Button variant="outline">View All Jobs</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
        
        <div>
          <StatusCard 
            activeJobs={activeJobs}
            completedJobs={completedJobs}
            totalApplications={totalApplications}
          />
          
          <Card title="Quick Links" className="mb-6">
            <nav className="space-y-1">
              <Link 
                href="/dashboard/profile"
                className="block px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              >
                Edit Profile
              </Link>
              <Link 
                href="/dashboard/linkedin"
                className="block px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              >
                Update LinkedIn Credentials
              </Link>
              <Link 
                href="/dashboard/resume"
                className="block px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              >
                Manage Resume
              </Link>
              <Link 
                href="/dashboard/jobs"
                className="block px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              >
                View All Jobs
              </Link>
            </nav>
          </Card>
        </div>
      </div>
    </div>
  );
}
