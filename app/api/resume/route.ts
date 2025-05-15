// app/api/resume/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { GridFSBucket, ObjectId } from "mongodb";

// GET /api/resume - Check if user has resume
export async function GET() {
  try {
    const user = await requireAuth();
    const db = await getDatabase();
    const bucket = new GridFSBucket(db);
    
    const files = await bucket
      .find({ "metadata.userId": user.id, "metadata.fileType": "resume" })
      .toArray();
    
    const hasResume = files.length > 0;
    const resumeInfo = hasResume ? {
      filename: files[0].filename,
      uploadDate: files[0].uploadDate,
      id: files[0]._id.toString()
    } : null;
    
    return NextResponse.json({ hasResume, resumeInfo }, { status: 200 });
  } catch (error) {
    console.error("Error checking resume:", error);
    return NextResponse.json(
      { error: "Failed to check resume status" },
      { status: 500 }
    );
  }
}

// DELETE /api/resume - Delete user's resume
export async function DELETE() {
  try {
    const user = await requireAuth();
    const db = await getDatabase();
    const bucket = new GridFSBucket(db);
    
    const files = await bucket
      .find({ "metadata.userId": user.id, "metadata.fileType": "resume" })
      .toArray();
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No resume found" },
        { status: 404 }
      );
    }
    
    // Delete all user's resumes (should only be one)
    for (const file of files) {
      await bucket.delete(file._id);
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}

