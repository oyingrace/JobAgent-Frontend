// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createJob, getUserJobs, hasResume, hasLinkedInCredentials, getUserProfile, hasAvailableApplications } from "@/lib/db";

// GET /api/jobs - Get user's job history
export async function GET() {
  try {
    const user = await requireAuth();
    const jobs = await getUserJobs(user.id);
    
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchKeywords, searchLocation, maxApplications } = await request.json();
    
    // Basic validation
    if (!searchKeywords || !searchLocation) {
      return NextResponse.json(
        { error: "Search keywords and location are required" },
        { status: 400 }
      );
    }
    
    // Check if user has completed necessary setup
    const hasCredentials = await hasLinkedInCredentials(user.id);
    if (!hasCredentials) {
      return NextResponse.json(
        { error: "LinkedIn credentials are required before starting a job" },
        { status: 400 }
      );
    }
    
    const userHasResume = await hasResume(user.id);
    if (!userHasResume) {
      return NextResponse.json(
        { error: "Resume upload is required before starting a job" },
        { status: 400 }
      );
    }
    
    const profile = await getUserProfile(user.id);
    if (!profile) {
      return NextResponse.json(
        { error: "Profile setup is required before starting a job" },
        { status: 400 }
      );
    }
    
    // Check if user has available applications
    const hasAvailable = await hasAvailableApplications(user.id);
    if (!hasAvailable) {
      return NextResponse.json(
        { error: "Monthly application limit reached" },
        { status: 400 }
      );
    }
    
    // Create the job
    const result = await createJob(
      user.id,
      searchKeywords,
      searchLocation,
      maxApplications || 10
    );
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ jobId: result.jobId, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

