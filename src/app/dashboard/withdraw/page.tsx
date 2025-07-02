'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, DollarSign, AlertTriangle, Landmark, Bitcoin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { countries } from '@/lib/countries';
import { BankWithdrawalFormSchema, type BankWithdrawalFormValues, BTCWithdrawalFormSchema, type BTCWithdrawalFormValues } from '@/lib/types';
import Link from 'next/link';

const MOCK_BTC_PRICE_USD = 68000;

export default function WithdrawPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bank");
  const [btcAmount, setBtcAmount] = useState('0.00000000');

  const bankForm = useForm<BankWithdrawalFormValues>({
    resolver: zodResolver(BankWithdrawalFormSchema),
    defaultValues: {
      amountUSD: 0,
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      swiftBic: '',
      bankCountry: '',
      iban: '',
      sortCode: '',
      routingNumber: '',
      notes: '',
    },
  });

  const btcForm = useForm<BTCWithdrawalFormValues>({
    resolver: zodResolver(BTCWithdrawalFormSchema),
    defaultValues: {
      amountUSD: 0,
      btcAddress: '',
      notes: '',
    },
  });

  const { handleSubmit: handleBankSubmit, formState: { isSubmitting: isBankSubmitting }, reset: resetBankForm } = bankForm;
  const { handleSubmit: handleBtcSubmit, watch: watchBtcAmountUSD, formState: { isSubmitting: isBtcSubmitting }, reset: resetBtcForm } = btcForm;
  
  const btcAmountUSD = watchBtcAmountUSD('amountUSD');

  useEffect(() => {
    if (btcAmountUSD && btcAmountUSD > 0) {
      setBtcAmount((btcAmountUSD / MOCK_BTC_PRICE_USD).toFixed(8));
    } else {
      setBtcAmount('0.00000000');
    }
  }, [btcAmountUSD]);

  const onBankSubmit = (data: BankWithdrawalFormValues) => {
    console.log("Bank withdrawal request submitted:", data);
    toast({
      title: "Withdrawal Request Submitted",
      description: `Your bank withdrawal of $${data.amountUSD.toFixed(2)} is being processed. This is a UI demonstration.`,
    });
    resetBankForm();
  };

  const onBtcSubmit = (data: BTCWithdrawalFormValues) => {
    console.log("BTC withdrawal request submitted:", data);
    const calculatedBtcAmount = (data.amountUSD / MOCK_BTC_PRICE_USD).toFixed(8);
    toast({
      title: "Withdrawal Request Submitted",
      description: `Your withdrawal of approx. ${calculatedBtcAmount} BTC to ${data.btcAddress} is being processed. This is a UI demonstration.`,
    });
    resetBtcForm();
    setBtcAmount('0.00000000');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight flex items-center">
        <ArrowUpCircle className="mr-3 h-8 w-8" /> Withdraw Funds
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3">
          <TabsTrigger value="bank"><Landmark className="mr-2 h-5 w-5" />Bank Transfer</TabsTrigger>
          <TabsTrigger value="btc"><Bitcoin className="mr-2 h-5 w-5" />BTC</TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 shadow-lg">
              <Form {...bankForm}>
                <form onSubmit={handleBankSubmit(onBankSubmit)}>
                  <CardHeader>
                    <CardTitle className="text-xl">Request Bank Withdrawal</CardTitle>
                    <CardDescription>Enter your bank details and the amount you wish to withdraw.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <AlertTriangle className="h-5 w-5" />
                      <AlertTitle>Processing Times & Fees</AlertTitle>
                      <AlertDescription>
                        Bank withdrawals may take 3-5 business days. Fees may be applied by intermediary banks. Minimum withdrawal is $50.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={bankForm.control} name="amountUSD" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount (USD)</FormLabel>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <FormControl><Input type="number" step="0.01" placeholder="e.g., 100" className="pl-10" {...field} /></FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={bankForm.control} name="accountHolderName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Holder Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={bankForm.control} name="bankName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Global First Bank" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl><Input placeholder="e.g., 1234567890" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={bankForm.control} name="swiftBic" render={({ field }) => (
                            <FormItem>
                                <FormLabel>SWIFT/BIC Code (Optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., BANKUS33" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={bankForm.control} name="bankCountry" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select bank's country" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {countries.map(country => (<SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={bankForm.control} name="notes" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Notes (Optional)</FormLabel>
                                <FormControl><Input placeholder="Any specific instructions" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" size="lg" disabled={isBankSubmitting}>
                      {isBankSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Request Bank Withdrawal
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            <Card className="lg:col-span-1 shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Landmark className="mr-2 h-5 w-5 text-primary"/>Important Bank Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Verification</AlertTitle>
                  <AlertDescription>New bank accounts may require additional verification for security purposes.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Correct Details</AlertTitle>
                  <AlertDescription>
                    Ensure all bank details are accurate. Incorrect information can lead to delays or failed transactions. Apexora FX Hub is not responsible for losses due to incorrect details provided.
                  </AlertDescription>
                </Alert>
                 <p className="text-sm text-muted-foreground">
                    If you encounter any issues, please contact <Link href="/contact" className="text-primary hover:underline">Support</Link>.
                 </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="btc" className="mt-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 shadow-lg">
              <Form {...btcForm}>
                <form onSubmit={handleBtcSubmit(onBtcSubmit)}>
                  <CardHeader>
                    <CardTitle className="text-xl">Request BTC Withdrawal</CardTitle>
                    <CardDescription>Enter your BTC wallet address and the amount (in USD) to withdraw.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <Bitcoin className="h-4 w-4" />
                      <AlertTitle>BTC Network & Fees</AlertTitle>
                      <AlertDescription>
                        BTC withdrawals are processed on the Bitcoin network. Network fees will apply and are deducted from the withdrawal amount. Minimum withdrawal is $20.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                        <FormField control={btcForm.control} name="amountUSD" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Amount (USD)</FormLabel>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <FormControl><Input type="number" step="0.01" placeholder="e.g., 100" className="pl-10" {...field} /></FormControl>
                                </div>
                                <FormMessage />
                                <p className="text-xs text-muted-foreground mt-1">Approx. <span className="font-semibold text-foreground">{btcAmount}</span> BTC</p>
                            </FormItem>
                        )}/>
                        <FormField control={btcForm.control} name="btcAddress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>BTC Wallet Address</FormLabel>
                                <FormControl><Input placeholder="Enter your BTC wallet address" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={btcForm.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes (Optional)</FormLabel>
                                <FormControl><Input placeholder="Any specific instructions" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" size="lg" disabled={isBtcSubmitting}>
                       {isBtcSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Request BTC Withdrawal
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            <Card className="lg:col-span-1 shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Bitcoin className="mr-2 h-5 w-5 text-primary"/>Important BTC Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Triple Check Your Address!</AlertTitle>
                  <AlertDescription>
                    BTC transactions are irreversible. Ensure your BTC wallet address is correct. Sending to an incorrect address will result in permanent loss of funds.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Network Confirmations</AlertTitle>
                  <AlertDescription>
                    Once broadcasted, transactions require network confirmations. This may take some time depending on network congestion.
                  </AlertDescription>
                </Alert>
                 <p className="text-sm text-muted-foreground">
                    The BTC amount is an estimate based on the current market price of ~${MOCK_BTC_PRICE_USD.toLocaleString()}/BTC.
                 </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
