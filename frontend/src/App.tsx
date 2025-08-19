import React, { useState } from 'react';
import './App.css';
import { useWallet } from './hooks/useWallet';
import { SupplyModal } from './components/SupplyModal';
import { BorrowModal } from './components/BorrowModal';
import { usePortfolio } from './contexts/PortfolioContext';

function App() {
  const { isConnected, address, client, isLoading, error, connectWallet, disconnectWallet } = useWallet();
  const { totalSupplied, totalBorrowed, healthFactor, assets } = usePortfolio();
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/10 border-b border-white/20">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-nibiru-400 to-nibiru-600 rounded-xl flex items-center justify-center shadow-glow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-nibiru-200 bg-clip-text text-transparent">
                  Nibiru Money Market
                </h1>
                <p className="text-nibiru-200 text-sm">Decentralized Lending & Borrowing</p>
              </div>
            </div>
            
            {isConnected && address && (
              <div className="flex items-center space-x-4 animate-slide-up">
                <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-mono">
                      {address.slice(0, 8)}...{address.slice(-6)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Error message */}
          {error && (
            <div className="mb-8 animate-slide-up">
              <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-200">Connection Error</h3>
                    <div className="mt-2 text-sm text-red-300">{error}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connect wallet section */}
          {!isConnected ? (
            <div className="text-center animate-fade-in">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-nibiru-200 to-purple-200 bg-clip-text text-transparent mb-6">
                  Welcome to the Future of DeFi
                </h2>
                <p className="text-xl text-nibiru-200 mb-12 leading-relaxed">
                  Supply assets to earn yield, borrow against your collateral, and participate in the next generation of decentralized finance on Nibiru Chain.
                </p>
                
                <div className="relative">
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="group relative px-8 py-4 bg-gradient-to-r from-nibiru-500 to-purple-600 text-white font-semibold rounded-xl shadow-glow hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center space-x-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Connect Wallet</span>
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-nibiru-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </button>
                </div>

                <div className="mt-8 flex justify-center space-x-8 text-sm text-nibiru-300">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Decentralized</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Non-custodial</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard */
            <div className="space-y-8 animate-fade-in">
              {/* Stats overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-nibiru-200 text-sm font-medium">Total Supplied</p>
                      <p className="text-2xl font-bold text-white">${totalSupplied}</p>
                      <p className="text-green-400 text-sm">
                        {parseFloat(totalSupplied) > 0 ? '+12.5% APY' : '+0.00% APY'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-nibiru-200 text-sm font-medium">Total Borrowed</p>
                      <p className="text-2xl font-bold text-white">${totalBorrowed}</p>
                      <p className="text-red-400 text-sm">
                        {parseFloat(totalBorrowed) > 0 ? '8.2% APR' : '0.00% APR'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-nibiru-200 text-sm font-medium">Health Factor</p>
                      <p className="text-2xl font-bold text-white">{healthFactor}</p>
                      <p className={`text-sm ${
                        parseFloat(healthFactor) >= 2 ? 'text-green-400' : 
                        parseFloat(healthFactor) >= 1.5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {parseFloat(healthFactor) >= 2 ? 'Healthy' : 
                         parseFloat(healthFactor) >= 1.5 ? 'Moderate' : 'At Risk'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-nibiru-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-nibiru-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Portfolio */}
              {(parseFloat(totalSupplied) > 0 || parseFloat(totalBorrowed) > 0) && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Your Portfolio</h3>
                  <div className="space-y-4">
                    {assets.filter(asset => parseFloat(asset.supplied) > 0 || parseFloat(asset.borrowed) > 0).map((asset) => (
                      <div key={asset.denom} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-nibiru-400 to-nibiru-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {asset.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{asset.symbol}</div>
                            <div className="text-sm text-white/60">{asset.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {parseFloat(asset.supplied) > 0 && (
                            <div className="text-green-400 text-sm">
                              Supplied: {asset.supplied} {asset.symbol}
                            </div>
                          )}
                          {parseFloat(asset.borrowed) > 0 && (
                            <div className="text-purple-400 text-sm">
                              Borrowed: {asset.borrowed} {asset.symbol}
                            </div>
                          )}
                          <div className="text-xs text-white/60">
                            Balance: {asset.balance} {asset.symbol}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Supply Market */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Supply Market</h3>
                      <p className="text-nibiru-200">Earn interest on your assets</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-nibiru-200">Available Assets</span>
                        <span className="text-white font-semibold">NIBI, USDC, ATOM</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-nibiru-200">Best APY</span>
                        <span className="text-green-400 font-semibold">15.3%</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsSupplyModalOpen(true)}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-400 hover:to-green-500 transform hover:scale-105 transition-all duration-200"
                  >
                    Supply Assets
                  </button>
                </div>

                {/* Borrow Market */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Borrow Market</h3>
                      <p className="text-nibiru-200">Borrow against your collateral</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-nibiru-200">Available to Borrow</span>
                        <span className="text-white font-semibold">
                          ${(parseFloat(totalSupplied) * 0.75).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-nibiru-200">Best Rate</span>
                        <span className="text-purple-400 font-semibold">8.2%</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsBorrowModalOpen(true)}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-200"
                  >
                    Borrow Assets
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Supply Modal */}
      <SupplyModal
        isOpen={isSupplyModalOpen}
        onClose={() => setIsSupplyModalOpen(false)}
        client={client}
        address={address}
      />

      {/* Borrow Modal */}
      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        client={client}
        address={address}
      />
    </div>
  );
}

export default App;
