// lib/db.ts
import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

// Database and collection names
const DB_NAME = 'jobPilotDB';
const COLLECTIONS = {
  USERS: 'users',
  USER_PROFILES: 'userProfiles',
  CREDENTIALS: 'credentials',
  BOT_JOBS: 'botJobs',
  SCHEDULED_JOBS: 'scheduledJobs',
  SUBSCRIPTIONS: 'subscriptions',
};

// Subscription plan types
export type SubscriptionPlan = 'basic' | 'pro';

// Define subscription interface for proper typing
export interface UserSubscription {
  plan: SubscriptionPlan;
  planStartDate: Date;
  planExpiryDate?: Date | null;
  monthlyApplicationsUsed: number;
}

// Define plan limits
export const PLAN_LIMITS: Record<SubscriptionPlan, { monthlyApplications: number }> = {
  basic: {
    monthlyApplications: 10,
  },
  pro: {
    monthlyApplications: 500,
  }
};

// Helper to get database instance
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// User Profile Methods
export async function getUserProfile(userId: string) {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.USER_PROFILES).findOne({ userId });
}

export async function updateUserProfile(userId: string, profileData: any) {
  const db = await getDatabase();
  const currentTime = new Date();
  
  // Check if profile exists
  const existingProfile = await db.collection(COLLECTIONS.USER_PROFILES).findOne({ userId });
  
  if (existingProfile) {
    // Update existing profile
    const result = await db.collection(COLLECTIONS.USER_PROFILES).updateOne(
      { userId },
      { 
        $set: { 
          ...profileData,
          updatedAt: currentTime
        } 
      }
    );
    return result.modifiedCount > 0;
  } else {
    // Create new profile with default basic plan
    const result = await db.collection(COLLECTIONS.USER_PROFILES).insertOne({
      userId,
      ...profileData,
      subscription: {
        plan: 'basic',
        planStartDate: currentTime,
        monthlyApplicationsUsed: 0,
      },
      createdAt: currentTime,
      updatedAt: currentTime
    });
    return result.insertedId !== null;
  }
}

// Subscription Methods
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const db = await getDatabase();
  const profile = await db.collection(COLLECTIONS.USER_PROFILES).findOne(
    { userId },
    { projection: { subscription: 1 } }
  );
  
  if (!profile || !profile.subscription) {
    // Return default basic plan if no subscription exists
    return {
      plan: 'basic',
      planStartDate: new Date(),
      monthlyApplicationsUsed: 0,
      planExpiryDate: null
    };
  }
  
  // Check if we need to reset the monthly counter
  if (profile.subscription.planStartDate) {
    const planStartDate = new Date(profile.subscription.planStartDate);
    const currentDate = new Date();
    const monthsSinceStart = (currentDate.getFullYear() - planStartDate.getFullYear()) * 12 + 
                            (currentDate.getMonth() - planStartDate.getMonth());
    
    if (monthsSinceStart >= 1) {
      // Reset counter and update planStartDate to today
      await db.collection(COLLECTIONS.USER_PROFILES).updateOne(
        { userId },
        {
          $set: {
            "subscription.monthlyApplicationsUsed": 0,
            "subscription.planStartDate": currentDate
          }
        }
      );
      profile.subscription.monthlyApplicationsUsed = 0;
      profile.subscription.planStartDate = currentDate;
    }
  }
  
  return {
    plan: profile.subscription.plan || 'basic',
    monthlyApplicationsUsed: profile.subscription.monthlyApplicationsUsed || 0,
    planStartDate: profile.subscription.planStartDate || new Date(),
    planExpiryDate: profile.subscription.planExpiryDate || null
  };
}

