// components/dashboard/stat-card.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, description, icon, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3 text-primary-600">
              {icon}
            </div>
          )}
          <div className={icon ? 'ml-5' : ''}>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {value}
            </dd>
          </div>
        </div>
        {description && (
          <p className="mt-3 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}


