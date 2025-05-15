// components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Alert({ children, type = 'info', className = '' }: AlertProps) {
  const typeClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };
  
  const classes = `p-4 rounded-md border ${typeClasses[type]} ${className}`;
  
  return (
    <div className={classes} role="alert">
      {children}
    </div>
  );
}