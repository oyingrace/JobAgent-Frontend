// app/dashboard/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ProfileForm } from '@/components/forms/profile-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      // Fetch user profile
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data.profile || {});
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
          setIsLoading(false);
        });
    }
  }, [status, router]);
  
  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    // Update local state
    setProfile(data);
  };
  
  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <ProfileForm 
        initialData={profile}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
