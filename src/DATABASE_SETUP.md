# Supabase Database Setup - REQUIRED

⚠️ **Your app is showing errors because the database tables haven't been created yet.**

Follow these steps to fix the errors:

## Step 1: Go to SQL Editor

1. Open your Supabase dashboard: https://supabase.com/dashboard/project/naqltgglfacmwabyarfu
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

## Step 2: Run This SQL (Copy & Paste Everything Below)

Copy and paste the following SQL code and click "Run":

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  token_balance DECIMAL DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bets table
CREATE TABLE IF NOT EXISTS bets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  match_id TEXT NOT NULL,
  team TEXT NOT NULL,
  odds DECIMAL NOT NULL,
  amount DECIMAL NOT NULL,
  sport TEXT NOT NULL,
  match TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('home', 'away', 'draw')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost')),
  potential_win DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_bets_wallet ON bets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
CREATE INDEX IF NOT EXISTS idx_bets_created ON bets(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for demo purposes)
-- In production, you'd want stricter policies
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on bets" ON bets FOR ALL USING (true);
```

## Step 3: Verify Tables

After running the SQL:
1. Click on "Table Editor" in the left sidebar
2. You should see two new tables: `users` and `bets`

## Step 4: Add The Odds API Key (Optional)

To get real sports data:
1. Sign up at https://the-odds-api.com/
2. Get your free API key (500 requests/month)
3. Open `/lib/odds-api.ts` in the code
4. Replace `'YOUR_API_KEY_HERE'` with your actual API key

## Done!

Your app is now connected to Supabase and will:
- ✅ Store user profiles and token balances
- ✅ Persist all placed bets
- ✅ Load betting history on wallet connect
- ✅ Sync data across sessions
- ✅ (Optional) Fetch real sports odds when API key is added
