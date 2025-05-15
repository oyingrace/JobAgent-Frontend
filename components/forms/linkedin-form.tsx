// components/forms/linkedin-form.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert } from '../ui/alert';
import { Card } from '../ui/card';

const linkedinSchema = z.object({
  linkedinEmail: z.string().email('Invalid email address'),
  linkedinPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type LinkedInFormData = z.infer<typeof linkedinSchema>;

interface LinkedInFormProps {
  initialEmail?: string;
  onSubmit: (data: LinkedInFormData) => Promise<void>;
}

export function LinkedInForm({ initialEmail = '', onSubmit }: LinkedInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LinkedInFormData>({
    resolver: zodResolver(linkedinSchema),
    defaultValues: {
      linkedinEmail: initialEmail,
      linkedinPassword: '',
    },
  });
  
  const handleFormSubmit: SubmitHandler<LinkedInFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await onSubmit(data);
      setSuccess('LinkedIn credentials saved successfully');
    } catch (err) {
      setError('Failed to save LinkedIn credentials. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      
      <Card className="mb-6">
        <div className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              The LinkedIn bot will use these credentials to log into LinkedIn and apply for jobs on your behalf.
              Your credentials will be stored securely and encrypted in the database.
            </p>
          </div>
          
          <Input
            label="LinkedIn Email"
            type="email"
            {...register('linkedinEmail')}
            error={errors.linkedinEmail?.message}
          />
          
          <Input
            label="LinkedIn Password"
            type="password"
            {...register('linkedinPassword')}
            error={errors.linkedinPassword?.message}
          />
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save Credentials
        </Button>
      </div>
    </form>
  );
}

