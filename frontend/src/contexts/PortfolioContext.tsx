import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Asset {
  denom: string;
  symbol: string;
  name: string;
  decimals: number;
  apy: string;
  balance: string;
  supplied: string;
  borrowed: string;
}

interface PortfolioContextType {
  assets: Asset[];
  totalSupplied: string;
  totalBorrowed: string;
  healthFactor: string;
  supplyAsset: (denom: string, amount: string) => void;
  withdrawAsset: (denom: string, amount: string) => void;
  borrowAsset: (denom: string, amount: string) => void;
  repayAsset: (denom: string, amount: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const INITIAL_ASSETS: Asset[] = [
  {
    denom: 'unibi',
    symbol: 'NIBI',
    name: 'Nibiru',
    decimals: 6,
    apy: '12.5%',
    balance: '1000.0',
    supplied: '0.0',
    borrowed: '0.0'
  },
  {
    denom: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    apy: '8.2%',
    balance: '500.0',
    supplied: '0.0',
    borrowed: '0.0'
  },
  {
    denom: 'atom',
    symbol: 'ATOM',
    name: 'Cosmos Hub',
    decimals: 6,
    apy: '15.3%',
    balance: '25.0',
    supplied: '0.0',
    borrowed: '0.0'
  }
];

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);

  const supplyAsset = (denom: string, amount: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        if (asset.denom === denom) {
          const supplyAmount = parseFloat(amount);
          const currentBalance = parseFloat(asset.balance);
          const currentSupplied = parseFloat(asset.supplied);
          
          if (supplyAmount <= currentBalance) {
            return {
              ...asset,
              balance: (currentBalance - supplyAmount).toFixed(1),
              supplied: (currentSupplied + supplyAmount).toFixed(1)
            };
          }
        }
        return asset;
      })
    );
  };

  const withdrawAsset = (denom: string, amount: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        if (asset.denom === denom) {
          const withdrawAmount = parseFloat(amount);
          const currentBalance = parseFloat(asset.balance);
          const currentSupplied = parseFloat(asset.supplied);
          
          if (withdrawAmount <= currentSupplied) {
            return {
              ...asset,
              balance: (currentBalance + withdrawAmount).toFixed(1),
              supplied: (currentSupplied - withdrawAmount).toFixed(1)
            };
          }
        }
        return asset;
      })
    );
  };

  const borrowAsset = (denom: string, amount: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        if (asset.denom === denom) {
          const borrowAmount = parseFloat(amount);
          const currentBalance = parseFloat(asset.balance);
          const currentBorrowed = parseFloat(asset.borrowed);
          
          return {
            ...asset,
            balance: (currentBalance + borrowAmount).toFixed(1), // Add borrowed amount to balance
            borrowed: (currentBorrowed + borrowAmount).toFixed(1)
          };
        }
        return asset;
      })
    );
  };

  const repayAsset = (denom: string, amount: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        if (asset.denom === denom) {
          const repayAmount = parseFloat(amount);
          const currentBalance = parseFloat(asset.balance);
          const currentBorrowed = parseFloat(asset.borrowed);
          
          if (repayAmount <= currentBorrowed && repayAmount <= currentBalance) {
            return {
              ...asset,
              balance: (currentBalance - repayAmount).toFixed(1), // Remove from balance
              borrowed: (currentBorrowed - repayAmount).toFixed(1)
            };
          }
        }
        return asset;
      })
    );
  };

  // Calculate total supplied value (simplified - assuming 1:1 USD for demo)
  const totalSupplied = assets.reduce((total, asset) => {
    return total + parseFloat(asset.supplied);
  }, 0).toFixed(2);

  // Calculate total borrowed value
  const totalBorrowed = assets.reduce((total, asset) => {
    return total + parseFloat(asset.borrowed);
  }, 0).toFixed(2);

  // Calculate health factor (simplified: collateral / borrowed, with safety buffer)
  const healthFactor = parseFloat(totalBorrowed) === 0 ? '∞' : 
    (parseFloat(totalSupplied) / parseFloat(totalBorrowed)).toFixed(2);

  const value: PortfolioContextType = {
    assets,
    totalSupplied,
    totalBorrowed,
    healthFactor,
    supplyAsset,
    withdrawAsset,
    borrowAsset,
    repayAsset
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}; 