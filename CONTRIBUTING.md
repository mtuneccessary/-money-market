# 🤝 Contributing to Nibiru Money Market

Thank you for your interest in contributing to the Nibiru Money Market project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)

## 🎯 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) 1.75+
- [Node.js](https://nodejs.org/) 18+
- [Git](https://git-scm.com/)
- [nibid CLI](https://docs.nibiru.fi/dev/cli/)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nibiru-money-market.git
   cd nibiru-money-market
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/nibiru-money-market.git
   ```

## 🔧 Development Setup

### Smart Contracts

```bash
# Install Rust dependencies
cargo build --release --target wasm32-unknown-unknown

# Run tests
cargo test

# Check formatting
cargo fmt --all -- --check

# Run clippy
cargo clippy --all-targets --all-features -- -D warnings
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 📝 Contributing Guidelines

### Issue Reporting

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use clear, descriptive titles**
3. **Provide detailed descriptions** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

### Feature Requests

When requesting features:

1. **Describe the problem** you're trying to solve
2. **Explain why** this feature is needed
3. **Provide examples** of how it would work
4. **Consider alternatives** and trade-offs

### Bug Fixes

For bug fixes:

1. **Create a minimal reproduction** case
2. **Test your fix** thoroughly
3. **Add tests** to prevent regression
4. **Update documentation** if needed

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure tests pass** locally
2. **Update documentation** for any new features
3. **Follow code style** guidelines
4. **Squash commits** logically
5. **Write clear commit messages**

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass
2. **Code review** from maintainers
3. **Address feedback** promptly
4. **Maintainers approve** and merge

## 🎨 Code Style

### Rust (Smart Contracts)

- **Formatting**: Use `cargo fmt`
- **Linting**: Use `cargo clippy`
- **Documentation**: Document all public functions
- **Error Handling**: Use proper error types

```rust
/// Supply assets to the market
/// 
/// # Arguments
/// * `deps` - Dependencies
/// * `amount` - Amount to supply
/// 
/// # Returns
/// * `Result<Response, ContractError>` - Operation result
pub fn supply(deps: DepsMut, amount: Uint128) -> Result<Response, ContractError> {
    // Implementation
}
```

### TypeScript/React (Frontend)

- **Formatting**: Use Prettier
- **Linting**: Use ESLint
- **Components**: Use functional components with hooks
- **Types**: Use TypeScript interfaces

```typescript
interface Asset {
  denom: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
}

const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => {
  // Component implementation
};
```

## 🧪 Testing

### Smart Contract Tests

- **Unit tests** for all functions
- **Integration tests** for workflows
- **Edge cases** and error conditions
- **Gas optimization** tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_supply() {
        // Test implementation
    }
}
```

### Frontend Tests

- **Component tests** with React Testing Library
- **Hook tests** for custom hooks
- **Integration tests** for user flows
- **Accessibility tests**

```typescript
import { render, screen } from '@testing-library/react';
import { AssetCard } from './AssetCard';

test('renders asset information', () => {
  const asset = { denom: 'unibi', symbol: 'NIBI', name: 'Nibiru', decimals: 6, balance: '1000000' };
  render(<AssetCard asset={asset} />);
  
  expect(screen.getByText('NIBI')).toBeInTheDocument();
});
```

## 📚 Documentation

### Code Documentation

- **Inline comments** for complex logic
- **Function documentation** with examples
- **README files** for each major component
- **API documentation** for public interfaces

### User Documentation

- **Installation guides** with prerequisites
- **Usage examples** and tutorials
- **Troubleshooting** common issues
- **FAQ** section

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes written
- [ ] GitHub release created

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Discord**: For real-time chat
- **Email**: For security issues

### Mentorship

New contributors can:

1. **Start with** "good first issue" labels
2. **Ask questions** in discussions
3. **Request reviews** from maintainers
4. **Join community** calls/meetings

## 🙏 Recognition

Contributors will be:

- **Listed** in the README
- **Mentioned** in release notes
- **Invited** to maintainer roles (for significant contributions)
- **Featured** in community updates

---

**Thank you for contributing to the Nibiru Money Market project!** 🚀

Your contributions help make DeFi more accessible and secure for everyone. 