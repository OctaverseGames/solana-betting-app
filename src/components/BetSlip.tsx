import { useState, useEffect } from 'react';
import { useWallet } from './WalletProvider';
import { X, TrendingUp, AlertCircle } from 'lucide-react';
import { Bet } from './BettingApp';

interface BetSlipProps {
  bets: Bet[];
  onRemoveBet: (betId: string) => void;
  onPlaceBets: (bets: Bet[], amounts: { [key: string]: number }) => void;
}

export function BetSlip({ bets, onRemoveBet, onPlaceBets }: BetSlipProps) {
  const { tokenBalance } = useWallet();
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    // Initialize amounts for new bets
    const newAmounts: { [key: string]: number } = { ...amounts };
    bets.forEach(bet => {
      if (!(bet.id in newAmounts)) {
        newAmounts[bet.id] = 10;
      }
    });
    setAmounts(newAmounts);
  }, [bets]);

  const updateAmount = (betId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAmounts({ ...amounts, [betId]: numValue });
  };

  const totalStake = bets.reduce((sum, bet) => sum + (amounts[bet.id] || 0), 0);
  const potentialWin = bets.reduce((sum, bet) => sum + (amounts[bet.id] || 0) * bet.odds, 0);

  const handlePlaceBets = async () => {
    if (totalStake > tokenBalance) {
      alert('Insufficient balance!');
      return;
    }

    if (totalStake === 0) {
      alert('Please enter bet amounts!');
      return;
    }

    setIsPlacing(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPlaceBets(bets, amounts);
    setAmounts({});
    setIsPlacing(false);
  };

  if (bets.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 sticky top-6">
        <h2 className="text-white mb-4">Bet Slip</h2>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-white/30 mx-auto mb-3" />
          <p className="text-white/50">Select odds to add to bet slip</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white">Bet Slip</h2>
        <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
          {bets.length}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {bets.map((bet) => (
          <div key={bet.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-white text-sm">{bet.match}</p>
                <p className="text-purple-400 text-sm">{bet.team}</p>
              </div>
              <button
                onClick={() => onRemoveBet(bet.id)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amounts[bet.id] || ''}
                onChange={(e) => updateAmount(bet.id, e.target.value)}
                placeholder="Amount"
                className="flex-1 bg-white/10 text-white px-3 py-2 rounded border border-white/20 focus:border-purple-500 focus:outline-none"
                min="0"
                step="10"
              />
              <div className="bg-purple-600 text-white px-3 py-2 rounded">
                @{bet.odds.toFixed(2)}
              </div>
            </div>

            {amounts[bet.id] > 0 && (
              <p className="text-green-400 text-sm mt-2">
                Win: {(amounts[bet.id] * bet.odds).toFixed(2)} BET
              </p>
            )}
          </div>
        ))}
      </div>

      {totalStake > tokenBalance && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm">Insufficient balance</p>
        </div>
      )}

      <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between text-white/70 text-sm">
          <span>Total Stake</span>
          <span>{totalStake.toFixed(2)} BET</span>
        </div>
        <div className="flex justify-between text-white">
          <span>Potential Win</span>
          <span className="text-green-400">{potentialWin.toFixed(2)} BET</span>
        </div>
      </div>

      <button
        onClick={handlePlaceBets}
        disabled={isPlacing || totalStake > tokenBalance || totalStake === 0}
        className={`w-full py-3 rounded-lg transition-all ${
          isPlacing || totalStake > tokenBalance || totalStake === 0
            ? 'bg-white/10 text-white/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
        }`}
      >
        {isPlacing ? 'Placing Bets...' : 'Place Bets'}
      </button>
    </div>
  );
}
