
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, HelpCircle, MessageSquare, Mail, Phone, Search, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ContactFormSchema, type ContactFormValues } from "@/lib/types";
import { submitContactForm } from "@/lib/actions";

const faqItems = [
  {
    question: "How do I make a deposit?",
    answer: "You can make a deposit by navigating to the 'Deposit Funds' section in your dashboard. Select your preferred cryptocurrency, enter the amount in USD, and follow the instructions to send funds to the provided address."
  },
  {
    question: "What is the minimum deposit amount?",
    answer: "The minimum deposit amount depends on your account type. For example, the Standard plan has a $5,000 minimum first deposit. You can review all plan minimums on the pricing page."
  },
  {
    question: "How can I change my password or Trading PIN?",
    answer: "You can change your password by sending a password reset email from your Profile page. Trading PIN changes are currently managed by support for security reasons. Please contact us if you need to change your PIN."
  },
  {
    question: "How does Copy Trading work?",
    answer: "Copy Trading allows you to automatically replicate the trades of experienced traders on our platform. Browse available traders in the 'Copy Trading' section, choose one to copy, and their trades will then be copied to your account."
  },
   {
    question: "How do I withdraw funds?",
    answer: "Navigate to the 'Withdraw Funds' section in your dashboard. Select your withdrawal method (Bank or BTC), enter the amount, and provide the necessary details. Withdrawals may take some time to process."
  },
  {
    question: "What trading platforms are available?",
    answer: "Apexora FX Hub offers a powerful WebTrader accessible from any modern browser, which is fully synced with your dashboard."
  }
];

export default function SupportPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(values);
       if (result.success) {
         toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will get back to you shortly.",
        });
        form.reset();
       } else {
         toast({
          variant: "destructive",
          title: "Something went wrong",
          description: result.message,
        });
       }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to send the message. Please try again later.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleFeatureComingSoon = (featureName: string) => {
    toast({
      title: `${featureName} - Coming Soon`,
      description: `The ${featureName.toLowerCase()} functionality is not yet implemented. Please check back later!`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
        <LifeBuoy className="mr-3 h-8 w-8" /> Support Center
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><HelpCircle className="mr-2 h-6 w-6 text-primary"/>Frequently Asked Questions (FAQ)</CardTitle>
               <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search FAQs... (coming soon)" className="pl-8 w-full" disabled />
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-base hover:no-underline text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-primary"/>Send Us a Message</CardTitle>
              <CardDescription>Can't find an answer? Fill out the form below.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl><Input placeholder="e.g., Question about my account" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl><Textarea placeholder="Please describe your issue or question in detail." rows={5} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Ticket"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Email Support</h4>
                  <p className="text-sm text-muted-foreground">support@apexora.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">+1 (800) 555-APEX</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>
               <Button variant="outline" className="w-full" onClick={() => handleFeatureComingSoon('Live Chat')}>
                <MessageSquare className="mr-2 h-4 w-4" /> Start Live Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
