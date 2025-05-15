// components/dashboard/setup-progress.tsx
import React from 'react';
import { Card } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

interface SetupProgressProps {
  profileComplete: boolean;
  linkedInConnected: boolean;
  resumeUploaded: boolean;
}

export function SetupProgress({ 
  profileComplete, 
  linkedInConnected, 
  resumeUploaded 
}: SetupProgressProps) {
  const totalSteps = 3;
  const completedSteps = [profileComplete, linkedInConnected, resumeUploaded].filter(Boolean).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  return (
    <Card title="Setup Progress" className="mb-6">
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${profileComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className="ml-3 flex justify-between items-center w-full">
            <div className="text-sm font-medium text-gray-900">Complete your profile</div>
            {!profileComplete && (
              <Link href="/dashboard/profile">
                <Button size="sm" variant="outline">Complete</Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${linkedInConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className="ml-3 flex justify-between items-center w-full">
            <div className="text-sm font-medium text-gray-900">Connect your LinkedIn account</div>
            {!linkedInConnected && (
              <Link href="/dashboard/linkedin">
                <Button size="sm" variant="outline">Connect</Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full ${resumeUploaded ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className="ml-3 flex justify-between items-center w-full">
            <div className="text-sm font-medium text-gray-900">Upload your resume</div>
            {!resumeUploaded && (
              <Link href="/dashboard/resume">
                <Button size="sm" variant="outline">Upload</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {progressPercentage === 100 && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
          <p className="font-medium">All set!</p>
          <p className="text-sm">You're ready to start applying for jobs. Go to the Jobs tab to get started.</p>
        </div>
      )}
    </Card>
  );
}