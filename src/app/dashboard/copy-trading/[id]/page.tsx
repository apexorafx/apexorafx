
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserCircle, BarChart2, Shield, CalendarDays, TrendingUp, Users, Copy, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { mockTraders } from '@/lib/traders';
import { useAuth } from '@/context/auth-context';
import { getCopiedTraderIds, copyTrader, stopCopyingTrader } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts"

const chartConfig = {
  performance: {
    label: "Performance",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const generatePerformanceData = (profitStr: string) => {
    const profit = parseFloat(profitStr.replace('%', ''));
    const data = [];
    let value = 10000; // Starting portfolio value
    const days = 90;
    const dailyFluctuation = (Math.abs(profit) / days) / 100;

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        
        const randomFactor = (Math.random() - 0.45); // slight positive bias
        const change = value * dailyFluctuation * (profit > 0 ? 1 : -1) * (1 + randomFactor);
        value += change;
        
        data.push({
            date: date.toISOString().split('T')[0],
            performance: Math.max(0, value), // Ensure value doesn't go below 0
        });
    }
    return data;
};

export default function TraderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { appUser } = useAuth();
  const { toast } = useToast();
  
  const traderId = typeof params.id === 'string' ? params.id : '';
  const trader = mockTraders.find(t => t.id === traderId);

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  const performanceData = useMemo(() => {
    if (trader) {
      return generatePerformanceData(trader.profit);
    }
    return [];
  }, [trader]);

  useEffect(() => {
    async function fetchInitialStatus() {
      if (!appUser?.id || !trader) return;
      setIsLoading(true);
      try {
        const ids = await getCopiedTraderIds(appUser.id);
        setIsCopied(ids.includes(trader.id));
      } catch (error) {
        console.error("Failed to fetch copy status", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load copy status.' });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialStatus();
  }, [appUser, trader, toast]);

  if (!trader) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <UserCircle className="w-24 h-24 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold text-destructive">Trader Not Found</h1>
        <p className="text-muted-foreground mt-2">The trader profile you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-6" onClick={() => router.back()}>
          <Link href="/dashboard/copy-trading">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  const handleToggleCopy = async () => {
    if (!appUser?.id) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }
    
    setIsToggling(true);
    try {
      if (isCopied) {
        await stopCopyingTrader(appUser.id, trader.id);
        setIsCopied(false);
        toast({ title: 'Success', description: `You have stopped copying ${trader.username}.` });
      } else {
        await copyTrader(appUser.id, trader.id);
        setIsCopied(true);
        toast({ title: 'Success', description: `You are now copying ${trader.username}.` });
      }
    } catch (error) {
      console.error('Failed to toggle copy state:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    } finally {
      setIsToggling(false);
    }
  };

  const buttonIsDisabled = isLoading || isToggling;
  const buttonText = isCopied ? `Stop Copying ${trader.username}` : `Copy ${trader.username}`;

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/copy-trading">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Traders
        </Link>
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 md:h-64 w-full">
          <Image 
            src={trader.image}
            alt={`${trader.username}'s Profile Banner`} 
            fill 
            className="object-cover"
            data-ai-hint="abstract shape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 flex items-end">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${trader.avatarSeed}`} alt={trader.username} />
                <AvatarFallback className="text-2xl">{trader.avatarSeed}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">{trader.username}</h1>
                <p className="text-sm text-gray-200">Trading in: {trader.market}</p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><BarChart2 className="mr-2 h-5 w-5"/> Trading Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{trader.strategy}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><TrendingUp className="mr-2 h-5 w-5"/> Performance (90-day)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full">
                  <LineChart accessibilityLayer data={performanceData} margin={{ left: 12, right: 12, top: 5, bottom: 5, }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={6} domain={['auto', 'auto']} tickFormatter={(value) => `$${Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`} />
                    <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelFormatter={(label, payload) => {
                      return new Date(payload[0]?.payload.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    }} formatter={(value) => `$${Number(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} hideLabel />} />
                    <Line dataKey="performance" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Portfolio Value" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">Key Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><Shield className="mr-2 h-4 w-4"/>Risk Level:</span>
                  <Badge variant={trader.risk === 'Low' ? 'secondary' : trader.risk === 'Medium' ? 'default' : 'destructive'} className="capitalize">
                    {trader.risk}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><TrendingUp className="mr-2 h-4 w-4"/>Profit (All Time):</span>
                  <span className={`font-semibold ${trader.profit.startsWith('+') ? 'text-financial-green' : 'text-financial-red'}`}>{trader.profit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><Users className="mr-2 h-4 w-4"/>Copiers:</span>
                  <span className="font-semibold">{trader.copiers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Joined:</span>
                  <span className="font-semibold">{new Date(trader.joined).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
            <Button 
                variant={isCopied ? "destructive" : "default"} 
                size="lg" 
                className="w-full"
                onClick={handleToggleCopy}
                disabled={buttonIsDisabled}
            >
              {buttonIsDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : (isCopied ? <CheckCircle className="mr-2 h-5 w-5"/> : <Copy className="mr-2 h-5 w-5"/>)}
              {buttonIsDisabled ? "Processing..." : buttonText}
            </Button>
            <Button variant="outline" className="w-full" disabled>Message {trader.username}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
