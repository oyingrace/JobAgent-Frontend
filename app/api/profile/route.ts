// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, updateUserProfile } from "@/lib/db";
import { z } from "zod";

// GET /api/profile - Get user profile
export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await getUserProfile(user.id);
    
    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 404 });
    }
    
    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST /api/profile - Update user profile
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const data = await request.json();
    
    // Basic validation - in a real app use Zod for complete validation
    if (!data) {
      return NextResponse.json(
        { error: "No profile data provided" },
        { status: 400 }
      );
    }
    
    const success = await updateUserProfile(user.id, data);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

