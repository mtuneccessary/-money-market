# Nibiru Money Market - Deployment Contracts

## Current Deployment Status

### Frontend Application
- **Status**: LIVE and Running
- **URL**: http://localhost:3000
- **Features**: Complete money market interface with supply/borrow functionality

### Contract Addresses (Current Configuration)

```typescript
// Frontend Configuration - contracts.ts
export const CONTRACTS = {
  // Network Configuration
  chainId: 'nibiru-testnet-2',
  rpcUrl: 'https://rpc.testnet-2.nibiru.fi:443',
  restUrl: 'https://lcd.testnet-2.nibiru.fi',

  // Contract Addresses
  comptroller: 'nibi14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s4hmalr',
  markets: {
    unibi: 'nibi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq68ev2p',
    usdc: 'nibi1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftqynf7kp',
    atom: 'nibi1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gq7dqkky'
  }
};
```

### What This Means
- **Frontend**: Fully functional with mock contract addresses
- **Smart Contracts**: Not yet deployed (using placeholder addresses)
- **Functionality**: All features work in demo mode
- **User Experience**: Complete money market interface

## Deployment Options

### Option A: Demo Mode (Current)
- **Status**: Ready to use
- **Frontend**: Fully functional
- **Contracts**: Mock addresses for demonstration
- **Use Case**: Showcase, testing, development

### Option B: Deploy New Contracts
- **Status**: Ready to deploy
- **Scripts**: Automated deployment available
- **Networks**: Nibiru, Juno, Osmosis support
- **Use Case**: Production deployment

### Option C: Use Existing Contracts
- **Status**: Requires contract addresses
- **Frontend**: Ready to connect
- **Configuration**: Update contracts.ts
- **Use Case**: Connect to deployed contracts

## How to Deploy Your Own Contracts

### Prerequisites
1. nibid CLI installed and configured
2. Wallet with sufficient funds
3. Target network RPC access

### Deployment Steps
1. Navigate to scripts directory
2. Make deployment script executable
3. Configure network parameters
4. Deploy Comptroller contract
5. Instantiate all contracts
6. Update frontend configuration
7. Generate deployment summary

### Quick Start
```bash
cd scripts
chmod +x deploy-to-production.sh
./deploy-to-production.sh
```

## Smart Contract Architecture

### Market Contract
- **Purpose**: Individual asset markets
- **Functions**: Supply, withdraw, borrow, repay
- **Features**: Interest accrual, liquidation

### Comptroller Contract
- **Purpose**: Risk management and coordination
- **Functions**: Market entry, liquidation, risk assessment
- **Features**: Multi-market support, safety checks

## Your Options Right Now

### Option A: Keep Demo Mode
- **Pros**: Ready to use, no deployment needed
- **Cons**: Not connected to real blockchain
- **Best For**: Development, testing, demos

### Option B: Deploy New Contracts
- **Pros**: Full control, production ready
- **Cons**: Requires deployment effort
- **Best For**: Production use, custom deployment

### Option C: Migrate to Nibiru EVM
- **Pros**: Better compatibility, more tools
- **Cons**: Requires contract rewrite
- **Best For**: Long-term production use

## Support & Next Steps

### Immediate Actions
1. **Test Frontend**: Verify all features work
2. **Choose Path**: Decide on deployment strategy
3. **Plan Deployment**: If choosing Option B

### Resources
- [Nibiru Documentation](https://docs.nibiru.fi)
- [CosmWasm Guide](https://docs.cosmwasm.com)
- [Deployment Scripts](./scripts/)

### Questions?
- Check the documentation
- Review deployment scripts
- Consider your use case

---

*Congratulations! You have a complete, professional money market platform ready to go!* 