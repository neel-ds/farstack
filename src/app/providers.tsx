"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { useSetAtom } from "jotai";
import { degenPrice } from "@/store";
import { useEffect } from "react";

const config = getDefaultConfig({
  appName: "Degenask",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [base],
  ssr: true,
});

export default function Providers({
  children,
  degenPriceUsd,
}: {
  children: React.ReactNode;
  degenPriceUsd: number;
}) {
  const queryClient = new QueryClient();
  const setDegenPrice = useSetAtom(degenPrice);
  useEffect(() => {
    setDegenPrice(degenPriceUsd);
  }, [degenPriceUsd]);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
              appearance: {
                theme: "light",
                accentColor: "#4C2897",
                logo: "/degenask.png",
              },
              defaultChain: base,
              loginMethods: ["farcaster"],
              embeddedWallets: {
                createOnLogin: "all-users",
              },
            }}
          >
            {children}
          </PrivyProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
