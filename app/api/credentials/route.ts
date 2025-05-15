// app/api/credentials/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { saveLinkedInCredentials, hasLinkedInCredentials } from "@/lib/db";

// GET /api/credentials - Check if user has LinkedIn credentials
export async function GET() {
  try {
    const user = await requireAuth();
    const hasCredentials = await hasLinkedInCredentials(user.id);
    
    return NextResponse.json({ hasCredentials }, { status: 200 });
  } catch (error) {
    console.error("Error checking credentials:", error);
    return NextResponse.json(
      { error: "Failed to check credentials" },
      { status: 500 }
    );
  }
}

// POST /api/credentials - Save LinkedIn credentials
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { linkedinEmail, linkedinPassword } = await request.json();
    
    // Basic validation
    if (!linkedinEmail || !linkedinPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    const success = await saveLinkedInCredentials(
      user.id,
      linkedinEmail,
      linkedinPassword
    );
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to save credentials" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving credentials:", error);
    return NextResponse.json(
      { error: "Failed to save credentials" },
      { status: 500 }
    );
  }
}

