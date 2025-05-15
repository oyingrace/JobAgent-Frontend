// app/api/resume/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const fileId = params.id;
    
    const db = await getDatabase();
    const bucket = new GridFSBucket(db);
    
    // Find the file and check if it belongs to the user
    const file = await db.collection("fs.files").findOne({
      _id: new ObjectId(fileId),
      "metadata.userId": user.id
    });
    
    if (!file) {
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );
    }
    
    // Create download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.from(chunk));
    }
    
    const buffer = Buffer.concat(chunks);
    
    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set("Content-Type", file.metadata.contentType || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${file.filename}"`);
    
    return new NextResponse(buffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error downloading resume:", error);
    return NextResponse.json(
      { error: "Failed to download resume" },
      { status: 500 }
    );
  }
}
