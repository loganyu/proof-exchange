import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { Block } from 'baseui/block';
import { Session } from "next-auth";
import {Provider as StyletronProvider} from 'styletron-react';
import {styletron} from '../styletron';
import '../styles.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { SessionProvider } from "next-auth/react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import type { AppProps } from "next/app";

require("@solana/wallet-adapter-react-ui/styles.css");

// baseweb
import {
  createThemedStyled,
  createThemedUseStyletron,
  styled,
  createThemedWithStyle,
  BaseProvider,
  DarkTheme,
  DarkThemeMove,
  LightTheme,
  LightThemeMove,
} from 'baseui';
import type { Breakpoints, Theme } from 'baseui/styles/types';

const breakpoints: Breakpoints = {
  small: 670,
  medium: 920,
  large: 1280,
};

const ResponsiveTheme = Object.keys(breakpoints).reduce(
  (acc, key) => {
    acc.mediaQuery[key] = `@media screen and (min-width: ${breakpoints[key]}px)`;
    return acc;
  },
  {
    breakpoints,
    mediaQuery: {},
  }
);

const themes = {
  LightTheme: { ...LightTheme, ...ResponsiveTheme },
  LightThemeMove: { ...LightThemeMove, ...ResponsiveTheme },
  DarkTheme: { ...DarkTheme, ...ResponsiveTheme },
  DarkThemeMove: { ...DarkThemeMove, ...ResponsiveTheme },
};

export const themedStyled = createThemedStyled<Theme>();
export const themedWithStyle = createThemedWithStyle<Theme>();
export const themedUseStyletron = createThemedUseStyletron<Theme>();

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const LIGHT_MEDIA_QUERY = '(prefers-color-scheme: light)';

const blockProps = {
  color: 'contentPrimary',
  backgroundColor: 'backgroundPrimary',
  maxWidth: '100vw',
  minHeight: '100vh',
  overflow: 'hidden',
};

const App = ({ Component, pageProps }: AppProps<{session: Session;}>) => {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={DarkTheme}>
        <Block overrides={{Block: {style: blockProps}}}>
          <SessionProvider session={pageProps.session}>
            <WalletContextProvider>
              <SessionProvider session={pageProps.session} refetchInterval={0}>
                <Component {...pageProps} />
              </SessionProvider>
            </WalletContextProvider>
          </SessionProvider>
        </Block>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
