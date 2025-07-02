'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Bitcoin, HelpCircle, QrCode, Copy, Loader2, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { tradingPlans } from '@/lib/plans';
import { checkIfFirstDeposit, createDepositTransaction } from '@/lib/actions';
import { DepositFormSchema, type DepositFormValues } from '@/lib/types';

const cryptocurrencies = [
  { value: 'BTC', label: 'Bitcoin', icon: <Bitcoin className="h-5 w-5" />, address: '1BU9ypkPQFNq2KYGhBQWArWASGrpR6SWSm', qr: 'https://placehold.co/150x150.png', dataAiHint: "QR code Bitcoin" },
  { value: 'ETH', label: 'Ethereum', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 417" preserveAspectRatio="xMidYMid"><path fill="#343434" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.638V157.885z"/><path fill="#3C3C3B" d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.6l127.963-177.959z"/><path fill="#8C8C8C" d="m127.962 416.905v-104.72L0 239.625z"/><path fill="#141414" d="m127.961 287.958l127.96-75.637l-127.96-58.162z"/><path fill="#393939" d="m.001 212.321l127.96 75.637V154.159z"/></svg>, address: '0x5B8c8A178e72906f2E8F27d653B89045B1A6Ff00', qr: 'https://placehold.co/150x150.png', dataAiHint: "QR code Ethereum" },
  { value: 'USDT', label: 'USDT (TRC20)', icon: <DollarSign className="h-5 w-5" />, address: 'TR3VUseo8xtTNVkb79j785WgFWhR9pNR9j', qr: 'https://placehold.co/150x150.png', dataAiHint: "QR code USDT" },
];

const parseMinimumDeposit = (price: string): number => {
  const numericString = price.replace(/[^0-9]/g, '');
  return numericString ? parseInt(numericString, 10) : 0;
};

export default function DepositPage() {
  const { toast } = useToast();
  const { appUser, loading: authLoading } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencies[0]);
  const [isFirstDeposit, setIsFirstDeposit] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const currentUserPlan = useMemo(() => {
    if (!appUser) return undefined;
    return tradingPlans.find(plan => plan.id === appUser.trading_plan_id);
  }, [appUser]);
  
  const minimumDepositAmount = useMemo(() => {
    return currentUserPlan ? parseMinimumDeposit(currentUserPlan.price) : 500;
  }, [currentUserPlan]);

  useEffect(() => {
    async function checkDepositStatus() {
      if (appUser?.id) {
        setDataLoading(true);
        const firstDeposit = await checkIfFirstDeposit(appUser.id);
        setIsFirstDeposit(firstDeposit);
        setDataLoading(false);
      }
    }
    if (!authLoading) {
      checkDepositStatus();
    }
  }, [appUser, authLoading]);

  const dynamicDepositSchema = DepositFormSchema.refine(
    (data) => !isFirstDeposit || data.amountUSD >= minimumDepositAmount,
    {
      message: `Minimum first deposit for your ${currentUserPlan?.name || 'current'} plan is $${minimumDepositAmount.toLocaleString()}.`,
      path: ["amountUSD"],
    }
  );

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(dynamicDepositSchema),
    defaultValues: {
      crypto: cryptocurrencies[0].value,
      amountUSD: 0,
    },
  });

  const { watch, handleSubmit, formState: { isSubmitting } } = form;
  const watchedAmountUSD = watch('amountUSD');
  const watchedCrypto = watch('crypto');

  useEffect(() => {
    const found = cryptocurrencies.find(c => c.value === watchedCrypto);
    if (found) setSelectedCrypto(found);
  }, [watchedCrypto]);


  const onSubmit = async (data: DepositFormValues) => {
    if (!appUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to make a deposit.' });
      return;
    }
    const result = await createDepositTransaction({
      userId: appUser.id,
      amountUSD: data.amountUSD,
      crypto: data.crypto,
    });

    if (result.success) {
      toast({
        title: "Deposit Initiated",
        description: `Your ${data.crypto} deposit of $${data.amountUSD.toFixed(2)} is now pending confirmation.`,
      });
      form.reset({ crypto: data.crypto, amountUSD: 0 });
      const firstDeposit = await checkIfFirstDeposit(appUser.id);
      setIsFirstDeposit(firstDeposit);
    } else {
      toast({ variant: 'destructive', title: 'Deposit Failed', description: result.message });
    }
  };
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedCrypto.address);
    toast({ title: "Address Copied!", description: `${selectedCrypto.address} copied to clipboard.` });
  };
  
  const cryptoAmount = useMemo(() => {
    if (!watchedAmountUSD || watchedAmountUSD <= 0) return '0.000000';
    const rate = selectedCrypto.value === 'BTC' ? 68000 : selectedCrypto.value === 'ETH' ? 3800 : 1;
    return (watchedAmountUSD / rate).toFixed(6);
  }, [watchedAmountUSD, selectedCrypto]);

  const isLoading = authLoading || dataLoading;

  if (isLoading) {
    return (
        <div className="flex h-full items-center justify-center p-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading deposit information...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
            <DollarSign className="mr-3 h-8 w-8" /> Deposit Funds
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 shadow-lg">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle className="text-xl">Create New Deposit</CardTitle>
                            <CardDescription>Select a cryptocurrency and amount to deposit.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isFirstDeposit && currentUserPlan && (
                                <Alert variant="default" className="bg-primary/10 border-primary/20 text-foreground">
                                    <HelpCircle className="h-5 w-5 text-primary" />
                                    <AlertTitle className="text-primary font-semibold">{currentUserPlan.name} Plan - First Deposit</AlertTitle>
                                    <AlertDescription>
                                        A minimum deposit of ${minimumDepositAmount.toLocaleString()} is required for your first transaction with the {currentUserPlan.name} plan.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <FormField
                                control={form.control}
                                name="crypto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Select Cryptocurrency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-base">
                                                    <SelectValue placeholder="Select a cryptocurrency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {cryptocurrencies.map(crypto => (
                                                <SelectItem key={crypto.value} value={crypto.value} className="text-base py-2">
                                                    <div className="flex items-center gap-3">
                                                    {crypto.icon}
                                                    {crypto.label}
                                                    </div>
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amountUSD"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Amount (USD)</FormLabel>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                type="number"
                                                step="0.01"
                                                placeholder={`e.g., ${minimumDepositAmount}`}
                                                className="pl-10 h-12 text-base"
                                                {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="text-sm text-muted-foreground">
                                You will receive approximately: <span className="font-semibold text-foreground">{cryptoAmount} {selectedCrypto.value}</span>
                            </div>

                        </CardContent>
                        <CardFooter>
                        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Confirm Deposit Details
                        </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="lg:col-span-1 shadow-lg h-fit">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        {selectedCrypto.icon} {selectedCrypto.label} Deposit Address
                    </CardTitle>
                    <CardDescription>Send {selectedCrypto.value} to the address below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div className="bg-muted p-4 rounded-md flex justify-center">
                        <Image src={selectedCrypto.qr} alt={`${selectedCrypto.label} QR Code`} width={150} height={150} data-ai-hint={selectedCrypto.dataAiHint} />
                    </div>
                    <p className="text-sm font-mono break-all bg-muted/50 p-3 rounded-md">
                        {selectedCrypto.address}
                    </p>
                    <Button variant="outline" className="w-full" onClick={handleCopyAddress}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Address
                    </Button>
                    <Alert variant="destructive" className="text-left">
                    <QrCode className="h-5 w-5" />
                    <AlertTitle>Important!</AlertTitle>
                    <AlertDescription>
                        Only send {selectedCrypto.value} to this address. Sending any other coins may result in permanent loss.
                    </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
