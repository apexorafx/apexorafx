'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/actions';
import type { DashboardData } from '@/lib/types';
import { Loader2, TrendingUp, Users, PiggyBank, CircleDollarSign, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function DashboardStatCard({ title, value, icon, description, isCurrency = true, valueClassName }: { title: string, value: string | number, icon: React.ReactNode, description: string, isCurrency?: boolean, valueClassName?: string }) {
    const formattedValue = typeof value === 'number' ? 
        isCurrency ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value.toString()
        : value;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", valueClassName)}>{formattedValue}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoading(true);
        const dashboardData = await getDashboardData(user.uid);
        setData(dashboardData);
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Could not load dashboard data.</h1>
        <p className="text-muted-foreground">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
         <DashboardStatCard 
            title="Total Assets"
            value={data.totalAssets}
            description="Current Portfolio Value"
            icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
         />
         <DashboardStatCard 
            title="Total Deposited"
            value={data.totalDeposited}
            description="All Confirmed Deposits"
            icon={<Landmark className="h-4 w-4 text-muted-foreground" />}
         />
          <DashboardStatCard 
            title="Profit/Loss"
            value={data.profitLoss}
            description="Overall Performance"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            valueClassName={cn(data.profitLoss >= 0 ? 'text-financial-green' : 'text-financial-red')}
         />
          <DashboardStatCard 
            title="Total Withdrawn"
            value={data.totalWithdrawn}
            description="All Confirmed Withdrawals"
            icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
            valueClassName="text-financial-red"
         />
          <DashboardStatCard 
            title="Active Copy Trades"
            value={data.activeCopyTrades}
            description="Traders You're Copying"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            isCurrency={false}
         />
      </div>
      <Card className="overflow-hidden">
        <Image 
            src="https://yosjqhioxjfywkdaaflv.supabase.co/storage/v1/object/public/fpx-market-images/traxer-kM6QNrgo0YE-unsplash.jpg"
            alt="Promotional article"
            data-ai-hint="man laptop"
            width={1200}
            height={300}
            className="w-full h-auto object-cover"
        />
      </Card>
    </div>
  );
}
