// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getUserSubscription, upgradeToProPlan, downgradeToBasicPlan } from "@/lib/db";

// GET /api/subscription - Get user's subscription info
export async function GET() {
  try {
    const user = await requireAuth();
    const subscription = await getUserSubscription(user.id);
    
    // Calculate remaining applications
    const limit = subscription.plan === 'pro' 
      ? 500 // Pro plan limit
      : 10;  // Basic plan limit
    
    const remainingApplications = Math.max(0, limit - subscription.monthlyApplicationsUsed);
    
    return NextResponse.json({ 
      subscription,
      remainingApplications
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// POST /api/subscription - Update subscription after payment
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const data = await request.json();
    
    // Validate required fields
    if (!data.transactionComplete) {
      return NextResponse.json(
        { error: "Missing transaction completion status" },
        { status: 400 }
      );
    }
    
    // Set expiry date to 1 month from now
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    // Update user to pro plan
    const success = await upgradeToProPlan(user.id, expiryDate);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to upgrade subscription" },
        { status: 500 }
      );
    }
    
    // Get updated subscription for response
    const subscription = await getUserSubscription(user.id);
    
    return NextResponse.json({ 
      subscription,
      success: true 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error upgrading subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}

// DELETE /api/subscription - Downgrade subscription
export async function DELETE() {
  try {
    const user = await requireAuth();
    const success = await downgradeToBasicPlan(user.id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to downgrade subscription" },
        { status: 500 }
      );
    }
    
    // Get updated subscription for response
    const subscription = await getUserSubscription(user.id);
    
    return NextResponse.json({ 
      subscription,
      success: true 
    }, { status: 200 });
  } catch (error) {
    console.error("Error downgrading subscription:", error);
    return NextResponse.json(
      { error: "Failed to downgrade subscription" },
      { status: 500 }
    );
  }
}