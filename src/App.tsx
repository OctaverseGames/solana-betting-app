import { WalletProvider } from './components/WalletProvider';
import { BettingApp } from './components/BettingApp';

export default function App() {
  return (
    <WalletProvider>
      <BettingApp />
    </WalletProvider>
  );
}
