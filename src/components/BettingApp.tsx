import { useState, useEffect } from 'react';
import { useWallet } from './WalletProvider';
import { Header } from './Header';
import { BettingMarkets } from './BettingMarkets';
import { BetSlip } from './BetSlip';
import { MyBets } from './MyBets';
import { Wallet, AlertCircle } from 'lucide-react';
import { getUserBets, placeBet as saveBet, checkDatabaseSetup } from '../lib/database';
import { DbBet } from '../lib/supabase';

export interface Bet {
  id: string;
  team: string;
  odds: number;
  amount: number;
  sport: string;
  match: string;
  type: 'home' | 'away' | 'draw';
}

export interface PlacedBet extends Bet {
  timestamp: number;
  status: 'pending' | 'won' | 'lost';
  potentialWin: number;
  dbId?: string;
}

export function BettingApp() {
  const { connected, connectWallet, publicKey, updateTokenBalance, tokenBalance } = useWallet();
  const [selectedBets, setSelectedBets] = useState<Bet[]>([]);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [activeTab, setActiveTab] = useState<'markets' | 'mybets'>('markets');
  const [loading, setLoading] = useState(false);
  const [dbSetup, setDbSetup] = useState(true);
  const [localTokenBalance, setLocalTokenBalance] = useState(tokenBalance);

  // Sync token balance
  useEffect(() => {
    setLocalTokenBalance(tokenBalance);
  }, [tokenBalance]);

  // Check database setup
  useEffect(() => {
    checkDatabase();
  }, []);

  // Load user's bets from Supabase when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      loadUserBets();
    }
  }, [connected, publicKey]);

  const checkDatabase = async () => {
    const isSetup = await checkDatabaseSetup();
    setDbSetup(isSetup);
  };

  const loadUserBets = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    const dbBets = await getUserBets(publicKey);
    
    const convertedBets: PlacedBet[] = dbBets.map((dbBet: DbBet) => ({
      id: dbBet.match_id,
      team: dbBet.team,
      odds: dbBet.odds,
      amount: dbBet.amount,
      sport: dbBet.sport,
      match: dbBet.match,
      type: dbBet.type,
      timestamp: new Date(dbBet.created_at).getTime(),
      status: dbBet.status,
      potentialWin: dbBet.potential_win,
      dbId: dbBet.id,
    }));
    
    setPlacedBets(convertedBets);
    setLoading(false);
  };

  const addBet = (bet: Bet) => {
    const exists = selectedBets.find(b => b.id === bet.id);
    if (exists) {
      setSelectedBets(selectedBets.filter(b => b.id !== bet.id));
    } else {
      setSelectedBets([...selectedBets, bet]);
    }
  };

  const removeBet = (betId: string) => {
    setSelectedBets(selectedBets.filter(b => b.id !== betId));
  };

  const placeBets = async (bets: Bet[], amounts: { [key: string]: number }) => {
    if (!publicKey) return;

    const totalStake = bets.reduce((sum, bet) => sum + (amounts[bet.id] || 0), 0);
    
    const newPlacedBets: PlacedBet[] = [];
    
    for (const bet of bets) {
      const amount = amounts[bet.id] || 0;
      const potentialWin = amount * bet.odds;
      
      // Try to save to Supabase
      const dbBet = await saveBet({
        user_id: publicKey,
        wallet_address: publicKey,
        match_id: bet.id,
        team: bet.team,
        odds: bet.odds,
        amount,
        sport: bet.sport,
        match: bet.match,
        type: bet.type,
        status: 'pending',
        potential_win: potentialWin,
      });

      // Create placed bet (with or without DB)
      newPlacedBets.push({
        ...bet,
        amount,
        timestamp: dbBet ? new Date(dbBet.created_at).getTime() : Date.now(),
        status: 'pending',
        potentialWin,
        dbId: dbBet?.id,
      });
    }
    
    // Update token balance
    if (dbSetup) {
      await updateTokenBalance(-totalStake);
    } else {
      // Update locally if DB not set up
      setLocalTokenBalance(prev => prev - totalStake);
    }
    
    setPlacedBets([...newPlacedBets, ...placedBets]);
    setSelectedBets([]);
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-4">Welcome to SolBet</h1>
          <p className="text-white/80 mb-8">
            Connect your Solana wallet to start betting on your favorite sports with crypto tokens
          </p>
          <button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {!dbSetup && (
          <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-400 mb-2">
                <strong>Database Not Set Up:</strong> Your bets won't be saved permanently.
              </p>
              <p className="text-orange-300 text-sm">
                To enable data persistence, please set up your Supabase tables. Instructions are in the{' '}
                <code className="bg-black/30 px-1 rounded">DATABASE_SETUP.md</code> file.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('markets')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'markets'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveTab('mybets')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'mybets'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            My Bets {placedBets.length > 0 && `(${placedBets.length})`}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'markets' ? (
              <BettingMarkets onAddBet={addBet} selectedBets={selectedBets} />
            ) : (
              <MyBets bets={placedBets} loading={loading} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <BetSlip
              bets={selectedBets}
              onRemoveBet={removeBet}
              onPlaceBets={placeBets}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
