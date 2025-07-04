
'use server';
import { z } from 'zod';
import { ContactFormSchema, type AppUser, type ContactFormValues, type DashboardData, UpdateProfileSchema, type UpdateProfileFormValues, CompleteProfileSchema, type CompleteProfileFormValues, SetupPinSchema, type DepositFormValues, type TransactionHistoryEntry, BankWithdrawalFormSchema, BTCWithdrawalFormSchema } from './types';
import { db } from './db';
import { Resend } from 'resend';
import { generateImage } from '@/ai/flows/generate-image-flow';

export async function submitContactForm(values: ContactFormValues) {
    const parsed = ContactFormSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, message: "Invalid form data." };
    }
    
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY' || apiKey.trim() === '') {
      console.error('Resend API Key is not configured.');
      return { success: false, message: 'This feature is not available at the moment. Please contact us directly.' };
    }
    
    const resend = new Resend(apiKey);
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

export async function checkUsernameExists(username: string) {
    const client = await db.getClient();
    try {
        const query = 'SELECT 1 FROM users WHERE username = $1';
        const result = await client.query(query, [username.toLowerCase()]);
        return { exists: result.rows.length > 0 };
    } catch (error) {
        console.error('Database error checking username:', error);
        // In case of a db error, it's safer to prevent signup by returning true
        // and providing an error message for the client to display.
        return { exists: true, error: "Could not verify username. Please try again." };
    } finally {
        client.release();
    }
}


