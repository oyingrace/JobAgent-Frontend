// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get the current session serverside
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 * Returns null if user is not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return null;
  }
  
  return session.user;
}

/**
 * For use in Server Components to require authentication
 * If the user is not authenticated, they will be redirected to the login page
 * Otherwise, returns the current user
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  return user;
}

/**
 * Client-side hook for getting current auth status
 * Usage in client components:
 * const { user, isLoading } = useAuth();
 */
export function useServerAuth() {
  const getAuthStatus = async () => {
    const user = await getCurrentUser();
    return {
      user,
      isAuthenticated: !!user,
    };
  };
  
  return getAuthStatus();
}

/**
 * For use in API routes to require authentication
 * Throws an error if the user is not authenticated
 */
export async function requireApiAuth() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

/**
 * Validate API requests with authorization
 * @param request - The incoming request
 * @returns User info from session if authorized, throws error if not
 */
export async function validateApiRequest(request: Request) {
  try {
    const user = await requireApiAuth();
    return user;
  } catch (error) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}