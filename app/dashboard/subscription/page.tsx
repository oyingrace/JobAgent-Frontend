// app/dashboard/subscription/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PLAN_LIMITS } from '@/lib/db';

interface Subscription {
  plan: 'basic' | 'pro';
  planStartDate: string;
  planExpiryDate?: string | null;
  monthlyApplicationsUsed: number;
}

export default function SubscriptionPage() {
  const { status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [remainingApplications, setRemainingApplications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isDowngrading, setIsDowngrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      // Fetch user subscription
      fetch('/api/subscription')
        .then(res => res.json())
        .then(data => {
          setSubscription(data.subscription);
          setRemainingApplications(data.remainingApplications);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching subscription:', err);
          setError('Failed to fetch subscription');
          setIsLoading(false);
        });
    }
  }, [status, router]);
  
  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upgrade subscription');
      }
      
      const data = await response.json();
      setSubscription(data.subscription);
      setSuccess('Successfully upgraded to Pro plan!');
      
      // Fetch updated remaining applications
      const remainingRes = await fetch('/api/subscription');
      const remainingData = await remainingRes.json();
      setRemainingApplications(remainingData.remainingApplications);
      
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError('Failed to upgrade subscription');
    } finally {
      setIsUpgrading(false);
    }
  };
  
  const handleDowngrade = async () => {
    setIsDowngrading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/subscription', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to downgrade subscription');
      }
      
      const data = await response.json();
      setSubscription(data.subscription);
      setSuccess('Successfully downgraded to Basic plan');
      
      // Fetch updated remaining applications
      const remainingRes = await fetch('/api/subscription');
      const remainingData = await remainingRes.json();
      setRemainingApplications(remainingData.remainingApplications);
      
    } catch (err) {
      console.error('Error downgrading subscription:', err);
      setError('Failed to downgrade subscription');
    } finally {
      setIsDowngrading(false);
    }
  };
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscription Plan</h1>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscription Plan</h1>
      
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {success && <Alert type="success" className="mb-4">{success}</Alert>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className={`border-2 ${subscription?.plan === 'basic' ? 'border-primary-500' : 'border-gray-200'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Basic Plan</h2>
              {subscription?.plan === 'basic' && (
                <Badge variant="success">Current Plan</Badge>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-bold mb-2">Free</p>
              <p className="text-gray-600">Forever free, with limits</p>
            </div>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{PLAN_LIMITS.basic.monthlyApplications} applications per month</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access to basic features</span>
              </li>
            </ul>
            
            {subscription?.plan !== 'basic' && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDowngrade}
                isLoading={isDowngrading}
              >
                Downgrade to Basic
              </Button>
            )}
          </div>
        </Card>
        
        <Card className={`border-2 ${subscription?.plan === 'pro' ? 'border-primary-500' : 'border-gray-200'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pro Plan</h2>
              {subscription?.plan === 'pro' && (
                <Badge variant="success">Current Plan</Badge>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-bold mb-2">$9.99<span className="text-lg font-normal">/month</span></p>
              <p className="text-gray-600">Billed annually ($119.88/year)</p>
            </div>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>{PLAN_LIMITS.pro.monthlyApplications}</strong> applications per month</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority job processing</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced job matching</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Premium support</span>
              </li>
            </ul>
            
            {subscription?.plan !== 'pro' ? (
              <Button 
                className="w-full"
                onClick={handleUpgrade}
                isLoading={isUpgrading}
              >
                Upgrade to Pro
              </Button>
            ) : (
              <div className="text-sm text-gray-600 mt-2">
                Your plan expires on: {formatDate(subscription.planExpiryDate)}
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Summary</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Current Plan</span>
                <span className="font-medium capitalize">{subscription?.plan}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Applications Used This Month</span>
                <span className="font-medium">{subscription?.monthlyApplicationsUsed} / {PLAN_LIMITS[subscription?.plan || 'basic'].monthlyApplications}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${subscription?.plan === 'pro' ? 'bg-primary-600' : 'bg-blue-500'}`}
                  style={{ width: `${(subscription?.monthlyApplicationsUsed || 0) / PLAN_LIMITS[subscription?.plan || 'basic'].monthlyApplications * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Remaining Applications</span>
                <span className="font-medium">{remainingApplications}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Plan Start Date</span>
                <span className="font-medium">{formatDate(subscription?.planStartDate)}</span>
              </div>
            </div>
            
            {subscription?.plan === 'pro' && subscription?.planExpiryDate && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Plan Expiry Date</span>
                  <span className="font-medium">{formatDate(subscription.planExpiryDate)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="mb-2 font-medium">Note:</p>
        <p>The Basic plan allows you to submit up to {PLAN_LIMITS.basic.monthlyApplications} job applications per month.</p>
        <p>The Pro plan allows you to submit up to {PLAN_LIMITS.pro.monthlyApplications} job applications per month.</p>
        <p>Your plan resets on the {formatDate(subscription?.planStartDate)} of each month.</p>
      </div>
    </div>
  );
}