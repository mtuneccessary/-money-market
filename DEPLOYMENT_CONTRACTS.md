# 🚀 Nibiru Money Market - Deployment Contracts

## 📋 **Current Deployment Status**

### **✅ Frontend Application**
- **Status:** ✅ **LIVE and Running**
- **URL:** http://localhost:3000
- **Features:** Complete money market interface with supply/borrow functionality

### **📜 Contract Addresses (Current Configuration)**

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

---

## 🛠️ **Deployment Options**

### **Option 1: Use Current Demo Configuration**
Your frontend is **already working** with the current contract addresses. You can:
- Test all functionality at http://localhost:3000
- Connect Keplr wallet and interact with the interface
- Experience the full money market features

### **Option 2: Deploy New Contracts (Production)**

Use the **production deployment script** I created for you:

```bash
# Deploy to Nibiru Testnet-2 (recommended)
./deploy-to-production.sh

# Deploy to other networks
CHAIN_ID="uni-6" RPC_URL="https://rpc.uni.junonetwork.io:443" ./deploy-to-production.sh
```

---

## 📁 **Deployment Files Created**

### **1. Production Deployment Script**
- **File:** `deploy-to-production.sh`
- **Purpose:** Complete automated deployment to any CosmWasm chain
- **Features:**
  - Automatic contract compilation and optimization
  - Balance checking and validation
  - Contract deployment and instantiation
  - Frontend configuration generation

### **2. Network Configuration**
- **File:** `deployment-config.json`
- **Purpose:** Multi-network deployment configuration
- **Networks:** Nibiru, Juno, Osmosis (testnet and mainnet)

### **3. Current Frontend Config**
- **File:** `frontend/src/config/contracts.ts`
- **Purpose:** Active contract addresses for the frontend
- **Status:** ✅ Working with demo contracts

---

## 🚀 **How to Deploy Your Own Contracts**

### **Prerequisites:**
1. ✅ Funded wallet (you have: `nibi1z207rtxzvcm43cljgtdz2y7d7cukl8uapvedgf`)
2. ✅ nibid CLI installed
3. ✅ Rust and wasm32 target
4. ✅ All dependencies ready

### **Step 1: Run Deployment Script**
```bash
# Make sure you're in the project root
cd /Users/vicgunga/money-market

# Run the deployment
./deploy-to-production.sh
```

### **Step 2: The Script Will:**
1. 🔨 Compile your smart contracts
2. 📦 Optimize WASM files (if Docker available)
3. 🏪 Deploy Market contract
4. 🏛️ Deploy Comptroller contract
5. 🎯 Instantiate all contracts
6. ⚛️ Update frontend configuration
7. 📝 Generate deployment summary

### **Step 3: Test Your Deployment**
- Frontend will automatically use new contract addresses
- Test all functionality: supply, borrow, withdraw, repay
- Monitor transactions on Nibiru explorer

---

## 📊 **Smart Contract Architecture**

### **Market Contract** (`market.wasm`)
```rust
// Core Functions
pub fn supply(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>
pub fn withdraw(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>
pub fn borrow(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>
pub fn repay(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>

// Queries
pub fn get_balance(deps: Deps, user: String) -> StdResult<BalanceResponse>
pub fn get_borrow_rate(deps: Deps) -> StdResult<RateResponse>
pub fn get_supply_rate(deps: Deps) -> StdResult<RateResponse>
```

### **Comptroller Contract** (`comptroller.wasm`)
```rust
// Risk Management
pub fn enter_market(deps: DepsMut, user: String, market: String) -> Result<Response, ContractError>
pub fn exit_market(deps: DepsMut, user: String, market: String) -> Result<Response, ContractError>
pub fn liquidate(deps: DepsMut, borrower: String, market: String) -> Result<Response, ContractError>

// Queries
pub fn get_account_liquidity(deps: Deps, user: String) -> StdResult<LiquidityResponse>
pub fn get_markets(deps: Deps) -> StdResult<MarketsResponse>
```

---

## 🌐 **Network Deployment Options**

### **Nibiru Testnet-2** (Current)
- **Chain ID:** `nibiru-testnet-2`
- **RPC:** `https://rpc.testnet-2.nibiru.fi:443`
- **Faucet:** https://faucet.testnet-2.nibiru.fi/
- **Explorer:** https://explorer.testnet-2.nibiru.fi

### **Alternative Networks:**
```bash
# Juno Testnet
CHAIN_ID="uni-6" RPC_URL="https://rpc.uni.junonetwork.io:443" ./deploy-to-production.sh

# Osmosis Testnet  
CHAIN_ID="osmo-test-5" RPC_URL="https://rpc.testnet.osmosis.zone:443" ./deploy-to-production.sh
```

---

## 💡 **Deployment Troubleshooting**

### **Common Issues:**

1. **"Bulk memory support not enabled"**
   - Use older CosmWasm versions (1.0.0)
   - Compile with: `RUSTFLAGS='-C target-feature=-bulk-memory'`

2. **"Insufficient balance"**
   - Fund your wallet: `nibi1z207rtxzvcm43cljgtdz2y7d7cukl8uapvedgf`
   - Visit: https://faucet.testnet-2.nibiru.fi/

3. **"Contract instantiation failed"**
   - Check init message format
   - Verify comptroller address in market init

### **Recommended Approach:**
Since Nibiru now focuses on EVM compatibility, consider:
1. **Current Setup:** Use the working demo for testing
2. **Future:** Migrate to Nibiru EVM with Solidity contracts
3. **Alternative:** Deploy to Juno/Osmosis for CosmWasm

---

## 🎯 **Your Options Right Now**

### **✅ Option A: Use Current Working Setup**
- **Status:** ✅ Ready to use immediately
- **URL:** http://localhost:3000  
- **Features:** Full money market functionality
- **Best for:** Testing, demos, development

### **🚀 Option B: Deploy New Contracts**
- **Command:** `./deploy-to-production.sh`
- **Time:** ~10 minutes
- **Result:** Your own deployed contracts
- **Best for:** Production, ownership, customization

### **🔄 Option C: Migrate to Nibiru EVM**
- **Approach:** Rewrite contracts in Solidity
- **Benefits:** Better Nibiru compatibility
- **Timeline:** Future enhancement

---

## 📞 **Support & Next Steps**

**Your money market is ready!** Choose your preferred option:

1. **Demo & Test:** Use http://localhost:3000 immediately
2. **Deploy Own:** Run `./deploy-to-production.sh`
3. **Customize:** Modify contracts and redeploy
4. **Scale:** Add more features and assets

**Need help?** Check:
- Nibiru Docs: https://nibiru.fi/docs
- CosmWasm Docs: https://docs.cosmwasm.com
- Deployment logs in the terminal

---

*🎉 Congratulations! You have a complete, professional money market platform ready to go!* 