'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { tradingPlans } from '@/lib/plans';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';
import { CompleteProfileSchema, type CompleteProfileFormValues } from '@/lib/types';
import { completeUserProfile } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function SignupDetailsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { appUser, updateAppUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(CompleteProfileSchema),
    defaultValues: {
      tradingPlanId: 1, // Default to beginner
      firstName: '',
      lastName: '',
      phoneNumber: '',
      countryCode: '',
    },
  });

  async function onSubmit(values: CompleteProfileFormValues) {
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
      const result = await completeUserProfile(appUser.firebase_auth_uid, values);
      if (result.success && result.user) {
        updateAppUser(result.user);
        toast({
          title: 'Profile Completed!',
          description: 'Welcome to your dashboard.',
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.message || 'An error occurred. Please try again.',
        });
      }
    } catch (error) {
      console.error('Failed to complete profile:', error);
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred',
        description: 'Please try again later or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tradingPlanId"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold">Select Your Account Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={String(field.value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {tradingPlans.map((plan) => (
                      <FormItem key={plan.id}>
                        <FormControl>
                            <RadioGroupItem value={String(plan.id)} id={`plan-${plan.id}`} className="peer sr-only" />
                        </FormControl>
                         <Label
                            htmlFor={`plan-${plan.id}`}
                            className={cn(
                                "flex flex-col rounded-lg border-2 bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                                "cursor-pointer"
                            )}
                         >
                            <div className="flex items-center justify-between">
                                <span className="font-bold">{plan.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                            <p className="text-sm font-semibold mt-2">{plan.priceDescription}</p>
                         </Label>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map(country => (
                                <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
