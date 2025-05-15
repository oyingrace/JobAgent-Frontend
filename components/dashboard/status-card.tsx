// components/dashboard/status-card.tsx
import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface StatusCardProps {
  activeJobs: number;
  completedJobs: number;
  totalApplications: number;
  isLoading?: boolean;
}

export function StatusCard({ 
  activeJobs, 
  completedJobs, 
  totalApplications,
  isLoading = false
}: StatusCardProps) {
  if (isLoading) {
    return (
      <Card className="mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Current Status</h3>
        {activeJobs > 0 ? (
          <Badge variant="warning">Jobs Running</Badge>
        ) : (
          <Badge variant="success">Ready</Badge>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Active Jobs</span>
          <span className="font-medium">{activeJobs}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Completed Jobs</span>
          <span className="font-medium">{completedJobs}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Total Applications</span>
          <span className="font-medium">{totalApplications}</span>
        </div>
      </div>
    </Card>
  );
}