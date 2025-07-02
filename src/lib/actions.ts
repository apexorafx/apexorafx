
'use server';
import { z } from 'zod';
import { ContactFormSchema, type ContactFormValues } from './types';

export async function submitContactForm(values: ContactFormValues) {
    const parsed = ContactFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, message: "Invalid form data." };
    }

    // In a real app, you'd send an email or save to a database here.
    console.log('Contact form submitted:', parsed.data);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always return a success response for this demo
    return { success: true, message: "Message sent successfully!" };
}
