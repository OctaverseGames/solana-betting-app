import { useWallet } from './WalletProvider';
import { Wallet, TrendingUp, LogOut } from 'lucide-react';

export function Header() {
  const { publicKey, balance, tokenBalance, disconnectWallet } = useWallet();

  return (
    <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">SolBet</h1>
              <p className="text-white/60 text-sm">Sports Betting on Solana</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 bg-white/10 rounded-lg px-4 py-2">
              <div className="text-right">
                <p className="text-white/60 text-sm">SOL Balance</p>
                <p className="text-white">{balance.toFixed(3)} SOL</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-right">
                <p className="text-white/60 text-sm">BET Tokens</p>
                <p className="text-white">{tokenBalance.toFixed(0)} BET</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Wallet className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm hidden md:inline">
                {publicKey?.substring(0, 4)}...{publicKey?.substring(publicKey.length - 4)}
              </span>
              <button
                onClick={disconnectWallet}
                className="text-white/60 hover:text-white transition-colors ml-2"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
