'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, KeyRound, ImageIcon, Loader2, Save, Info, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema, type UpdateProfileFormValues } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';
import { auth } from '@/lib/firebase'; 
import { sendPasswordResetEmail } from 'firebase/auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { updateUserProfile } from '@/lib/actions';
import { tradingPlans } from '@/lib/plans';

export function ProfileForm() {
  const { appUser, loading: authIsLoading, updateAppUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(() => ({
    firstName: appUser?.first_name || '',
    lastName: appUser?.last_name || '',
    username: appUser?.username || '',
    phoneNumber: appUser?.phone_number || '',
    countryCode: appUser?.country_code || '',
  }), [appUser]);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (appUser) {
        form.reset(defaultValues);
    }
  }, [appUser, form, defaultValues]);


  const getInitials = (name?: string | null) => {
    if (!name) return 'AP';
    const nameParts = name.split(' ');
    const initials = nameParts.map(n => n[0]).join('').toUpperCase();
    return initials.length > 2 ? initials.substring(0, 2) : initials || 'AP';
  };

  const handleEditProfileClick = () => {
    form.reset(defaultValues); 
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset(defaultValues); 
  };

  const onSubmit = async (data: UpdateProfileFormValues) => {
    if (!appUser?.firebase_auth_uid) {
      toast({ title: "Error", description: "User session not found.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await updateUserProfile(appUser.firebase_auth_uid, data);

      if (result.success && result.user) {
        toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
        updateAppUser(result.user); 
        setIsEditing(false);
      } else {
        toast({
          title: "Update Failed",
          description: result.message || "Could not update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!appUser?.email) {
      toast({ title: "Error", description: "User email not found. Cannot send reset link.", variant: "destructive" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, appUser.email);
      toast({ title: "Password Reset Email Sent", description: `A password reset link has been sent to ${appUser.email}. Please check your inbox.` });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast({ title: "Error", description: error.message || "Failed to send password reset email.", variant: "destructive" });
    }
  };
  
  const handleFeatureComingSoon = (featureName: string) => {
    toast({
      title: `${featureName} - Coming Soon`,
      description: `The ${featureName.toLowerCase()} functionality is not yet implemented. Please check back later!`,
      duration: 3000,
    });
  };

  if (authIsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <UserCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold text-destructive-foreground">User data not found.</p>
        <p className="text-muted-foreground text-center">Could not load user profile details. Please try refreshing or contact support if the issue persists.</p>
      </div>
    );
  }
  
  const currentPlan = tradingPlans.find(p => p.id === appUser.trading_plan_id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Your Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Account Information</CardTitle>
            <CardDescription>View {isEditing ? 'and edit ' : ''}your personal details.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={`https://api.dicebear.com/8.x/initials/svg?seed=${appUser.username}`}
                      alt={appUser.username || 'User'}
                    />
                    <AvatarFallback>{getInitials(appUser.username)}</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleFeatureComingSoon('Change Profile Picture')} disabled>
                    <ImageIcon className="mr-2 h-4 w-4" /> Change Profile Picture
                  </Button>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} className={`mt-1 ${!isEditing ? 'bg-muted/50' : ''}`} />
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
                          <Input {...field} readOnly={!isEditing} className={`mt-1 ${!isEditing ? 'bg-muted/50' : ''}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} className={`mt-1 ${!isEditing ? 'bg-muted/50' : ''}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <Label htmlFor="email_display">Email</Label>
                    <Input id="email_display" type="email" value={appUser.email} readOnly className="mt-1 bg-muted/50" />
                     <div className="flex items-center text-xs text-muted-foreground pt-1">
                        <Info className="h-3 w-3 mr-1.5" /> Email cannot be changed.
                    </div>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} readOnly={!isEditing} className={`mt-1 ${!isEditing ? 'bg-muted/50' : ''}`} />
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
                        {isEditing ? (
                          <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map(country => (
                                <SelectItem key={country.value} value={country.value}>{country.label} ({country.value})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input value={countries.find(c => c.value === appUser.country_code)?.label || appUser.country_code || 'N/A'} readOnly className="mt-1 bg-muted/50" />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <Label htmlFor="tradingPlan_display">Trading Plan</Label>
                    <Input id="tradingPlan_display" value={currentPlan?.name || 'N/A'} readOnly className="mt-1 bg-muted/50" />
                     <div className="flex items-center text-xs text-muted-foreground pt-1">
                        <Info className="h-3 w-3 mr-1.5" /> Contact support to change your plan.
                    </div>
                  </FormItem>
                  <FormItem>
                    <Label htmlFor="profileCompletedAt_display">Joined On</Label>
                    <Input id="profileCompletedAt_display" value={appUser.created_at ? new Date(appUser.created_at).toLocaleDateString() : 'N/A'} readOnly className="mt-1 bg-muted/50" />
                  </FormItem>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button type="button" onClick={handleEditProfileClick}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="shadow-lg h-fit">
          <CardHeader>
            <CardTitle className="text-xl">Security Settings</CardTitle>
            <CardDescription>Manage your account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" className="w-full justify-start" onClick={handleChangePassword}>
              <Mail className="mr-2 h-4 w-4" /> Send Password Reset Email
            </Button>
            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => handleFeatureComingSoon('Change Trading PIN')} disabled>
              <KeyRound className="mr-2 h-4 w-4" /> Change Trading PIN
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
