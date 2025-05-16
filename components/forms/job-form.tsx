import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert } from '../ui/alert';
import { Card } from '../ui/card';
import { Select } from '../ui/select';

const jobSchema = z.object({
  searchKeywords: z.string().min(1, 'Search keywords are required'),
  searchLocation: z.string().min(1, 'Search location is required'),
  maxApplications: z
    .preprocess((val) => Number(val), z.number().positive('Max applications must be a positive number')),
  datePosted: z.string(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => Promise<void>;
  isReady: boolean;
  readyMessage?: string;
}

export function JobForm({
  initialData = {},
  onSubmit,
  isReady,
  readyMessage = "Your profile is incomplete. Please complete your profile, connect LinkedIn, and upload a resume before starting job applications.",
}: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [remainingApplications, setRemainingApplications] = useState<number>(0);
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);

  // Fetch remaining application limits
  useEffect(() => {
    fetch('/api/subscription')
      .then((res) => res.json())
      .then((data) => {
        setRemainingApplications(data.remainingApplications);
        setIsLoadingLimits(false);
      })
      .catch((err) => {
        console.error('Error fetching subscription limits:', err);
        setIsLoadingLimits(false);
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      searchKeywords: initialData.searchKeywords || '',
      searchLocation: initialData.searchLocation || '',
      maxApplications: initialData.maxApplications || 10,
      datePosted: initialData.datePosted || 'Past Month',
    },
  });

  const maxApplicationsValue = watch('maxApplications');

  // Enforce maxApplications limit
  useEffect(() => {
    if (!isLoadingLimits && maxApplicationsValue > remainingApplications) {
      setValue('maxApplications', remainingApplications);
    }
  }, [maxApplicationsValue, remainingApplications, isLoadingLimits, setValue]);

  const handleFormSubmit: SubmitHandler<JobFormData> = async (data) => {
    if (!isReady) {
      setError(readyMessage);
      return;
    }

    if (data.maxApplications > remainingApplications) {
      setError(`You can only apply to a maximum of ${remainingApplications} jobs based on your current subscription plan.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(data);
      setSuccess('Job application started successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to start job application. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <Card title="Job Search" className="mb-6">
        <div className="space-y-4">
          <Input
            label="Search Keywords"
            placeholder="e.g. Software Engineer"
            {...register('searchKeywords')}
            error={errors.searchKeywords?.message}
          />

          <Input
            label="Search Location"
            placeholder="e.g. San Francisco, CA"
            {...register('searchLocation')}
            error={errors.searchLocation?.message}
          />

          <Select
            label="Date Posted"
            {...register('datePosted')}
            options={[
              { value: 'Past 24 hours', label: 'Past 24 hours' },
              { value: 'Past Week', label: 'Past Week' },
              { value: 'Past Month', label: 'Past Month' },
            ]}
          />

          <Input
            label="Maximum Applications"
            type="number"
            min="1"
            max="50"
            {...register('maxApplications', { valueAsNumber: true })}
            error={errors.maxApplications?.message}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={!isReady}>
          Start Job Search
        </Button>
      </div>
    </form>
  );
}
