// Nibiru Money Market - Contract Addresses
// Deployed on Nibiru Testnet-2

export const CONTRACTS = {
  // Network Configuration
  chainId: 'nibiru-testnet-2',
  rpcUrl: 'https://rpc.testnet-2.nibiru.fi:443',
  restUrl: 'https://lcd.testnet-2.nibiru.fi',
  
  // Contract Addresses (Mock for demonstration)
  comptroller: 'nibi14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s4hmalr',
  markets: {
    unibi: 'nibi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq68ev2p',
    usdc: 'nibi1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftqynf7kp',
    atom: 'nibi1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gq7dqkky'
  },
  
  // Asset Configuration
  assets: [
    {
      denom: 'unibi',
      symbol: 'NIBI',
      name: 'Nibiru',
      decimals: 6,
      marketAddress: 'nibi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq68ev2p'
    },
    {
      denom: 'usdc',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      marketAddress: 'nibi1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftqynf7kp'
    },
    {
      denom: 'atom',
      symbol: 'ATOM',
      name: 'Cosmos Hub',
      decimals: 6,
      marketAddress: 'nibi1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gq7dqkky'
    }
  ]
};

export const GAS_SETTINGS = {
  gasPrice: '0.025unibi',
  gasAdjustment: 1.3,
  gas: 'auto'
}; 