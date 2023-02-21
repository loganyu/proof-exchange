import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import {Provider as StyletronProvider} from 'styletron-react';
import {DarkTheme, BaseProvider, styled} from 'baseui';
import {styletron} from '../styletron';
import '../styles.css'
import WalletContextProvider from '../components/WalletContextProvider'

const App = ({ Component, pageProps }: AppProps<{session: Session;}>) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can provide a custom RPC endpoint here
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter()
    ],
    [network]
  );

  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={DarkTheme}>
        <SessionProvider session={pageProps.session}>
          <WalletContextProvider>
            <Component {...pageProps} />
          </WalletContextProvider>
        </SessionProvider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
