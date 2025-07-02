
'use server';
import { z } from 'zod';
import { ContactFormSchema, type ContactFormValues } from './types';
import { db } from './db';

export async function submitContactForm(values: ContactFormValues) {
    const parsed = ContactFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, message: "Invalid form data." };
    }

    console.log('Contact form submitted:', parsed.data);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: "Message sent successfully!" };
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
