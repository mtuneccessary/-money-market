import { useState, useEffect, useCallback } from 'react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  client: SigningCosmWasmClient | null;
  isLoading: boolean;
  error: string | null;
}

const NIBIRU_TESTNET = {
  chainId: 'nibiru-testnet-2',
  chainName: 'Nibiru Testnet 2',
  rpc: 'https://rpc.testnet-2.nibiru.fi',
  rest: 'https://lcd.testnet-2.nibiru.fi',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'nibi',
    bech32PrefixAccPub: 'nibipub',
    bech32PrefixValAddr: 'nibivaloper',
    bech32PrefixValPub: 'nibivaloperpub',
    bech32PrefixConsAddr: 'nibivalcons',
    bech32PrefixConsPub: 'nibivalconspub',
  },
  currencies: [
    {
      coinDenom: 'NIBI',
      coinMinimalDenom: 'unibi',
      coinDecimals: 6,
      coinGeckoId: 'nibiru',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'NIBI',
      coinMinimalDenom: 'unibi',
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: 'NIBI',
    coinMinimalDenom: 'unibi',
    coinDecimals: 6,
  },
  features: ['stargate', 'ibc-transfer', 'cosmwasm', 'no-legacy-stdTx'],
  chainSymbolImageUrl: 'https://raw.githubusercontent.com/NibiruChain/Networks/main/nibiru-logo.png',
  chainSymbol: 'NIBI',
  chainToMainnet: false,
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    client: null,
    isLoading: false,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    if (!window.keplr) {
      setWalletState(prev => ({
        ...prev,
        error: 'Keplr wallet not found. Please install Keplr extension.',
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // First, try to suggest the chain
      try {
        await window.keplr.experimentalSuggestChain(NIBIRU_TESTNET);
        console.log('Chain suggested successfully');
      } catch (suggestError) {
        console.warn('Chain suggestion failed:', suggestError);
      }

      // Then enable the chain
      await window.keplr.enable(NIBIRU_TESTNET.chainId);
      console.log('Chain enabled successfully');

      // Get offline signer
      const offlineSigner: OfflineSigner = window.keplr.getOfflineSigner(NIBIRU_TESTNET.chainId);

      // Get accounts
      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;
      console.log('Got account address:', address);

      // Create signing client
      const client = await SigningCosmWasmClient.connectWithSigner(
        NIBIRU_TESTNET.rpc,
        offlineSigner,
        { gasPrice: GasPrice.fromString('0.025unibi') }
      );
      console.log('Client connected successfully');

      setWalletState({
        isConnected: true,
        address,
        client,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error
          ? error.message
          : 'Failed to connect wallet. Please try again.',
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      client: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.keplr) {
        try {
          const key = await window.keplr.getKey(NIBIRU_TESTNET.chainId);
          if (key) {
            await connectWallet();
          }
        } catch (error) {
          console.debug('No previous wallet connection found');
        }
      }
    };

    checkConnection();
  }, [connectWallet]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
};

declare global {
  interface Window {
    keplr?: any;
  }
} 