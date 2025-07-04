
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ContactFormSchema, type ContactFormValues } from "@/lib/types";
import { submitContactForm } from "@/lib/actions";
import { Loader2 } from "lucide-react";


export default function ContactPage() {
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Have a question or need support? Fill out the form, and our team will get back to you as soon as possible.
          </p>
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p><strong>Support Email:</strong> support@apexora.com</p>
            <p><strong>Business Inquiries:</strong> business@apexora.com</p>
            <p><strong>Address:</strong> 123 Financial District, Capital City, 12345</p>
          </div>
           <div className="mt-8">
            <h3 className="text-xl font-bold font-headline">Feedback</h3>
            <p className="mt-2 text-muted-foreground">We value your opinion. Help us improve by providing your feedback.</p>
            <Button asChild variant="link" className="p-0 h-auto mt-2">
              <Link href="#">Go to Feedback Form &rarr;</Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Send us a message</CardTitle>
            <CardDescription>We're here to help you with any questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Question about my account" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe your issue or question in detail." rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
