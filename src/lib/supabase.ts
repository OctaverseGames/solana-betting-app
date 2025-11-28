import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://naqltgglfacmwabyarfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcWx0Z2dsZmFjbXdhYnlhcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzk2NDQsImV4cCI6MjA3OTgxNTY0NH0.eUMpZYe5JmuUX1xwMCItnqqgQynF7n0YiyCM-l9xBEc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbUser {
  id: string;
  wallet_address: string;
  token_balance: number;
  created_at: string;
  updated_at: string;
}

export interface DbBet {
  id: string;
  user_id: string;
  wallet_address: string;
  match_id: string;
  team: string;
  odds: number;
  amount: number;
  sport: string;
  match: string;
  type: 'home' | 'away' | 'draw';
  status: 'pending' | 'won' | 'lost';
  potential_win: number;
  created_at: string;
}
