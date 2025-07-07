"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider as WagmiProviderBase, createStorage } from "wagmi";
import { monadTestnet } from "wagmi/chains";

const isClient = typeof window !== "undefined";

const wagmiConfig = getDefaultConfig({
  appName: "Nadtools",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [monadTestnet],
  storage: createStorage({
    storage: isClient ? window.localStorage : undefined,
  }),
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#7b3fe4",
          accentColorForeground: "white",
          borderRadius: "large",
        })}
        locale="en-US"
        initialChain={monadTestnet}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProviderBase>
  );
}
