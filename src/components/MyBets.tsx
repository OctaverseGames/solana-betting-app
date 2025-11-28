import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { PlacedBet } from './BettingApp';

interface MyBetsProps {
  bets: PlacedBet[];
  loading?: boolean;
}

export function MyBets({ bets, loading }: MyBetsProps) {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
        <Loader className="w-16 h-16 text-white/30 mx-auto mb-4 animate-spin" />
        <p className="text-white/60">Loading your bets...</p>
      </div>
    );
  }

  if (bets.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
        <Clock className="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h3 className="text-white mb-2">No Bets Yet</h3>
        <p className="text-white/60">Your placed bets will appear here</p>
      </div>
    );
  }

  const pendingBets = bets.filter(b => b.status === 'pending');
  const settledBets = bets.filter(b => b.status !== 'pending');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'lost':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'lost':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  return (
    <div className="space-y-4">
      {pendingBets.length > 0 && (
        <div>
          <h3 className="text-white mb-3">Active Bets</h3>
          <div className="space-y-3">
            {pendingBets.map((bet) => (
              <div
                key={bet.id + bet.timestamp}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-white/70 text-sm mb-1">{bet.sport} • {bet.match}</p>
                    <p className="text-white">{bet.team}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${getStatusColor(bet.status)}`}>
                    {getStatusIcon(bet.status)}
                    <span className="capitalize">{bet.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Stake</p>
                    <p className="text-white">{bet.amount.toFixed(2)} BET</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Odds</p>
                    <p className="text-white">{bet.odds.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">To Win</p>
                    <p className="text-green-400">{bet.potentialWin.toFixed(2)} BET</p>
                  </div>
                </div>

                <p className="text-white/50 text-sm mt-2">
                  Placed {new Date(bet.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {settledBets.length > 0 && (
        <div>
          <h3 className="text-white mb-3">Bet History</h3>
          <div className="space-y-3">
            {settledBets.map((bet) => (
              <div
                key={bet.id + bet.timestamp}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10 opacity-75"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-white/70 text-sm mb-1">{bet.sport} • {bet.match}</p>
                    <p className="text-white">{bet.team}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${getStatusColor(bet.status)}`}>
                    {getStatusIcon(bet.status)}
                    <span className="capitalize">{bet.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Stake</p>
                    <p className="text-white">{bet.amount.toFixed(2)} BET</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Odds</p>
                    <p className="text-white">{bet.odds.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">
                      {bet.status === 'won' ? 'Won' : 'Lost'}
                    </p>
                    <p className={bet.status === 'won' ? 'text-green-400' : 'text-red-400'}>
                      {bet.status === 'won' ? '+' : '-'}{bet.amount.toFixed(2)} BET
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
