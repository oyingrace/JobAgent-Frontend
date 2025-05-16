// components/dashboard/subscription-card.tsx
import React from 'react';
import { Card } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FormattedSubscription } from '@/types/subscription';

interface SubscriptionCardProps {
  subscription: FormattedSubscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  // Format plan name for display
  const formatPlanName = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  // Format date to display only the date part
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  // Get progress bar color based on usage
  const getProgressColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get days remaining in subscription
  const getDaysRemaining = () => {
    if (subscription.endDate) {
      const end = new Date(subscription.endDate);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 'Unlimited';
  };

  return (
    <Card title="Your Subscription" className="mb-6">
      <div className="space-y-4">
        <div className="bg-primary-50 p-3 rounded-md flex justify-between items-center">
          <div>
            <span className="text-xs text-primary-600 font-medium">CURRENT PLAN</span>
            <h3 className="text-lg font-bold text-primary-700">{formatPlanName(subscription.plan)}</h3>
          </div>
          <Link href="/dashboard/subscription">
            <Button size="sm" variant="outline">
              {subscription.plan === 'free' ? 'Upgrade' : 'Manage'}
            </Button>
          </Link>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Monthly Applications</span>
            <span className="text-sm text-gray-600">
              {subscription.monthlyApplicationsUsed} / {subscription.limits.monthlyApplications}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getProgressColor(
                subscription.monthlyApplicationsUsed, 
                subscription.limits.monthlyApplications
              )}`} 
              style={{ 
                width: `${Math.min(
                  (subscription.monthlyApplicationsUsed / subscription.limits.monthlyApplications) * 100, 
                  100
                )}%` 
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {subscription.remainingApplications} applications remaining this month
          </p>
        </div>

        {subscription.plan !== 'free' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</p>
            </div>
            <div>
              <p className="text-gray-500">Renewal</p>
              <p className="font-medium">
                {subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {subscription.trialEndsAt && (
          <div className="bg-blue-50 p-3 rounded-md text-blue-800 text-sm">
            <p className="font-medium">Trial ends on {formatDate(subscription.trialEndsAt)}</p>
            <p>Upgrade to continue using premium features</p>
          </div>
        )}
      </div>
    </Card>
  );
}