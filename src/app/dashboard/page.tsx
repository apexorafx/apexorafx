
'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DollarSign, TrendingUp, AlertTriangle, Users, BarChartBig, UserCircle, Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getDashboardData, getImageByContextTag } from '@/lib/actions';
import type { DashboardData } from '@/lib/types';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, unit = '$', color = 'text-foreground', description, trend, valueClassName }: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  unit?: string;
  color?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  valueClassName?: string;
}) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn('h-5 w-5 text-muted-foreground', color)} />
    </CardHeader>
    <CardContent>
      <div className={cn('text-2xl font-bold', valueClassName)}>
        {unit}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { user, loading: authIsLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [promoImage, setPromoImage] = useState<{ imageUrl: string; altText: string } | null>(null);
  const [isLoadingPromoImage, setIsLoadingPromoImage] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoading(true);
        setFetchError(null);
        try {
          const dashboardData = await getDashboardData(user.uid);
          if (dashboardData) {
            setData(dashboardData);
          } else {
            throw new Error('Could not retrieve dashboard data.');
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          setFetchError((error as Error).message);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoadingPromoImage(true);
      const imageData = await getImageByContextTag('dashboard_article_promo');
      setPromoImage(imageData);
      setIsLoadingPromoImage(false);
    };
    fetchImage();
  }, []);

  if (authIsLoading || (loading && !data)) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-lg font-semibold text-destructive-foreground">Error loading dashboard</p>
        <p className="text-muted-foreground">{fetchError}</p>
      </div>
    );
  }

  if (!data) {
     return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-lg font-semibold text-destructive-foreground">No data available</p>
        <p className="text-muted-foreground">We couldn't find any data for your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {data.username}!</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your trading account.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/deposit">
            <DollarSign className="mr-2 h-5 w-5" /> Deposit Funds
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
         <StatCard 
            title="Total Assets"
            value={data.totalAssets}
            description="Current Portfolio Value"
            icon={BarChartBig}
            color="text-financial-green"
         />
         <StatCard 
            title="Total Deposited"
            value={data.totalDeposited}
            description="All Confirmed Deposits"
            icon={ArrowDownCircle}
            color="text-blue-500"
         />
          <StatCard 
            title="Profit/Loss"
            value={data.profitLoss}
            description="Overall Performance"
            icon={TrendingUp}
            valueClassName={cn(data.profitLoss >= 0 ? 'text-financial-green' : 'text-financial-red')}
         />
          <StatCard 
            title="Total Withdrawn"
            value={data.totalWithdrawn}
            description="All Confirmed Withdrawals"
            icon={ArrowUpCircle}
            valueClassName="text-orange-500"
         />
          <StatCard 
            title="Active Copy Trades"
            value={data.activeCopyTrades.toString()}
            description="Traders You're Copying"
            icon={Users}
            unit=""
            color="text-purple-500"
         />
      </div>

      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-56 sm:h-72 w-full bg-muted/30">
          {isLoadingPromoImage || !promoImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <Image
              src={promoImage.imageUrl}
              alt={promoImage.altText}
              fill
              className="object-cover opacity-80"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">Plan Your Financial Future</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-200 max-w-2xl">
              Utilize our tools and insights to make informed trading decisions and grow your portfolio.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          <CardDescription>Navigate to key sections of your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" size="lg" className="w-full justify-start text-base py-6" asChild>
             <Link href="/dashboard/markets">
              <BarChartBig className="mr-3 h-6 w-6" /> View Markets
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full justify-start text-base py-6" asChild>
            <Link href="/dashboard/copy-trading">
              <Users className="mr-3 h-6 w-6" /> Explore Copy Trading
            </Link>
          </Button>
           <Button variant="outline" size="lg" className="w-full justify-start text-base py-6" asChild>
            <Link href="/dashboard/profile">
              <UserCircle className="mr-3 h-6 w-6" /> Manage Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
