import { supabase, DbUser, DbBet } from './supabase';

// Check if tables exist by attempting a simple query
let tablesExist = true;

// User operations
export async function getOrCreateUser(walletAddress: string): Promise<DbUser | null> {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError && fetchError.code === 'PGRST205') {
      // Table doesn't exist
      tablesExist = false;
      console.warn('⚠️ Database tables not set up. Please run the SQL setup from DATABASE_SETUP.md');
      return null;
    }

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          wallet_address: walletAddress,
          token_balance: 1000, // Starting balance
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return null;
    }

    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

export async function updateUserBalance(walletAddress: string, newBalance: number): Promise<boolean> {
  if (!tablesExist) return false;
  
  try {
    const { error } = await supabase
      .from('users')
      .update({ token_balance: newBalance, updated_at: new Date().toISOString() })
      .eq('wallet_address', walletAddress);

    return !error;
  } catch (error) {
    console.error('Error updating balance:', error);
    return false;
  }
}

// Bet operations
export async function placeBet(bet: Omit<DbBet, 'id' | 'created_at'>): Promise<DbBet | null> {
  if (!tablesExist) {
    console.warn('⚠️ Cannot save bet - database not set up');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('bets')
      .insert([bet])
      .select()
      .single();

    if (error) {
      console.error('Error placing bet:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in placeBet:', error);
    return null;
  }
}

export async function getUserBets(walletAddress: string): Promise<DbBet[]> {
  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') {
        tablesExist = false;
        console.warn('⚠️ Database tables not set up. Please run the SQL setup from DATABASE_SETUP.md');
      } else {
        console.error('Error fetching bets:', error);
      }
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserBets:', error);
    return [];
  }
}

export async function updateBetStatus(betId: string, status: 'won' | 'lost'): Promise<boolean> {
  if (!tablesExist) return false;
  
  try {
    const { error } = await supabase
      .from('bets')
      .update({ status })
      .eq('id', betId);

    return !error;
  } catch (error) {
    console.error('Error updating bet status:', error);
    return false;
  }
}

export async function getAllPendingBets(): Promise<DbBet[]> {
  if (!tablesExist) return [];
  
  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending bets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPendingBets:', error);
    return [];
  }
}

// Check if database is properly set up
export async function checkDatabaseSetup(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST205') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}
