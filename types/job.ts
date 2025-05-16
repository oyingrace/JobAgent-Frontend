export interface Job {
  _id: string;
  userId: string;
  status: 'pending' | 'processing' | 'running' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt: Date;
  searchKeywords: string;
  searchLocation: string;
  maxApplications: number;
  jobsProcessed: number;
  jobsApplied: number;
  jobsSkipped: number;
  jobsBlacklisted: number;
  jobsAlreadyApplied: number;
  jobsExtraInfoNeeded: number;
  logs: Array<{
    time: Date;
    message: string;
    level: string;
  }>;
  applications: any[];
} 