import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getOrCreateUser, updateUserBalance } from '../lib/database';

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  tokenBalance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateTokenBalance: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  balance: 0,
  tokenBalance: 0,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  updateTokenBalance: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  const connectWallet = async () => {
    try {
      // Check if Phantom wallet is available
      const { solana } = window as any;
      
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        const pubKey = response.publicKey.toString();
        setPublicKey(pubKey);
        setConnected(true);
        
        try {
          // Try to fetch balance using devnet (more reliable for demo)
          const connection = new Connection('https://api.devnet.solana.com');
          const publicKeyObj = new PublicKey(pubKey);
          const balanceInLamports = await connection.getBalance(publicKeyObj);
          setBalance(balanceInLamports / LAMPORTS_PER_SOL);
        } catch (balanceErr) {
          console.log('Could not fetch balance, using mock data');
          // If balance fetch fails, use mock balance
          setBalance(5.234);
        }
        
        // Get or create user in Supabase and fetch token balance
        const user = await getOrCreateUser(pubKey);
        if (user) {
          setTokenBalance(user.token_balance);
        } else {
          setTokenBalance(1000);
        }
      } else {
        // If no wallet detected, use demo mode
        const mockKey = 'Demo' + Math.random().toString(36).substring(2, 15);
        setPublicKey(mockKey);
        setConnected(true);
        setBalance(5.234);
        
        // Get or create user in Supabase
        const user = await getOrCreateUser(mockKey);
        if (user) {
          setTokenBalance(user.token_balance);
        } else {
          setTokenBalance(1000);
        }
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      // For demo purposes, create a mock connection
      const mockKey = 'Demo' + Math.random().toString(36).substring(2, 15);
      setPublicKey(mockKey);
      setConnected(true);
      setBalance(5.234);
      setTokenBalance(1000);
    }
  };

  const updateTokenBalance = async (amount: number) => {
    if (!publicKey) return;
    
    const newBalance = tokenBalance + amount;
    setTokenBalance(newBalance);
    
    // Update in Supabase
    await updateUserBalance(publicKey, newBalance);
  };

  const disconnectWallet = () => {
    setConnected(false);
    setPublicKey(null);
    setBalance(0);
    setTokenBalance(0);
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        balance,
        tokenBalance,
        connectWallet,
        disconnectWallet,
        updateTokenBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
