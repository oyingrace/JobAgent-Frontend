// components/forms/resume-upload-form.tsx
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import { Card } from '../ui/card';

interface ResumeUploadFormProps {
  onUpload: (file: File) => Promise<void>;
  hasExistingResume?: boolean;
  onDelete?: () => Promise<void>;
  resumeInfo?: {
    filename: string;
    uploadDate: string;
  };
}

export function ResumeUploadForm({ 
  onUpload, 
  hasExistingResume = false, 
  onDelete,
  resumeInfo
}: ResumeUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await onUpload(file);
      setSuccess('Resume uploaded successfully');
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await onDelete();
      setSuccess('Resume deleted successfully');
    } catch (err) {
      setError('Failed to delete resume. Please try again.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      
      <Card className="mb-6">
        <div className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Upload your resume in PDF, DOC, or DOCX format. 
              This will be used when applying for jobs on LinkedIn.
              Maximum file size: 5MB.
            </p>
          </div>
          
          {hasExistingResume && resumeInfo && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Resume</p>
                  <p className="text-sm text-gray-500">{resumeInfo.filename}</p>
                  <p className="text-xs text-gray-400">
                    Uploaded on {new Date(resumeInfo.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {hasExistingResume ? 'Replace Resume' : 'Upload Resume'}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
              disabled={isUploading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

