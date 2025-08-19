import React, { useState } from 'react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { usePortfolio } from '../contexts/PortfolioContext';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: SigningCosmWasmClient | null;
  address: string | null;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  client,
  address
}) => {
  const { assets, borrowAsset, totalSupplied } = usePortfolio();
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calculate borrowing power (simplified: 75% of supplied value)
  const borrowingPower = (parseFloat(totalSupplied) * 0.75).toFixed(2);
  const availableToBorrow = parseFloat(borrowingPower);

  const handleBorrow = async () => {
    if (!selectedAsset || !amount || !client || !address) {
      setError('Please select an asset and enter an amount');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (parseFloat(totalSupplied) === 0) {
      setError('You need to supply assets first before borrowing');
      return;
    }

    if (parseFloat(amount) > availableToBorrow) {
      setError(`You can only borrow up to $${borrowingPower} based on your collateral`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // For testing purposes, we'll simulate a borrow transaction
      // In a real implementation, you would call the smart contract here
      
      // Simulate contract interaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the portfolio state with the borrowed amount
      borrowAsset(selectedAsset.denom, amount);
      
      // Mock successful transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      setSuccess(`Successfully borrowed ${amount} ${selectedAsset.symbol}! Transaction: ${mockTxHash.slice(0, 10)}...`);
      
      // Reset form after successful transaction
      setTimeout(() => {
        setAmount('');
        setSelectedAsset(null);
        setSuccess(null);
        onClose();
      }, 3000);
      
    } catch (err: any) {
      console.error('Borrow failed:', err);
      setError(err.message || 'Failed to borrow assets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    if (availableToBorrow > 0) {
      setAmount(Math.min(availableToBorrow, 1000).toFixed(1)); // Cap at 1000 for demo
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md transform rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Borrow Assets</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Borrowing Power Info */}
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80 text-sm">Borrowing Power</span>
              <span className="text-purple-300 font-semibold">${borrowingPower}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Collateral Value</span>
              <span className="text-white/60 text-sm">${totalSupplied}</span>
            </div>
            <div className="mt-2 text-xs text-white/50">
              You can borrow up to 75% of your supplied collateral value
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-sm">{success}</p>
            </div>
          )}

          {/* Asset Selection */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Select Asset to Borrow
            </label>
            <div className="space-y-2">
              {assets.map((asset) => (
                <button
                  key={asset.denom}
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    selectedAsset?.denom === asset.denom
                      ? 'bg-purple-500/20 border-purple-400/50 text-white'
                      : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {asset.symbol.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{asset.symbol}</div>
                        <div className="text-xs opacity-60">{asset.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 text-sm font-semibold">8.2% APR</div>
                      <div className="text-xs opacity-60">
                        Borrowed: {asset.borrowed || '0.0'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          {selectedAsset && (
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Amount to Borrow
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
                <button
                  onClick={handleMaxClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded hover:bg-purple-500/30 transition-colors"
                >
                  MAX
                </button>
              </div>
              {selectedAsset && amount && (
                <div className="mt-2 text-sm text-white/60">
                  Max borrowable: ${borrowingPower} (75% of collateral)
                </div>
              )}
            </div>
          )}

          {/* Borrow Button */}
          <button
            onClick={handleBorrow}
            disabled={!selectedAsset || !amount || isLoading || !client || parseFloat(totalSupplied) === 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Borrowing...</span>
              </div>
            ) : parseFloat(totalSupplied) === 0 ? (
              'Supply Collateral First'
            ) : (
              `Borrow ${selectedAsset ? selectedAsset.symbol : 'Asset'}`
            )}
          </button>

          {/* Info */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-xs">
              💡 You need to supply assets as collateral before borrowing. Borrowed assets will be added to your wallet balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 