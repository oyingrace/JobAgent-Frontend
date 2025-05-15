// components/forms/profile-form.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Alert } from '../ui/alert';
import { Card } from '../ui/card';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP/Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  
  // Professional Info
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  experienceYears: z.string().min(1, 'Years of experience is required'),
  currentCompany: z.string().optional(),
  currentPosition: z.string().optional(),
  educationLevel: z.string().min(1, 'Education level is required'),
  
  // Additional Info
  aboutMe: z.string().min(1, 'About me is required'),
  
  // Job Search
  searchKeywords: z.string().min(1, 'Search keywords are required'),
  searchLocation: z.string().min(1, 'Search location is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

export function ProfileForm({ initialData = {}, onSubmit }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });
  
  const handleFormSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await onSubmit(data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      
      <Card title="Personal Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
          <Input
            label="Middle Name (Optional)"
            {...register('middleName')}
          />
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
          />
          <Input
            label="City"
            {...register('city')}
            error={errors.city?.message}
          />
          <Input
            label="State"
            {...register('state')}
            error={errors.state?.message}
          />
          <Input
            label="ZIP/Postal Code"
            {...register('zipCode')}
            error={errors.zipCode?.message}
          />
          <Input
            label="Country"
            {...register('country')}
            error={errors.country?.message}
          />
        </div>
      </Card>
      
      <Card title="Professional Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="LinkedIn URL"
            type="url"
            {...register('linkedinUrl')}
            error={errors.linkedinUrl?.message}
          />
          <Input
            label="Portfolio URL (Optional)"
            type="url"
            {...register('portfolioUrl')}
            error={errors.portfolioUrl?.message}
          />
          <Input
            label="GitHub URL (Optional)"
            type="url"
            {...register('githubUrl')}
            error={errors.githubUrl?.message}
          />
          <Input
            label="Years of Experience"
            {...register('experienceYears')}
            error={errors.experienceYears?.message}
          />
          <Input
            label="Current Company (Optional)"
            {...register('currentCompany')}
          />
          <Input
            label="Current Position (Optional)"
            {...register('currentPosition')}
          />
          <Input
            label="Education Level"
            {...register('educationLevel')}
            error={errors.educationLevel?.message}
          />
        </div>
      </Card>
      
      <Card title="About You" className="mb-6">
        <Textarea
          label="About Me"
          rows={4}
          {...register('aboutMe')}
          error={errors.aboutMe?.message}
        />
      </Card>
      
      <Card title="Job Search Settings" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save Profile
        </Button>
      </div>
    </form>
  );
}