export async function upgradeToProPlan(userId: string, expiryDate?: Date): Promise<boolean> {
  const db = await getDatabase();
  const currentTime = new Date();
  
  // Default expiry date to 1 year from now if not provided
  const planExpiryDate = expiryDate || new Date(currentTime.setFullYear(currentTime.getFullYear() + 1));
  
  const result = await db.collection(COLLECTIONS.USER_PROFILES).updateOne(
    { userId },
    {
      $set: {
        "subscription.plan": 'pro',
        "subscription.planStartDate": new Date(),
        "subscription.planExpiryDate": planExpiryDate,
        "subscription.monthlyApplicationsUsed": 0, // Reset counter when upgrading
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
  
  return result.modifiedCount > 0 || result.upsertedCount > 0;
}

export async function downgradeToBasicPlan(userId: string): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection(COLLECTIONS.USER_PROFILES).updateOne(
    { userId },
    {
      $set: {
        "subscription.plan": 'basic',
        "subscription.planStartDate": new Date(),
        "subscription.monthlyApplicationsUsed": 0,
        updatedAt: new Date()
      },
      $unset: {
        "subscription.planExpiryDate": ""
      }
    }
  );
  
  return result.modifiedCount > 0;
}

export async function incrementApplicationsUsed(userId: string, count: number = 1): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection(COLLECTIONS.USER_PROFILES).updateOne(
    { userId },
    { $inc: { "subscription.monthlyApplicationsUsed": count } }
  );
  
  return result.modifiedCount > 0;
}

export async function hasAvailableApplications(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  // Check if pro plan has expired
  if (subscription.plan === 'pro' && subscription.planExpiryDate) {
    const expiryDate = new Date(subscription.planExpiryDate);
    if (expiryDate < new Date()) {
      // Downgrade to basic if pro has expired
      await downgradeToBasicPlan(userId);
      subscription.plan = 'basic';
    }
  }
  
  const limit = PLAN_LIMITS[subscription.plan].monthlyApplications;
  return subscription.monthlyApplicationsUsed < limit;
}

export async function getRemainingApplications(userId: string): Promise<number> {
  const subscription = await getUserSubscription(userId);
  
  // Check if pro plan has expired
  if (subscription.plan === 'pro' && subscription.planExpiryDate) {
    const expiryDate = new Date(subscription.planExpiryDate);
    if (expiryDate < new Date()) {
      // Downgrade to basic if pro has expired
      await downgradeToBasicPlan(userId);
      subscription.plan = 'basic';
    }
  }
  
  const limit = PLAN_LIMITS[subscription.plan].monthlyApplications;
  return Math.max(0, limit - subscription.monthlyApplicationsUsed);
}

// LinkedIn Credentials Methods
export async function saveLinkedInCredentials(userId: string, linkedinEmail: string, linkedinPassword: string) {
  const db = await getDatabase();
  const currentTime = new Date();
  
  // Check if credentials exist
  const existingCredentials = await db.collection(COLLECTIONS.CREDENTIALS).findOne({ userId });
  
  // In a real app, encrypt the password here
  // const encryptedPassword = encryptPassword(linkedinPassword);
  
  if (existingCredentials) {
    // Update existing credentials
    const result = await db.collection(COLLECTIONS.CREDENTIALS).updateOne(
      { userId },
      { 
        $set: { 
          linkedinEmail,
          linkedinPassword, // This should be encrypted in production
          updatedAt: currentTime
        } 
      }
    );
    return result.modifiedCount > 0;
  } else {
    // Create new credentials
    const result = await db.collection(COLLECTIONS.CREDENTIALS).insertOne({
      userId,
      linkedinEmail,
      linkedinPassword, // This should be encrypted in production
      verified: false,
      createdAt: currentTime,
      updatedAt: currentTime
    });
    return result.insertedId !== null;
  }
}

export async function hasLinkedInCredentials(userId: string) {
  const db = await getDatabase();
  const credentials = await db.collection(COLLECTIONS.CREDENTIALS).findOne({ userId });
  return credentials !== null;
}

// Job Methods
export async function createJob(
  userId: string,
  searchKeywords: string,
  searchLocation: string,
  maxApplications: number
) {
  const db = await getDatabase();
  const currentTime = new Date();
  
  // Check if user has available applications
  const hasAvailable = await hasAvailableApplications(userId);
  if (!hasAvailable) {
    return { error: "Monthly application limit reached" };
  }
  
  // Get user subscription to validate max applications
  const subscription = await getUserSubscription(userId);
  const planLimit = PLAN_LIMITS[subscription.plan].monthlyApplications;
  const remainingApplications = planLimit - subscription.monthlyApplicationsUsed;
  
  // Adjust maxApplications if it exceeds the remaining limit
  if (maxApplications > remainingApplications) {
    maxApplications = remainingApplications;
  }
  
  const jobDocument = {
    userId,
    status: 'pending',
    createdAt: currentTime,
    updatedAt: currentTime,
    searchKeywords,
    searchLocation,
    maxApplications,
    jobsProcessed: 0,
    jobsApplied: 0,
    jobsSkipped: 0,
    jobsBlacklisted: 0,
    jobsAlreadyApplied: 0,
    jobsExtraInfoNeeded: 0,
    logs: [
      {
        time: currentTime,
        message: 'Job created and added to queue',
        level: 'info'
      }
    ],
    applications: []
  };
  
  const result = await db.collection(COLLECTIONS.BOT_JOBS).insertOne(jobDocument);
  
  if (result.insertedId) {
    // Increment the applications used counter
    await incrementApplicationsUsed(userId, maxApplications);
    
    return { jobId: result.insertedId.toString() };
  }
  
  return { error: "Failed to create job" };
}

export async function getUserJobs(userId: string, limit = 20) {
  const db = await getDatabase();
  const jobs = await db.collection(COLLECTIONS.BOT_JOBS)
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  
  return jobs;
}

export async function getJobDetails(jobId: string) {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.BOT_JOBS).findOne({ _id: new ObjectId(jobId) });
}

// Fixed version
export async function cancelJob(jobId: string, userId: string) {
  const db = await getDatabase();
  const currentTime = new Date();
  
  const updateOperation = {
    $set: {
      status: 'cancelled',
      cancelledAt: currentTime,
      updatedAt: currentTime
    },
    $push: {
      logs: {
        time: currentTime,
        message: 'Job cancelled by user',
        level: 'info'
      }
    }
  } as any; // Use type assertion
  
  const result = await db.collection(COLLECTIONS.BOT_JOBS).updateOne(
    { _id: new ObjectId(jobId), userId, status: 'pending' },
    updateOperation
  );
  
  return result.modifiedCount > 0;
}

// Resume Methods
export async function hasResume(userId: string) {
  const db = await getDatabase();
  const bucket = new (await import('mongodb')).GridFSBucket(db);
  
  const files = await bucket.find({ 'metadata.userId': userId, 'metadata.fileType': 'resume' }).toArray();
  return files.length > 0;
}