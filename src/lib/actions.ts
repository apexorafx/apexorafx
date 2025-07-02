
'use server';
import { z } from 'zod';
import { ContactFormSchema, type AppUser, type ContactFormValues, type DashboardData, UpdateProfileSchema, type UpdateProfileFormValues } from './types';
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

export async function getImageByContextTag(tag: string): Promise<{ imageUrl: string; altText: string } | null> {
  const client = await db.getClient();
  try {
    const query = `
      SELECT image_url, alt_text FROM images WHERE context_tag = $1 LIMIT 1;
    `;
    const result = await client.query(query, [tag]);
    if (result.rows.length > 0) {
      return {
        imageUrl: result.rows[0].image_url,
        altText: result.rows[0].alt_text || 'Apexora promotional image',
      };
    }
    return null;
  } catch (error) {
    console.error(`Database error fetching image with tag "${tag}":`, error);
    return null; // Return null on error to avoid breaking the page
  } finally {
    client.release();
  }
}

export async function getDashboardData(firebaseUid: string): Promise<DashboardData | null> {
  if (!firebaseUid) return null;

  const client = await db.getClient();
  try {
    const userQuery = 'SELECT id, username FROM users WHERE firebase_auth_uid = $1';
    const userResult = await client.query(userQuery, [firebaseUid]);

    if (userResult.rows.length === 0) {
      console.error(`No user found with firebase_auth_uid: ${firebaseUid}`);
      return null;
    }
    const user = userResult.rows[0];

    const walletQuery = 'SELECT balance, profit_loss_balance FROM wallets WHERE user_id = $1';
    const walletResult = await client.query(walletQuery, [user.id]);
    
    const wallet = walletResult.rows.length > 0 ? walletResult.rows[0] : { balance: '0', profit_loss_balance: '0' };
    const balance = parseFloat(wallet.balance);
    const profitLoss = parseFloat(wallet.profit_loss_balance);
    const totalAssets = balance + profitLoss;

    const transactionsQuery = `
      SELECT id, transaction_type, amount_usd_equivalent, status, processed_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5;
    `;
    const transactionsResult = await client.query(transactionsQuery, [user.id]);
    
    const copyTradesQuery = 'SELECT COUNT(*) FROM user_copied_traders WHERE user_id = $1';
    const copyTradesResult = await client.query(copyTradesQuery, [user.id]);
    const activeCopyTrades = parseInt(copyTradesResult.rows[0].count, 10);
    
    // Mocked data for now
    const totalDeposited = 65000.00;
    const totalWithdrawn = 0.00;

    return {
      username: user.username,
      totalAssets,
      totalDeposited,
      profitLoss,
      totalWithdrawn,
      activeCopyTrades,
      recentTransactions: transactionsResult.rows,
    };
  } catch (error) {
    console.error('Database error fetching dashboard data:', error);
    return null;
  } finally {
    client.release();
  }
}

export async function getUserByFirebaseUid(firebaseUid: string): Promise<AppUser | null> {
    if (!firebaseUid) return null;

    const client = await db.getClient();
    try {
        const query = 'SELECT * FROM users WHERE firebase_auth_uid = $1';
        const result = await client.query(query, [firebaseUid]);

        if (result.rows.length > 0) {
            return result.rows[0] as AppUser;
        }

        return null;
    } catch (error) {
        console.error('Database error fetching user by Firebase UID:', error);
        return null;
    } finally {
        client.release();
    }
}

const mapToDbColumn = (fieldName: keyof UpdateProfileFormValues): string | null => {
  const mapping: Record<keyof UpdateProfileFormValues, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    username: 'username',
    phoneNumber: 'phone_number',
    countryCode: 'country_code',
  };
  return mapping[fieldName] || null;
}

export async function updateUserProfile(firebaseUid: string, data: UpdateProfileFormValues) {
  const parsed = UpdateProfileSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Invalid form data.", errors: parsed.error.flatten() };
  }

  const client = await db.getClient();
  try {
    const fieldsToUpdate = Object.entries(parsed.data).filter(([, value]) => value !== undefined);

    if (fieldsToUpdate.length === 0) {
      return { success: true, message: 'No changes were made.', user: null };
    }

    const setClauses = fieldsToUpdate.map(([key], index) => {
        const dbColumn = mapToDbColumn(key as keyof UpdateProfileFormValues);
        if (!dbColumn) throw new Error(`Invalid field name: ${key}`);
        return `${dbColumn} = $${index + 1}`;
    }).join(', ');
    
    const values = fieldsToUpdate.map(([, value]) => value);

    const query = `
      UPDATE users
      SET ${setClauses}
      WHERE firebase_auth_uid = $${values.length + 1}
      RETURNING *;
    `;
    
    values.push(firebaseUid);
    
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      return { success: true, user: result.rows[0] as AppUser };
    } else {
      return { success: false, message: 'User not found or no update was made.' };
    }

  } catch (error) {
    console.error('Database error updating user profile:', error);
     if (error instanceof Error && (error as any).code === '23505') {
        if (error.message.includes('users_username_key')) {
            return { success: false, message: 'This username is already taken.' };
        }
    }
    return { success: false, message: 'An internal error occurred. Please try again.' };
  } finally {
    client.release();
  }
}
