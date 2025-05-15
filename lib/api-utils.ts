// lib/api-utils.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './auth';

/**
 * Wrapper for API routes that require authentication
 * 
 * @param handler - The route handler function
 * @returns A function that checks authentication before calling the handler
 */
export function withAuth<T>(
  handler: (req: NextRequest, context: T, user: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: T) => {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call the original handler with the authenticated user
    return handler(req, context, session.user);
  };
}

/**
 * Wrapper for API route handlers that adds error handling
 * 
 * @param handler - The route handler function
 * @returns A function that catches and processes errors
 */
export function withErrorHandling<T>(
  handler: (req: NextRequest, context: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: T) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error('API error:', error);
      
      // Handle specific error types
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // General server error
      return NextResponse.json(
        { error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Combined wrapper for authenticated API routes with error handling
 */
export function withAuthAndErrorHandling<T>(
  handler: (req: NextRequest, context: T, user: any) => Promise<NextResponse>
) {
  return withErrorHandling((req: NextRequest, context: T) => 
    withAuth(handler)(req, context)
  );
}