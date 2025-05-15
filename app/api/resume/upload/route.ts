// app/api/resume/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { GridFSBucket } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    // This is a simpler implementation than production would use
    // In production, use a multipart form parser library
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }
    
    // Check file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." },
        { status: 400 }
      );
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Delete any existing resume
    const db = await getDatabase();
    const bucket = new GridFSBucket(db);
    
    const existingFiles = await bucket
      .find({ "metadata.userId": user.id, "metadata.fileType": "resume" })
      .toArray();
    
    for (const existingFile of existingFiles) {
      await bucket.delete(existingFile._id);
    }
    
    // Upload new resume
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        userId: user.id,
        fileType: "resume",
        contentType: file.type,
        uploadedAt: new Date()
      }
    });
    
    // Write buffer to stream
    const writePromise = new Promise<string>((resolve, reject) => {
      uploadStream.on("finish", () => {
        resolve(uploadStream.id.toString());
      });
      uploadStream.on("error", reject);
      uploadStream.end(buffer);
    });
    
    const fileId = await writePromise;
    
    return NextResponse.json(
      { success: true, fileId, filename: file.name },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}