export async function getImageByContextTag(tag: string, hint: string): Promise<{ imageUrl: string; altText: string } | null> {
  const client = await db.getClient();
  try {
    const selectQuery = `
      SELECT image_url, alt_text FROM images WHERE context_tag = $1 LIMIT 1;
    `;
    const selectResult = await client.query(selectQuery, [tag]);

    if (selectResult.rows.length > 0) {
      const imageUrl = selectResult.rows[0].image_url;
      // Filter out invalid placeholder URLs.
      if (imageUrl && !imageUrl.startsWith('data:image/')) {
        console.warn(`Filtered out invalid image URL for tag: ${tag}. Will regenerate.`);
      } else {
        return {
          imageUrl: imageUrl,
          altText: selectResult.rows[0].alt_text || 'Apexora promotional image',
        };
      }
    }

    // If no valid image is found, generate a new one.
    console.log(`No valid image found for tag "${tag}". Generating new image with hint: "${hint}"`);
    const newImage = await generateImage({ prompt: hint });

    if (newImage && newImage.imageUrl) {
      const upsertQuery = `
        INSERT INTO images (context_tag, image_url, alt_text)
        VALUES ($1, $2, $3)
        ON CONFLICT (context_tag) DO UPDATE
        SET image_url = EXCLUDED.image_url, alt_text = EXCLUDED.alt_text;
      `;
      await client.query(upsertQuery, [tag, newImage.imageUrl, newImage.altText]);
      console.log(`Successfully generated and saved new image for tag "${tag}".`);
      return newImage;
    }

    return null;
  } catch (error) {
    console.error(`Database error or image generation failed for tag "${tag}":`, error);
    return null;
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
      SELECT id, transaction_type, amount_usd_equivalent, status, created_at as processed_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5;
    `;
    const transactionsResult = await client.query(transactionsQuery, [user.id]);
    
    const copyTradesQuery = 'SELECT COUNT(*) FROM user_copied_traders WHERE user_id = $1';
    const copyTradesResult = await client.query(copyTradesQuery, [user.id]);
    const activeCopyTrades = parseInt(copyTradesResult.rows[0].count, 10);
    
    const transactionTotalsQuery = `
      SELECT
        SUM(CASE WHEN transaction_type = 'deposit' AND status = 'completed' THEN amount_usd_equivalent ELSE 0 END) as total_deposited,
        SUM(CASE WHEN transaction_type = 'withdrawal' AND status = 'completed' THEN amount_usd_equivalent ELSE 0 END) as total_withdrawn
      FROM transactions
      WHERE user_id = $1;
    `;
    const transactionTotalsResult = await client.query(transactionTotalsQuery, [user.id]);
    const totals = transactionTotalsResult.rows[0];
    const totalDeposited = parseFloat(totals.total_deposited || '0');
    const totalWithdrawn = parseFloat(totals.total_withdrawn || '0');

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
    const fieldsToUpdate = Object.entries(parsed.data).filter(([, value]) => value !== undefined && value !== '');

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

// Copy Trading Actions

export async function getCopiedTraderIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  const client = await db.getClient();
  try {
    const query = 'SELECT trader_id FROM user_copied_traders WHERE user_id = $1';
    const result = await client.query(query, [userId]);
    return result.rows.map(row => row.trader_id);
  } catch (error) {
    console.error('Database error fetching copied traders:', error);
    throw new Error('Could not fetch copied traders.');
  } finally {
    client.release();
  }
}

export async function copyTrader(userId: string, traderId: string) {
  if (!userId || !traderId) {
    throw new Error('User ID and Trader ID are required.');
  }
  const client = await db.getClient();
  try {
    const query = 'INSERT INTO user_copied_traders (user_id, trader_id) VALUES ($1, $2)';
    await client.query(query, [userId, traderId]);
    return { success: true };
  } catch (error) {
    console.error('Database error copying trader:', error);
    throw new Error('Could not copy trader.');
  } finally {
    client.release();
  }
}

export async function stopCopyingTrader(userId: string, traderId: string) {
  if (!userId || !traderId) {
    throw new Error('User ID and Trader ID are required.');
  }
  const client = await db.getClient();
  try {
    const query = 'DELETE FROM user_copied_traders WHERE user_id = $1 AND trader_id = $2';
    await client.query(query, [userId, traderId]);
    return { success: true };
  } catch (error) {
    console.error('Database error stopping copy trade:', error);
    throw new Error('Could not stop copying trader.');
  } finally {
    client.release();
  }
}

export async function completeUserProfile(firebaseUid: string, data: CompleteProfileFormValues) {
  const parsed = CompleteProfileSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Invalid form data.", errors: parsed.error.flatten() };
  }

  const { tradingPlanId, firstName, lastName, phoneNumber, countryCode } = parsed.data;
  const client = await db.getClient();
  try {
    const query = `
      UPDATE users
      SET
        trading_plan_id = $1,
        first_name = $2,
        last_name = $3,
        phone_number = $4,
        country_code = $5,
        profile_completed_at = NOW()
      WHERE firebase_auth_uid = $6
      RETURNING *;
    `;
    const values = [tradingPlanId, firstName, lastName, phoneNumber, countryCode, firebaseUid];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      return { success: true, user: result.rows[0] as AppUser };
    } else {
      return { success: false, message: 'User not found or update failed.' };
    }
  } catch (error) {
    console.error('Database error completing user profile:', error);
    return { success: false, message: 'An internal server error occurred.' };
  } finally {
    client.release();
  }
}

export async function completePinSetup(firebaseUid: string, pin: string) {
  const parsed = SetupPinSchema.safeParse({ pin, confirmPin: pin }); // Re-validate on server
  if (!parsed.success) {
      return { success: false, message: "Invalid PIN format." };
  }

  // In a real app, you would hash and store the pin securely.
  // For this demo, we'll just mark the step as complete.
  if (!firebaseUid) {
    return { success: false, message: 'User session not found.' };
  }

  const client = await db.getClient();
  try {
    const query = `
      UPDATE users
      SET
        pin_setup_completed_at = NOW()
      WHERE firebase_auth_uid = $1
      RETURNING *;
    `;
    const result = await client.query(query, [firebaseUid]);

    if (result.rows.length > 0) {
      return { success: true, user: result.rows[0] as AppUser };
    } else {
      return { success: false, message: 'User not found or update failed.' };
    }
  } catch (error) {
    console.error('Database error completing PIN setup:', error);
    return { success: false, message: 'An internal server error occurred.' };
  } finally {
    client.release();
  }
}

export async function checkIfFirstDeposit(userId: string): Promise<boolean> {
  if (!userId) {
    return false;
  }
  const client = await db.getClient();
  try {
    const query = `
      SELECT 1 FROM transactions
      WHERE user_id = $1 AND transaction_type = 'deposit' AND status = 'completed'
      LIMIT 1;
    `;
    const result = await client.query(query, [userId]);
    return result.rows.length === 0;
  } catch (error) {
    console.error('Database error checking for first deposit:', error);
    return false;
  } finally {
    client.release();
  }
}

export async function createDepositTransaction(data: { userId: string; amountUSD: number; crypto: string }) {
  const schema = z.object({
    userId: z.string(),
    amountUSD: z.number().positive(),
    crypto: z.string().min(1),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid deposit data." };
  }

  const { userId, amountUSD } = parsed.data;

  const client = await db.getClient();
  try {
    const query = `
      INSERT INTO transactions (user_id, transaction_type, amount_usd_equivalent, status)
      VALUES ($1, 'deposit', $2, 'pending')
      RETURNING id;
    `;
    const result = await client.query(query, [userId, amountUSD]);
    if (result.rows.length > 0) {
      return { success: true, transactionId: result.rows[0].id };
    }
    return { success: false, message: 'Failed to create transaction.' };
  } catch (error) {
    console.error('Database error creating deposit transaction:', error);
    return { success: false, message: 'An internal error occurred.' };
  } finally {
    client.release();
  }
}

export async function getTransactionHistory(userId: string): Promise<TransactionHistoryEntry[]> {
  if (!userId) {
    console.error("getTransactionHistory called without userId");
    return [];
  }
  const client = await db.getClient();
  try {
    const query = `
      SELECT id, created_at, transaction_type, asset_name, amount_crypto, amount_usd_equivalent, status, description
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await client.query(query, [userId]);
    return result.rows as TransactionHistoryEntry[];
  } catch (error) {
    console.error('Database error fetching transaction history:', error);
    return [];
  } finally {
    client.release();
  }
}

export async function createWithdrawalRequest(
  userId: string,
  type: 'bank' | 'btc',
  data: BankWithdrawalFormSchema | BTCWithdrawalFormSchema
) {
  // In a real app, this would create a 'pending' withdrawal transaction
  // and likely trigger an admin notification.
  // For this demo, we'll just log it.
  console.log(`Withdrawal request for user ${userId}, type: ${type}, data:`, data);
  return { success: true };
}
