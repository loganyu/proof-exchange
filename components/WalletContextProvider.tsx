import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import * as web3 from '@solana/web3.js'
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => web3.clusterApiUrl(network), [network]);
	const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
			new walletAdapterWallets.PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

	return (
		<ConnectionProvider endpoint={endpoint}>
		    <WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
	    		    { children }
        		</WalletModalProvider>
      		</WalletProvider>
    	</ConnectionProvider>
	)
}

export default WalletContextProvider