# Nibiru Money Market

A professional, production-ready money market protocol built on the Nibiru blockchain with a modern React frontend and CosmWasm smart contracts.

[![Rust](https://img.shields.io/badge/Rust-1.75+-orange.svg)](https://rust-lang.org)
[![CosmWasm](https://img.shields.io/badge/CosmWasm-1.0.0-blue.svg)](https://cosmwasm.com)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC.svg)](https://tailwindcss.com)

## Features

- **Supply & Borrow**: Lend and borrow assets with real-time balance tracking
- **Risk Management**: Advanced comptroller system for liquidation and risk assessment
- **Modern UI**: Beautiful, responsive interface with glassmorphism design
- **Wallet Integration**: Seamless Keplr wallet connection
- **Mobile First**: Optimized for all devices
- **Real-time Updates**: Live portfolio tracking and health factor monitoring

## Architecture

```
money-market/
├── contracts/           # CosmWasm smart contracts
│   ├── market/         # Individual asset markets
│   └── comptroller/    # Risk management system
├── frontend/           # React TypeScript application
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # State management
│   └── config/         # Contract configuration
└── scripts/            # Deployment and utility scripts
```

## Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) 1.75+
- [Node.js](https://nodejs.org/) 18+
- [nibid CLI](https://docs.nibiru.fi/dev/cli/)
- [Keplr Wallet](https://www.keplr.app/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nibiru-money-market.git
   cd nibiru-money-market
   ```

2. **Install Rust dependencies**
   ```bash
   cargo build --release --target wasm32-unknown-unknown
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

Your money market will be available at [http://localhost:3000](http://localhost:3000)

## Smart Contracts

### Market Contract
Handles individual asset markets for lending and borrowing operations.

```rust
// Core functions
pub fn supply(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>
pub fn withdraw(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>
pub fn borrow(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>
pub fn repay(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError>
```

### Comptroller Contract
Manages risk assessment, liquidation, and market coordination.

```rust
// Risk management
pub fn enter_market(deps: DepsMut, user: String, market: String) -> Result<Response, ContractError>
pub fn liquidate(deps: DepsMut, borrower: String, market: String) -> Result<Response, ContractError>
```

## Deployment

### Quick Deployment
```bash
# Deploy to Nibiru Testnet
./deploy-to-production.sh

# Deploy to other networks
CHAIN_ID="uni-6" RPC_URL="https://rpc.uni.junonetwork.io:443" ./deploy-to-production.sh
```

### Manual Deployment
1. **Compile contracts**
   ```bash
   RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown
   ```

2. **Store contracts**
   ```bash
   nibid tx wasm store artifacts/market.wasm --from deployer --chain-id nibiru-testnet-2
   nibid tx wasm store artifacts/comptroller.wasm --from deployer --chain-id nibiru-testnet-2
   ```

3. **Instantiate contracts**
   ```bash
   nibid tx wasm instantiate <CODE_ID> '{}' --from deployer --chain-id nibiru-testnet-2
   ```

## Frontend Features

- **Portfolio Management**: Real-time tracking of supplied and borrowed assets
- **Health Factor Monitoring**: Visual indicators for account health
- **Supply Modal**: Easy asset supply with balance validation
- **Borrow Modal**: Risk-aware borrowing with limits
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Theme**: Modern, eye-friendly interface

## Configuration

### Environment Variables
```bash
# Network Configuration
CHAIN_ID=nibiru-testnet-2
RPC_URL=https://rpc.testnet-2.nibiru.fi:443
GAS_PRICES=0.025unibi
```

### Contract Addresses
Update `frontend/src/config/contracts.ts` with your deployed contract addresses.

## Testing

### Smart Contract Tests
```bash
cargo test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
# Test with deployed contracts
npm run test:integration
```

## Documentation

- [Smart Contract API](./contracts/README.md)
- [Frontend Components](./frontend/README.md)
- [Deployment Guide](./DEPLOYMENT_CONTRACTS.md)
- [Development Guide](./DEVELOPING.md)

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [Nibiru](https://nibiru.fi/) for the blockchain infrastructure
- [CosmWasm](https://cosmwasm.com/) for the smart contract framework
- [Keplr](https://www.keplr.app/) for wallet integration
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful UI

## Support

- **Documentation**: [https://docs.nibiru.fi](https://docs.nibiru.fi)
- **Discord**: [Nibiru Community](https://discord.gg/nibiru)
- **Telegram**: [@NibiruAnnouncements](https://t.me/NibiruAnnouncements)
- **Issues**: [GitHub Issues](https://github.com/yourusername/nibiru-money-market/issues)

---

**Star this repository if you found it helpful!**

*Built with love by the Nibiru community*
