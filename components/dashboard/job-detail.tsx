// components/dashboard/job-detail.tsx
import React from 'react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface JobLog {
  time: string;
  message: string;
  level: string;
}

interface JobApplication {
  jobTitle: string;
  company: string;
  location: string;
  appliedAt: string;
  result: string;
}

interface JobDetailProps {
  job: {
    _id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    completedAt?: string;
    searchKeywords: string;
    searchLocation: string;
    maxApplications: number;
    jobsProcessed: number;
    jobsApplied: number;
    jobsSkipped: number;
    jobsBlacklisted: number;
    jobsAlreadyApplied: number;
    jobsExtraInfoNeeded: number;
    logs: JobLog[];
    applications: JobApplication[];
    errorMessage?: string;
  };
}

export function JobDetail({ job }: JobDetailProps) {
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
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <Card title="Job Details" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="mt-1">{getStatusBadge(job.status)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Search Keywords</p>
            <p className="mt-1">{job.searchKeywords}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Search Location</p>
            <p className="mt-1">{job.searchLocation}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Max Applications</p>
            <p className="mt-1">{job.maxApplications}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="mt-1">{formatDate(job.createdAt)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="mt-1">{formatDate(job.updatedAt)}</p>
          </div>
          
          {job.startedAt && (
            <div>
              <p className="text-sm font-medium text-gray-500">Started At</p>
              <p className="mt-1">{formatDate(job.startedAt)}</p>
            </div>
          )}
          
          {job.completedAt && (
            <div>
              <p className="text-sm font-medium text-gray-500">Completed At</p>
              <p className="mt-1">{formatDate(job.completedAt)}</p>
            </div>
          )}
        </div>
        
        {job.errorMessage && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">Error Message</p>
            <p>{job.errorMessage}</p>
          </div>
        )}
      </Card>
      
      <Card title="Application Statistics" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Processed</p>
            <p className="mt-1 text-2xl font-semibold">{job.jobsProcessed}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Applied</p>
            <p className="mt-1 text-2xl font-semibold">{job.jobsApplied}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Skipped</p>
            <p className="mt-1 text-2xl font-semibold">{job.jobsSkipped}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Blacklisted</p>
            <p className="mt-1 text-2xl font-semibold">{job.jobsBlacklisted}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Already Applied</p>
            <p className="mt-1 text-2xl font-semibold">{job.jobsAlreadyApplied}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Extra Info Needed</p>
            <p className="mt-1 text-2xl font-semibold">{job.jobsExtraInfoNeeded}</p>
          </div>
        </div>
      </Card>
      
      {job.applications.length > 0 && (
        <Card title="Applications" className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {job.applications.map((application, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {application.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.appliedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      <Card title="Logs" className="mb-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {job.logs.map((log, index) => {
            const logClass = 
              log.level === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              log.level === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-gray-50 border-gray-200 text-gray-800';
              
            return (
              <div key={index} className={`p-3 rounded-md border ${logClass}`}>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{log.level.toUpperCase()}</span>
                  <span className="text-xs text-gray-500">{formatDate(log.time)}</span>
                </div>
                <p className="mt-1 text-sm">{log.message}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}