// app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getUserSubscription, upgradeToProPlan, downgradeToBasicPlan, getRemainingApplications } from "@/lib/db";

// GET /api/subscription - Get user subscription
export async function GET() {
  try {
    const user = await requireAuth();
    const subscription = await getUserSubscription(user.id);
    const remainingApplications = await getRemainingApplications(user.id);
    
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

// POST /api/subscription - Upgrade to Pro plan
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const data = await request.json();
    
    // This is where you would handle payment processing
    // For now, we're just upgrading the plan
    
    const success = await upgradeToProPlan(user.id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to upgrade subscription" },
        { status: 500 }
      );
    }
    
    const subscription = await getUserSubscription(user.id);
    
    return NextResponse.json({ 
      success: true,
      subscription 
    }, { status: 200 });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}

// DELETE /api/subscription - Downgrade to Basic plan
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
    
    const subscription = await getUserSubscription(user.id);
    
    return NextResponse.json({ 
      success: true,
      subscription 
    }, { status: 200 });
  } catch (error) {
    console.error("Error downgrading subscription:", error);
    return NextResponse.json(
      { error: "Failed to downgrade subscription" },
      { status: 500 }
    );
  }
}