"use client"
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mantle, mantleSepoliaTestnet} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactNode } from 'react';
import ThemeProvider from '@/components/theme-provider';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

const wagmiConfig = getDefaultConfig({
    appName: 'Agentic Screener',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    chains: [mantle, mantleSepoliaTestnet],
    ssr: true,
});


const WagmiWrapper = ({ children }: {children : ReactNode}) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider coolMode>
                        <Navbar />
                        <div className='px-32'>
                            {children}
                        </div>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ThemeProvider>
    );
};

export default WagmiWrapper;