
import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;


export interface TradingPlan {
  id: number;
  name: string;
  minimum_deposit_usd: number;
  description?: string | null;
  commission_details?: any;
  leverage_info?: any;
  max_open_trades?: number | null;
  allow_copy_trading: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AppUser {
  id: string; // UUID
  firebase_auth_uid: string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  country_code?: string | null;
  trading_plan_id: number;
  profile_completed_at?: Date | null;
  pin_setup_completed_at?: Date | null;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  admin_pin?: string | null;
}

export interface Transaction {
  id: string;
  transaction_type: string;
  amount_usd_equivalent: string;
  status: string;
  processed_at: Date;
}

export interface DashboardData {
  username: string;
  totalAssets: number;
  totalDeposited: number;
  profitLoss: number;
  totalWithdrawn: number;
  activeCopyTrades: number;
  recentTransactions: Transaction[];
}

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(100).optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(100).optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.").optional(),
  phoneNumber: z.string().max(50).optional(),
  countryCode: z.string().length(2, "Invalid country code").optional(),
});

export type UpdateProfileFormValues = z.infer<typeof UpdateProfileSchema>;
