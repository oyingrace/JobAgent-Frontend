// app/dashboard/layout.tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

