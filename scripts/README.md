# Scripts Directory

This directory contains deployment and utility scripts for the Nibiru Money Market project.

## Files

### `deploy-to-production.sh`
**Production-ready deployment script** for deploying smart contracts to any CosmWasm-compatible chain.

**Features:**
- Automatic contract compilation and optimization
- Balance checking and validation
- Contract deployment and instantiation
- Frontend configuration generation
- Multi-network support

**Usage:**
```bash
# Deploy to Nibiru Testnet
./deploy-to-production.sh

# Deploy to other networks
CHAIN_ID="uni-6" RPC_URL="https://rpc.uni.junonetwork.io:443" ./deploy-to-production.sh
```

### `deployment-config.json`
**Network configuration file** containing settings for multiple blockchain networks.

**Supported Networks:**
- Nibiru Testnet-2
- Nibiru Mainnet
- Juno Testnet
- Osmosis Testnet

**Configuration Options:**
- Chain ID and RPC endpoints
- Gas prices and adjustments
- Asset configurations
- Contract deployment settings

## Quick Deployment

### 1. Prerequisites
```bash
# Install nibid CLI
curl -sSfL https://nibiru.fi/install.sh | sh

# Create wallet
nibid keys add deployer --keyring-backend test

# Fund wallet (visit faucet)
# https://faucet.testnet-2.nibiru.fi/
```

### 2. Deploy Contracts
```bash
# Make script executable
chmod +x scripts/deploy-to-production.sh

# Run deployment
./scripts/deploy-to-production.sh
```

### 3. Verify Deployment
```bash
# Check contract status
nibid query wasm list-code --node https://rpc.testnet-2.nibiru.fi:443

# View contract details
nibid query wasm contract <CONTRACT_ADDRESS> --node https://rpc.testnet-2.nibiru.fi:443
```

## Network Configuration

### Environment Variables
```bash
# Nibiru Testnet
export CHAIN_ID="nibiru-testnet-2"
export RPC_URL="https://rpc.testnet-2.nibiru.fi:443"
export GAS_PRICES="0.025unibi"

# Juno Testnet
export CHAIN_ID="uni-6"
export RPC_URL="https://rpc.uni.junonetwork.io:443"
export GAS_PRICES="0.025ujunox"

# Osmosis Testnet
export CHAIN_ID="osmo-test-5"
export RPC_URL="https://rpc.testnet.osmosis.zone:443"
export GAS_PRICES="0.025uosmo"
```

### Custom Networks
Add your own network configuration to `deployment-config.json`:

```json
{
  "networks": {
    "your-network": {
      "chainId": "your-chain-id",
      "rpcUrl": "https://your-rpc-endpoint:443",
      "restUrl": "https://your-rest-endpoint",
      "gasPrice": "0.025your-token",
      "gasAdjustment": 1.3,
      "denom": "your-token",
      "description": "Your network description"
    }
  }
}
```

## Customization

### Modify Deployment Script
Edit `deploy-to-production.sh` to:

- Add custom validation logic
- Modify gas settings
- Add post-deployment hooks
- Customize error handling

### Add New Assets
Update the assets array in the deployment script:

```bash
# Add new asset
ASSETS="unibi usdc atom your-asset"

# Update case statement
case $asset in
    "unibi") UNIBI_MARKET_ADDR=$MARKET_ADDR ;;
    "usdc") USDC_MARKET_ADDR=$MARKET_ADDR ;;
    "atom") ATOM_MARKET_ADDR=$MARKET_ADDR ;;
    "your-asset") YOUR_ASSET_MARKET_ADDR=$MARKET_ADDR ;;
esac
```

## Testing

### Test Deployment
```bash
# Test on local network
CHAIN_ID="local" RPC_URL="http://localhost:26657" ./deploy-to-production.sh

# Test with dry run
DRY_RUN=true ./deploy-to-production.sh
```

### Validate Contracts
```bash
# Check contract state
nibid query wasm contract-state smart <CONTRACT_ADDR> '{"get_markets":{}}' --node $RPC_URL

# Test contract functions
nibid tx wasm execute <CONTRACT_ADDR> '{"supply":{}}' --from deployer --chain-id $CHAIN_ID
```

## Monitoring

### Deployment Logs
The deployment script generates detailed logs:

```bash
# View deployment summary
cat deployment.json

# Check frontend config
cat frontend/src/config/contracts.ts
```

### Health Checks
```bash
# Verify contract functionality
nibid query wasm contract <CONTRACT_ADDR> --node $RPC_URL

# Check transaction status
nibid query tx <TX_HASH> --node $RPC_URL
```

## Troubleshooting

### Common Issues

1. **"Bulk memory support not enabled"**
   - Use older CosmWasm versions (1.0.0)
   - Compile with: `RUSTFLAGS='-C target-feature=-bulk-memory'`

2. **"Insufficient balance"**
   - Fund your wallet from faucet
   - Check balance: `nibid query bank balances <ADDRESS>`

3. **"Contract instantiation failed"**
   - Verify init message format
   - Check comptroller address in market init

### Debug Mode
```bash
# Enable debug output
DEBUG=true ./deploy-to-production.sh

# Verbose logging
VERBOSE=true ./deploy-to-production.sh
```

## Resources

- [Nibiru Documentation](https://docs.nibiru.fi)
- [CosmWasm Documentation](https://docs.cosmwasm.com)
- [nibid CLI Reference](https://docs.nibiru.fi/dev/cli/)
- [Deployment Guide](../DEPLOYMENT_CONTRACTS.md)

---

*For questions or issues, please create a GitHub issue or join our community Discord.* 