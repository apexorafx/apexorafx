
'use client';

import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { appUser, loading } = useAuth();
  const router = useRouter();

  const profileIsComplete = !!appUser?.profile_completed_at;

  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to be resolved
    }
    if (!appUser) {
        // Not logged in, redirect to login
        router.push(`/login`);
    } else if (!profileIsComplete) {
        // Logged in, but profile is not complete
        router.push('/signup-details');
    }
  }, [appUser, loading, router, profileIsComplete]);

  // Show loader while waiting for auth or if user needs redirection
  if (loading || !appUser || !profileIsComplete) {
    return (
       <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Render dashboard for authenticated and fully onboarded users
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
