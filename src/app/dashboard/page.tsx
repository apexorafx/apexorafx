'use client';

import { AuthGuard, useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

function DashboardContent() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold font-headline">
                    Welcome, {user?.displayName || user?.email}
                </h1>
                <Button onClick={handleLogout} variant="outline">Log Out</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Dashboard</CardTitle>
                    <CardDescription>This is your personal trading dashboard. More features coming soon!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Your user ID is: <span className="font-mono text-sm bg-muted p-1 rounded-md">{user?.uid}</span></p>
                </CardContent>
            </Card>
        </div>
    );
}


export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
