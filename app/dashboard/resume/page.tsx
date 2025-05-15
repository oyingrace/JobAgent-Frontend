// app/dashboard/resume/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ResumeUploadForm } from '@/components/forms/resume-upload-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ResumePage() {
  const { status } = useSession();
  const router = useRouter();
  const [hasResume, setHasResume] = useState(false);
  const [resumeInfo, setResumeInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      // Check if user has a resume
      fetch('/api/resume')
        .then(res => res.json())
        .then(data => {
          setHasResume(data.hasResume);
          setResumeInfo(data.resumeInfo);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error checking resume:', err);
          setIsLoading(false);
        });
    }
  }, [status, router]);
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/resume/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload resume');
    }
    
    const data = await response.json();
    
    // Update local state
    setHasResume(true);
    setResumeInfo({
      filename: data.filename,
      uploadDate: new Date().toISOString(),
      id: data.fileId,
    });
  };
  
  const handleDelete = async () => {
    const response = await fetch('/api/resume', {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete resume');
    }
    
    // Update local state
    setHasResume(false);
    setResumeInfo(null);
  };
  
  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Resume</h1>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Resume</h1>
      <ResumeUploadForm 
        onUpload={handleUpload}
        hasExistingResume={hasResume}
        onDelete={handleDelete}
        resumeInfo={resumeInfo}
      />
    </div>
  );
}