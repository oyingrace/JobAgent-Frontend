// components/dashboard/jobs-list.tsx
import React from 'react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface Job {
  _id: string;
  status: string;
  createdAt: string;
  searchKeywords: string;
  searchLocation: string;
  jobsApplied: number;
  jobsProcessed: number;
  completedAt?: string;
}

interface JobsListProps {
  jobs: Job[];
  isLoading?: boolean;
  onCancelJob?: (jobId: string) => Promise<void>;
}

export function JobsList({ jobs, isLoading = false, onCancelJob }: JobsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="info">Pending</Badge>;
      case 'processing':
      case 'running':
        return <Badge variant="warning">Running</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'cancelled':
        return <Badge>Cancelled</Badge>;
      case 'verification_needed':
        return <Badge variant="warning">Verification Needed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md animate-pulse">
        <ul className="divide-y divide-gray-200">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="px-4 py-4 sm:px-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
          No jobs found. Start your first job search!
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <li key={job._id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="text-sm font-medium text-primary-600 mr-2">
                    {job.searchKeywords}
                  </p>
                  <p className="text-sm text-gray-500">
                    in {job.searchLocation}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  {getStatusBadge(job.status)}
                </div>
              </div>
              
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Applied: {job.jobsApplied} / {job.jobsProcessed}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Created: {formatDate(job.createdAt)}
                  </p>
                  {job.completedAt && (
                    <p className="ml-4">
                      Completed: {formatDate(job.completedAt)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex justify-end space-x-2">
                <Link href={`/dashboard/jobs/${job._id}`}>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </Link>
                
                {(job.status === 'pending') && onCancelJob && (
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => onCancelJob(job._id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}