
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Shield, Eye, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { mockTraders } from '@/lib/traders';
import { getCopiedTraderIds, copyTrader, stopCopyingTrader } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export default function CopyTradingPage() {
  const { appUser } = useAuth();
  const { toast } = useToast();
  const [copiedTraderIds, setCopiedTraderIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchCopiedTraders() {
      if (!appUser?.id) return;

      setIsLoading(true);
      try {
        const ids = await getCopiedTraderIds(appUser.id);
        setCopiedTraderIds(new Set(ids));
      } catch (error) {
        console.error('Failed to fetch copied traders:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load your copied traders list.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchCopiedTraders();
  }, [appUser, toast]);

  const handleToggleCopy = async (traderId: string, traderUsername: string) => {
    if (!appUser?.id) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }

    setIsToggling(prev => ({ ...prev, [traderId]: true }));
    const isCurrentlyCopied = copiedTraderIds.has(traderId);

    try {
      if (isCurrentlyCopied) {
        await stopCopyingTrader(appUser.id, traderId);
        setCopiedTraderIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(traderId);
          return newSet;
        });
        toast({ title: 'Success', description: `You have stopped copying ${traderUsername}.` });
      } else {
        await copyTrader(appUser.id, traderId);
        setCopiedTraderIds(prev => new Set(prev).add(traderId));
        toast({ title: 'Success', description: `You are now copying ${traderUsername}.` });
      }
    } catch (error) {
      console.error('Failed to toggle copy state:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsToggling(prev => ({ ...prev, [traderId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading traders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight flex items-center">
        <Users className="mr-3 h-8 w-8" /> Copy Trading
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Discover Top Traders</CardTitle>
          <CardDescription>Find experienced traders and copy their strategies automatically.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockTraders.map(trader => {
            const isCopied = copiedTraderIds.has(trader.id);
            const isProcessing = isToggling[trader.id];

            return (
              <Card 
                key={trader.id} 
                className={`overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 bg-card ${isCopied ? 'border-primary' : ''}`}
              >
                <div className="relative h-40 w-full">
                   <Image 
                    src={trader.image}
                    alt={`${trader.username} - Trading Activity`} 
                    fill
                    className="object-cover"
                    data-ai-hint="abstract shape"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end">
                       <h3 className="text-lg font-semibold text-white">{trader.username}</h3>
                       {isCopied && <Badge variant="default" className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs"><CheckCircle className="mr-1 h-3 w-3"/>Copying</Badge>}
                   </div>
                </div>
                <CardContent className="p-4 space-y-3 flex-grow">
                  <div className="flex items-center justify-between">
                     <Avatar className="h-12 w-12 border-2 border-primary">
                       <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${trader.avatarSeed}`} alt={trader.username} />
                       <AvatarFallback>{trader.avatarSeed}</AvatarFallback>
                     </Avatar>
                     <Badge variant={trader.risk === 'Low' ? 'secondary' : trader.risk === 'Medium' ? 'default' : 'destructive'} className="capitalize text-xs px-2 py-1">
                       <Shield className="mr-1 h-3 w-3" /> {trader.risk} Risk
                     </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Trades in: {trader.market}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold ${trader.profit.startsWith('+') ? 'text-financial-green' : 'text-financial-red'}`}>{trader.profit}</span>
                    <span className="text-muted-foreground">{trader.copiers.toLocaleString()} Copiers</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-start gap-2 p-4 bg-muted/30 border-t mt-auto">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                    <Link href={`/dashboard/copy-trading/${trader.id}`}>
                      <Eye className="mr-1.5 h-4 w-4" /> View Profile
                    </Link>
                  </Button>
                  <Button 
                    variant={isCopied ? "destructive" : "default"} 
                    size="sm" 
                    className="text-xs sm:text-sm"
                    onClick={() => handleToggleCopy(trader.id, trader.username)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : (isCopied ? <CheckCircle className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />)}
                    {isProcessing ? "Processing..." : (isCopied ? "Stop Copying" : "Copy")}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
