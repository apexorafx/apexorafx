
'use server';
import { z } from 'zod';
import { ContactFormSchema, type ContactFormValues } from './types';
import { db } from './db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(values: ContactFormValues) {
    const parsed = ContactFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, message: "Invalid form data." };
    }

    const { name, email, subject, message } = parsed.data;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Apexora Contact Form <onboarding@resend.dev>',
            to: ['support@apexora.com'],
            subject: `New Contact Form Submission: ${subject}`,
            reply_to: email,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #3B82F6;">New Message from Apexora Contact Form</h2>
                <p>You have received a new message from your website's contact form.</p>
                <hr>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, message: "Failed to send the message. Please try again later." };
        }

        return { success: true, message: "Message sent successfully!" };

    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: "An internal error occurred. Please try again." };
    }
}


export async function createUserInDb(data: { firebaseUid: string; email: string; username: string }) {
  const { firebaseUid, email, username } = data;
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const userInsertQuery = `
      INSERT INTO users (firebase_auth_uid, email, username, trading_plan_id)
      VALUES ($1, $2, $3, 1)
      RETURNING id;
    `;
    const userResult = await client.query(userInsertQuery, [firebaseUid, email, username.toLowerCase()]);
    const newUserId = userResult.rows[0].id;

    if (!newUserId) {
      throw new Error('Failed to create user.');
    }

    const walletInsertQuery = `
      INSERT INTO wallets (user_id)
      VALUES ($1);
    `;
    await client.query(walletInsertQuery, [newUserId]);

    await client.query('COMMIT');
    return { success: true, userId: newUserId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database error creating user:', error);
    if (error instanceof Error && (error as any).code === '23505') { // Unique constraint violation
        if (error.message.includes('users_email_key')) {
            return { success: false, message: 'An account with this email already exists.' };
        }
        if (error.message.includes('users_username_key')) {
            return { success: false, message: 'This username is already taken.' };
        }
    }
    return { success: false, message: 'An internal error occurred. Please try again.' };
  } finally {
    client.release();
  }
}
