#!/bin/bash

# 🚀 Nibiru Money Market - Production Deployment Script
# This script deploys your money market contracts to any CosmWasm-compatible chain

set -e

echo "🚀 Nibiru Money Market - Production Deployment"
echo "=============================================="

# Configuration - Update these for your target network
CHAIN_ID="${CHAIN_ID:-nibiru-testnet-2}"
RPC_URL="${RPC_URL:-https://rpc.testnet-2.nibiru.fi:443}"
KEYRING_BACKEND="${KEYRING_BACKEND:-test}"
GAS_PRICES="${GAS_PRICES:-0.025unibi}"
GAS="${GAS:-auto}"
GAS_ADJUSTMENT="${GAS_ADJUSTMENT:-1.3}"
WALLET_NAME="${WALLET_NAME:-deployer}"

echo "📋 Deployment Configuration:"
echo "   Chain ID: $CHAIN_ID"
echo "   RPC URL: $RPC_URL"
echo "   Wallet: $WALLET_NAME"
echo "   Gas Prices: $GAS_PRICES"
echo ""

# Check if nibid is available
if ! command -v nibid &> /dev/null; then
    echo "❌ nibid CLI not found. Please install it first."
    echo "   Visit: https://docs.nibiru.fi/dev/cli/"
    exit 1
fi

echo "✅ nibid found: $(nibid version)"

# Check if wallet exists
if ! nibid keys show $WALLET_NAME --keyring-backend $KEYRING_BACKEND &> /dev/null; then
    echo "❌ Wallet '$WALLET_NAME' not found."
    echo "   Create it with: nibid keys add $WALLET_NAME --keyring-backend $KEYRING_BACKEND"
    exit 1
fi

# Get deployer address
DEPLOYER_ADDR=$(nibid keys show $WALLET_NAME --keyring-backend $KEYRING_BACKEND -a)
echo "🏦 Deployer address: $DEPLOYER_ADDR"

# Check balance
BALANCE=$(nibid query bank balances $DEPLOYER_ADDR --node $RPC_URL --output json | jq -r '.balances[] | select(.denom=="unibi") | .amount // "0"')
echo "💰 Balance: ${BALANCE:-0} unibi"

if [ "${BALANCE:-0}" -lt "1000000" ]; then
    echo "❌ Insufficient balance. Need at least 1 NIBI for deployment."
    echo "📍 Fund your wallet: $DEPLOYER_ADDR"
    exit 1
fi

# Compile contracts with production settings
echo "🔨 Compiling contracts for production..."
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown

# Create artifacts directory
mkdir -p artifacts

# Check if Docker is available for optimization
if command -v docker &> /dev/null; then
    echo "📦 Optimizing contracts with Docker..."
    docker run --rm -v "$(pwd)":/code \
        --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
        --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
        cosmwasm/optimizer:0.16.0
else
    echo "📦 Docker not available. Using unoptimized contracts..."
    cp target/wasm32-unknown-unknown/release/market.wasm artifacts/
    cp target/wasm32-unknown-unknown/release/comptroller.wasm artifacts/
fi

# Deploy Market Contract
echo "🏪 Deploying Market Contract..."
MARKET_TX=$(nibid tx wasm store artifacts/market.wasm \
    --from $WALLET_NAME \
    --keyring-backend $KEYRING_BACKEND \
    --chain-id $CHAIN_ID \
    --node $RPC_URL \
    --gas $GAS \
    --gas-prices $GAS_PRICES \
    --gas-adjustment $GAS_ADJUSTMENT \
    --output json \
    --yes)

MARKET_CODE_ID=$(echo $MARKET_TX | jq -r '.logs[0].events[] | select(.type=="store_code") | .attributes[] | select(.key=="code_id") | .value')
echo "✅ Market contract stored with Code ID: $MARKET_CODE_ID"

# Deploy Comptroller Contract
echo "🏛️  Deploying Comptroller Contract..."
COMPTROLLER_TX=$(nibid tx wasm store artifacts/comptroller.wasm \
    --from $WALLET_NAME \
    --keyring-backend $KEYRING_BACKEND \
    --chain-id $CHAIN_ID \
    --node $RPC_URL \
    --gas $GAS \
    --gas-prices $GAS_PRICES \
    --gas-adjustment $GAS_ADJUSTMENT \
    --output json \
    --yes)

COMPTROLLER_CODE_ID=$(echo $COMPTROLLER_TX | jq -r '.logs[0].events[] | select(.type=="store_code") | .attributes[] | select(.key=="code_id") | .value')
echo "✅ Comptroller contract stored with Code ID: $COMPTROLLER_CODE_ID"

# Instantiate Comptroller
echo "🎯 Instantiating Comptroller..."
COMPTROLLER_INIT='{}'
COMPTROLLER_ADDR=$(nibid tx wasm instantiate $COMPTROLLER_CODE_ID "$COMPTROLLER_INIT" \
    --from $WALLET_NAME \
    --keyring-backend $KEYRING_BACKEND \
    --chain-id $CHAIN_ID \
    --node $RPC_URL \
    --gas $GAS \
    --gas-prices $GAS_PRICES \
    --gas-adjustment $GAS_ADJUSTMENT \
    --label "nibiru-money-market-comptroller" \
    --output json \
    --yes | jq -r '.logs[0].events[] | select(.type=="instantiate") | .attributes[] | select(.key=="_contract_address") | .value')

echo "✅ Comptroller instantiated at: $COMPTROLLER_ADDR"

# Instantiate Market Contracts for different assets
ASSETS="unibi usdc atom"

for asset in $ASSETS; do
    echo "🏪 Instantiating Market for $asset..."
    
    MARKET_INIT='{"comptroller":"'$COMPTROLLER_ADDR'","underlying_denom":"'$asset'"}'
    MARKET_ADDR=$(nibid tx wasm instantiate $MARKET_CODE_ID "$MARKET_INIT" \
        --from $WALLET_NAME \
        --keyring-backend $KEYRING_BACKEND \
        --chain-id $CHAIN_ID \
        --node $RPC_URL \
        --gas $GAS \
        --gas-prices $GAS_PRICES \
        --gas-adjustment $GAS_ADJUSTMENT \
        --label "nibiru-money-market-$asset" \
        --output json \
        --yes | jq -r '.logs[0].events[] | select(.type=="instantiate") | .attributes[] | select(.key=="_contract_address") | .value')
    
    # Store market addresses in variables
    case $asset in
        "unibi") UNIBI_MARKET_ADDR=$MARKET_ADDR ;;
        "usdc") USDC_MARKET_ADDR=$MARKET_ADDR ;;
        "atom") ATOM_MARKET_ADDR=$MARKET_ADDR ;;
    esac
    
    echo "✅ $asset Market instantiated at: $MARKET_ADDR"
done

# Generate deployment info
echo "📝 Creating deployment info..."
cat > deployment.json <<EOF
{
  "network": {
    "chainId": "$CHAIN_ID",
    "rpcUrl": "$RPC_URL",
    "deployer": "$DEPLOYER_ADDR"
  },
  "contracts": {
    "comptroller": {
      "codeId": $COMPTROLLER_CODE_ID,
      "address": "$COMPTROLLER_ADDR"
    },
    "market": {
      "codeId": $MARKET_CODE_ID
    },
    "markets": {
      "unibi": "$UNIBI_MARKET_ADDR",
      "usdc": "$USDC_MARKET_ADDR",
      "atom": "$ATOM_MARKET_ADDR"
    }
  }
}
EOF

# Generate frontend config
echo "⚛️  Creating frontend config..."
cat > frontend/src/config/contracts.ts <<EOF
// Nibiru Money Market - Contract Addresses
// Deployed on $CHAIN_ID

export const CONTRACTS = {
  // Network Configuration
  chainId: '$CHAIN_ID',
  rpcUrl: '$RPC_URL',
  restUrl: '$(echo $RPC_URL | sed 's/rpc/lcd/' | sed 's/:443/:1317/')',
  
  // Contract Addresses
  comptroller: '$COMPTROLLER_ADDR',
  markets: {
    unibi: '$UNIBI_MARKET_ADDR',
    usdc: '$USDC_MARKET_ADDR',
    atom: '$ATOM_MARKET_ADDR'
  },
  
  // Asset Configuration
  assets: [
    {
      denom: 'unibi',
      symbol: 'NIBI',
      name: 'Nibiru',
      decimals: 6,
      marketAddress: '$UNIBI_MARKET_ADDR'
    },
    {
      denom: 'usdc',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      marketAddress: '$USDC_MARKET_ADDR'
    },
    {
      denom: 'atom',
      symbol: 'ATOM',
      name: 'Cosmos Hub',
      decimals: 6,
      marketAddress: '$ATOM_MARKET_ADDR'
    }
  ]
};

export const GAS_SETTINGS = {
  gasPrice: '$GAS_PRICES',
  gasAdjustment: $GAS_ADJUSTMENT,
  gas: '$GAS'
};
EOF

echo ""
echo "🎉 Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 DEPLOYMENT SUMMARY:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Chain: $CHAIN_ID"
echo "🔗 RPC: $RPC_URL"
echo "👤 Deployer: $DEPLOYER_ADDR"
echo ""
echo "📜 CONTRACTS:"
echo "🏛️  Comptroller: $COMPTROLLER_ADDR"
echo "🏪 NIBI Market: $UNIBI_MARKET_ADDR"
echo "🏪 USDC Market: $USDC_MARKET_ADDR"
echo "🏪 ATOM Market: $ATOM_MARKET_ADDR"
echo ""
echo "📁 Files created:"
echo "   - deployment.json (deployment details)"
echo "   - frontend/src/config/contracts.ts (frontend config)"
echo ""
echo "🚀 Next steps:"
echo "   1. Update your frontend to use the deployed contracts"
echo "   2. Test the deployment with your frontend"
echo "   3. Share your dApp with others!"
echo ""
echo "🔍 Explorer: https://explorer.testnet-2.nibiru.fi"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" 