'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { SetupPinSchema, type SetupPinFormValues } from '@/lib/types';
import { completePinSetup } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { KeyRound } from 'lucide-react';

export function SetupPinForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { appUser, updateAppUser, loading: authIsLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SetupPinFormValues>({
    resolver: zodResolver(SetupPinSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  async function onSubmit(values: SetupPinFormValues) {
    if (!appUser) {
      toast({
        variant: 'destructive',
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
      });
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // The pin value is passed for validation but not stored in plain text.
      // The action marks the setup as complete with a timestamp.
      const result = await completePinSetup(appUser.firebase_auth_uid, values.pin);

      if (result.success && result.user) {
        updateAppUser(result.user);
        toast({
          title: 'PIN Setup Complete!',
          description: 'Your account is now fully secured. Welcome to the dashboard.',
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Setup Failed',
          description: result.message || 'An error occurred. Please try again.',
        });
      }
    } catch (error) {
      console.error('Failed to set up PIN:', error);
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred',
        description: 'Please try again later or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isDisabled = authIsLoading || isSubmitting;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold font-headline">Setup Your Trading PIN</CardTitle>
        <CardDescription>This 4-digit PIN adds an extra layer of security for transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>4-Digit PIN</FormLabel>
                  <FormControl>
                    <Input type="password" maxLength={4} placeholder="&#9679;&#9679;&#9679;&#9679;" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm PIN</FormLabel>
                  <FormControl>
                    <Input type="password" maxLength={4} placeholder="&#9679;&#9679;&#9679;&#9679;" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isDisabled}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving PIN...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
