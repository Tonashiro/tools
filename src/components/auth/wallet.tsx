import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Wallet: React.FC = () => {
  return <ConnectButton showBalance={false} chainStatus="icon" />;
};
