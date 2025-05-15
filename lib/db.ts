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
    // Create new profile
    const result = await db.collection(COLLECTIONS.USER_PROFILES).insertOne({
      userId,
      ...profileData,
      createdAt: currentTime,
      updatedAt: currentTime
    });
    return result.insertedId !== null;
  }
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
  
  const jobDocument = {
    userId,
    status: 'pending',
    createdAt: currentTime,
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
  return result.insertedId ? result.insertedId.toString() : null;
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

export async function cancelJob(jobId: string, userId: string) {
  const db = await getDatabase();
  const currentTime = new Date();
  
  const result = await db.collection(COLLECTIONS.BOT_JOBS).updateOne(
    { _id: new ObjectId(jobId), userId, status: 'pending' },
    {
      $set: {
        status: 'cancelled',
        cancelledAt: currentTime
      },
      $push: {
        logs: {
          $each: [{
            time: currentTime,
            message: 'Job cancelled by user',
            level: 'info'
          }]
        }
      } as any
    }
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