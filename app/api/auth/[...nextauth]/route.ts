// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth.config";

// Export the Next.js API route handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };