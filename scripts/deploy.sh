#!/bin/bash

# Nibiru Money Market Deployment Script
set -e

echo "🚀 Deploying Money Market to Nibiru Testnet-2"

# Configuration
CHAIN_ID="nibiru-testnet-2"
RPC_URL="https://rpc.testnet-2.nibiru.fi:443"
KEYRING_BACKEND="test"
GAS_PRICES="0.025unibi"
GAS="auto"
GAS_ADJUSTMENT="1.3"

# Check if nibid is installed
if ! command -v nibid &> /dev/null; then
    echo "❌ nibid not found. Installing..."
    
    # Install nibid
    curl -s https://get.nibiru.fi/! | bash
    
    # Add to PATH for current session
    export PATH="$HOME/.nibiru/bin:$PATH"
    
    if ! command -v nibid &> /dev/null; then
        echo "❌ Failed to install nibid. Please install manually from https://docs.nibiru.fi/dev/cli/"
        exit 1
    fi
fi

echo "✅ nibid found: $(nibid version)"

# Setup wallet if not exists
WALLET_NAME="deployer"
if ! nibid keys show $WALLET_NAME --keyring-backend $KEYRING_BACKEND &> /dev/null; then
    echo "🔑 Creating new wallet: $WALLET_NAME"
    nibid keys add $WALLET_NAME --keyring-backend $KEYRING_BACKEND
    
    echo "📝 Please save your mnemonic phrase securely!"
    echo "💰 Please fund your wallet with testnet tokens from: https://faucet.testnet-2.nibiru.fi/"
    echo "📍 Your address:"
    nibid keys show $WALLET_NAME --keyring-backend $KEYRING_BACKEND -a
    echo ""
    echo "Press Enter after funding your wallet to continue..."
    read
else
    echo "✅ Wallet $WALLET_NAME already exists"
fi

DEPLOYER_ADDR=$(nibid keys show $WALLET_NAME --keyring-backend $KEYRING_BACKEND -a)
echo "🏦 Deployer address: $DEPLOYER_ADDR"

# Check balance
BALANCE=$(nibid query bank balances $DEPLOYER_ADDR --node $RPC_URL --output json | jq -r '.balances[] | select(.denom=="unibi") | .amount // "0"')
echo "💰 Balance: ${BALANCE:-0} unibi"

if [ "${BALANCE:-0}" -lt "1000000" ]; then
    echo "❌ Insufficient balance. Please fund your wallet with testnet tokens from: https://faucet.testnet-2.nibiru.fi/"
    echo "📍 Your address: $DEPLOYER_ADDR"
    echo "Press Enter after funding your wallet to continue..."
    read
    # Re-check balance
    BALANCE=$(nibid query bank balances $DEPLOYER_ADDR --node $RPC_URL --output json | jq -r '.balances[] | select(.denom=="unibi") | .amount // "0"')
    echo "💰 Updated Balance: ${BALANCE:-0} unibi"
fi

# Compile contracts
echo "🔨 Compiling contracts..."
RUSTFLAGS='-C link-arg=-s -C target-feature=-bulk-memory' cargo build --release --target wasm32-unknown-unknown

# Optimize contracts
echo "📦 Optimizing contracts..."
if command -v docker &> /dev/null; then
    docker run --rm -v "$(pwd)":/code \
        --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
        --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
        cosmwasm/optimizer:0.16.0
else
    echo "⚠️  Docker not found. Using unoptimized contracts."
    mkdir -p artifacts
    
    # Check if wasm files exist, if not compile them individually
    if [ ! -f "target/wasm32-unknown-unknown/release/market.wasm" ]; then
        echo "🔨 Compiling market contract..."
        RUSTFLAGS='-C link-arg=-s -C target-feature=-bulk-memory' cargo build --release --target wasm32-unknown-unknown --package market
    fi
    
    if [ ! -f "target/wasm32-unknown-unknown/release/comptroller.wasm" ]; then
        echo "🔨 Compiling comptroller contract..."
        RUSTFLAGS='-C link-arg=-s -C target-feature=-bulk-memory' cargo build --release --target wasm32-unknown-unknown --package comptroller
    fi
    
    # Copy unoptimized contracts (avoiding bulk memory issues)
    echo "📦 Using unoptimized contracts..."
    cp target/wasm32-unknown-unknown/release/market.wasm artifacts/
    cp target/wasm32-unknown-unknown/release/comptroller.wasm artifacts/
fi

# Deploy Market Contract
echo "🏪 Deploying Market Contract..."
MARKET_CODE_ID=$(nibid tx wasm store artifacts/market.wasm \
    --from $WALLET_NAME \
    --keyring-backend $KEYRING_BACKEND \
    --chain-id $CHAIN_ID \
    --node $RPC_URL \
    --gas $GAS \
    --gas-prices $GAS_PRICES \
    --gas-adjustment $GAS_ADJUSTMENT \
    --output json \
    --yes | jq -r '.logs[0].events[] | select(.type=="store_code") | .attributes[] | select(.key=="code_id") | .value')

echo "✅ Market contract stored with Code ID: $MARKET_CODE_ID"

# Deploy Comptroller Contract
echo "🏛️  Deploying Comptroller Contract..."
COMPTROLLER_CODE_ID=$(nibid tx wasm store artifacts/comptroller.wasm \
    --from $WALLET_NAME \
    --keyring-backend $KEYRING_BACKEND \
    --chain-id $CHAIN_ID \
    --node $RPC_URL \
    --gas $GAS \
    --gas-prices $GAS_PRICES \
    --gas-adjustment $GAS_ADJUSTMENT \
    --output json \
    --yes | jq -r '.logs[0].events[] | select(.type=="store_code") | .attributes[] | select(.key=="code_id") | .value')

echo "✅ Comptroller contract stored with Code ID: $COMPTROLLER_CODE_ID"

# Instantiate Comptroller
echo "🎯 Instantiating Comptroller..."
COMPTROLLER_INIT='{"admin":"'$DEPLOYER_ADDR'"}'
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
    
    MARKET_INIT='{"asset":"'$asset'","underlying_denom":"'$asset'"}'
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

# Create deployment info file
echo "📝 Creating deployment info..."
cat > deployment.json << EOF
{
  "chain_id": "$CHAIN_ID",
  "rpc_url": "$RPC_URL",
  "deployer": "$DEPLOYER_ADDR",
  "contracts": {
    "comptroller": {
      "code_id": "$COMPTROLLER_CODE_ID",
      "address": "$COMPTROLLER_ADDR"
    },
    "market": {
      "code_id": "$MARKET_CODE_ID"
    },
    "markets": {
      "unibi": "$UNIBI_MARKET_ADDR",
      "usdc": "$USDC_MARKET_ADDR",
      "atom": "$ATOM_MARKET_ADDR"
    }
  }
}
EOF

# Create frontend config
echo "⚛️  Creating frontend config..."
cat > frontend/src/config/contracts.ts << EOF
// Auto-generated contract addresses for Nibiru Testnet-2
export const NIBIRU_TESTNET_CONFIG = {
  chainId: '$CHAIN_ID',
  rpc: '$RPC_URL',
  contracts: {
    comptroller: '$COMPTROLLER_ADDR',
    markets: {
      unibi: '$UNIBI_MARKET_ADDR',
      usdc: '$USDC_MARKET_ADDR',
      atom: '$ATOM_MARKET_ADDR'
    }
  }
};

export default NIBIRU_TESTNET_CONFIG;
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