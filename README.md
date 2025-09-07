# 🐷 Piggy Boss - Modern DeFi Savings Platform

A cutting-edge DeFi savings platform built on Somnia Network, featuring smart yield generation, AI-powered insights, and gamified saving experience with **modern UI/UX design**.

## Overview

Piggy Boss is a complete DeFi savings and yield platform built for Somnia Network. Users can deposit USDT into time-locked savings plans (7, 14, 30, or 90 days) and earn high APY while collecting NFT rewards for milestones.


![Piggy Boss Platform](https://img.shields.io/badge/Platform-Somnia_Network-purple)
![Version](https://img.shields.io/badge/Version-2.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ What's New in v2.0

### 🎨 **Complete UI/UX Modernization**
- **Clean White Backgrounds** with elegant pink accents
- **Professional Sidebar Dashboard** replacing top navigation
- **React Icons Integration** throughout the entire application
- **Smooth Animations** powered by Framer Motion
- **Mobile-First Responsive Design** optimized for all devices
- **Modern Component Architecture** with reusable design system

### 🏗️ **Restructured Application Architecture**
- **Landing Page Redesign**: Modern hero section with statistics and features
- **Dashboard Layout**: Professional sidebar navigation with comprehensive analytics
- **Component Modularity**: Organized components by feature and functionality
- **Type-Safe Development**: Full TypeScript integration with strict typing
- **Performance Optimized**: Modern React patterns and optimizations

## 🌟 Core Features

### 💰 **High-Yield Savings**
- **7-day plan**: 5% APY
- **14-day plan**: 8% APY  
- **30-day plan**: 12% APY
- **90-day plan**: 18% APY

### 🎨 **NFT Rewards System**
- Earn unique NFTs for savings milestones
- Rarity tiers: Common, Rare, Epic, Legendary
- Achievement-based rewards

### 🤖 **AI-Powered Optimization**
- Smart yield optimization suggestions
- Performance analytics and insights
- Automated compound interest calculations

### 🪙 **USDT Faucet**
- Daily 100 USDT claims for testing
- Perfect for hackathon demos
- No setup required

## 🚀 Quick Start

### One-Command Setup ⚡
```bash
# Clone the repository
git clone <repository-url>
cd Piggy-Boss

# Run the complete setup script
./setup.sh
```

### Manual Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Install contract dependencies
cd contracts && npm install

# Install frontend dependencies  
cd ../frontend && npm install

# Start development server
cd frontend && npm run dev
# OR from root: npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Modern Dashboard**: Navigate to /dashboard after connecting wallet
- **Mobile Responsive**: Test on different screen sizes

## 🌐 Network Configuration

### Somnia Network
- **Chain ID**: 50312
- **RPC**: https://dream-rpc.somnia.network
- **Currency**: SOM
- **Explorer**: https://explorer.somnia.network

## 🏗️ Modern Application Structure

```
piggy-boss/
├── 📁 frontend/                    # Modern React application
│   ├── 📁 src/
│   │   ├── 📁 components/         # Organized component library
│   │   │   ├── 📁 animations/     # Framer Motion components
│   │   │   ├── 📁 common/         # Reusable UI components
│   │   │   ├── 📁 dashboard/      # Dashboard-specific components
│   │   │   ├── 📁 landing/        # Landing page components
│   │   │   ├── 📁 savings/        # Savings feature components
│   │   │   └── 📁 wallet/         # Wallet connection components
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📁 config/             # App configuration
│   │   ├── 📁 services/           # External services integration
│   │   ├── 📁 routes/             # Routing configuration
│   │   ├── 📁 providers/          # Context providers
│   │   ├── 📁 utils/              # Utility functions
│   │   ├── 📁 styles/             # Global styles and themes
│   │   └── 📁 types/              # TypeScript type definitions
├── 📁 contracts/                  # Smart contracts
│   ├── 📁 src/
│   │   ├── 📁 core/              # Main contract logic
│   │   ├── 📁 interfaces/        # Contract interfaces
│   │   ├── 📁 libraries/         # Shared libraries
│   │   └── 📁 mocks/             # Test contracts
│   ├── 📁 deploy/                # Deployment scripts
│   └── 📁 scripts/               # Utility scripts
└── 📁 docs/                      # Documentation
```

### Key Application Pages

#### 🏠 **Landing Page**
- **Modern Hero Section**: Clean design with live statistics
- **Feature Showcase**: Comprehensive platform overview
- **Professional Footer**: Contact and legal information
- **Responsive Design**: Optimized for all screen sizes

#### 📊 **Dashboard Layout**
- **Sidebar Navigation**: Professional, collapsible sidebar
- **Portfolio Overview**: Real-time balance and performance
- **Activity Feed**: Transaction history and notifications
- **Quick Actions**: Fast access to core features

#### 💰 **Savings Pages**
- **Deposit Interface**: Streamlined deposit process
- **Plan Selection**: Visual plan comparison
- **Portfolio Management**: Active savings overview
- **Yield Tracking**: Real-time earnings display

#### 🚰 **Faucet Page**
- **Modern Interface**: Clean claim process
- **Status Indicators**: Balance and cooldown displays
- **Success Notifications**: User feedback system
- **Mobile Optimized**: Touch-friendly interactions

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask or compatible wallet

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd Piggy-Boss
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Compile smart contracts**
   ```bash
   npm run compile
   ```

4. **Deploy contracts to Somnia testnet**
   ```bash
   npm run deploy
   ```

5. **Start the frontend**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   Open http://localhost:5173

## 📱 Features

### 💰 Savings Plans
- **7 days**: 5% APY
- **14 days**: 8% APY  
- **30 days**: 12% APY
- **90 days**: 18% APY
- **10% bonus** on successful maturity

### 🎨 NFT Rewards
- **Piggy Starter**: First deposit
- **Piggy Saver**: 100+ USDT saved
- **Piggy Master**: 1000+ USDT saved
- **Piggy Legend**: 10000+ USDT saved

### 🤖 AI Features
- Yield optimization suggestions
- Market trend analysis
- Personalized savings recommendations
- Risk assessment tools

### 🎮 Gamification
- **Experience points** for activities
- **Leaderboards** for top savers
- **Achievement badges**
- **Referral rewards**

## 🛠️ Modern Tech Stack

### Frontend Architecture
- **React 18.2.0** - Latest React with concurrent features
- **TypeScript** - Full type safety and developer experience
- **Vite** - Lightning-fast build tool and HMR
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Professional animations and transitions
- **React Router v6** - Modern routing with nested dashboard routes
- **React Icons** - Comprehensive icon library

### Web3 Integration
- **Wagmi v1.4.13** - React hooks for Ethereum
- **Viem** - TypeScript-first Ethereum library  
- **RainbowKit** - Beautiful wallet connection experience
- **Contract Hooks** - Custom hooks for smart contract interaction

### Design System
- **Clean White Backgrounds** with pink accent colors (#f97316)
- **Professional Sidebar Navigation** for dashboard layout
- **Responsive Grid Systems** for mobile-first design
- **Modern Component Architecture** with reusable patterns
- **Accessibility Features** following WCAG guidelines

### Development Tools
- **ESLint + Prettier** - Code quality and formatting
- **TypeScript Strict Mode** - Enhanced type checking
- **Hot Module Replacement** - Fast development cycles
- **Source Maps** - Enhanced debugging experience

## 📋 Smart Contracts

### Core Contracts
- **PiggyVault.sol**: Main savings logic with timelock
- **YieldManager.sol**: APY calculations and rewards
- **NFTRewards.sol**: Achievement NFTs
- **MockUSDT.sol**: Test token with faucet

### Libraries
- **InterestCalculator.sol**: Compound interest math
- **AccessControl.sol**: Permission management

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run type-check # TypeScript checking
```

### Contract Development
```bash
cd contracts
npm run compile    # Compile contracts
npm run test       # Run tests
npm run deploy     # Deploy to network
npm run verify     # Verify contracts
```

### Testing
```bash
npm test           # Run all tests
npm run test:unit  # Unit tests only
npm run test:e2e   # End-to-end tests
```

## 🌈 Color Palette

- **Primary**: #0a120e (Dark forest)
- **Secondary**: #5f6361 (Medium gray)
- **Accent**: #9ba896 (Sage green)
- **Background**: #fbfbf9 (Off-white)
- **Surface**: #f0f0ea (Light cream)
- **Border**: #cccfcd (Light gray-green)

## 🔐 Security

- **OpenZeppelin** security standards
- **Reentrancy protection** on all functions
- **Access control** for admin functions
- **Emergency pause** mechanism
- **Timelock** for critical updates

## 🚧 Roadmap

### Phase 1 (MVP) ✅
- Basic savings functionality
- NFT rewards system
- MockUSDT faucet
- Web3 wallet integration

### Phase 2 (Q1 2025)
- AI-powered yield optimization
- Advanced analytics dashboard
- Mobile app development
- Multi-token support

### Phase 3 (Q2 2025)
- Cross-chain integration
- Lending/borrowing features
- DAO governance
- Institutional features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Discord**: [Join our community]
- **Email**: support@piggyboss.finance

## 🙏 Acknowledgments

- Somnia Network team for the amazing infrastructure
- OpenZeppelin for security standards
- React and Vite communities
- All contributors and beta testers

---

**Built with ❤️ for the DeFi community on Somnia Network**



export const SOMNIA_CONTRACTS = {
  MOCK_USDT: "0xeE0667c01DeFEBca6d753544D6C8Db80ceaAC9B6",
  YIELD_MANAGER: "0x53538F8b7cF6e3022E91C3742DD32672d1dBE0bE", 
  NFT_REWARDS: "0x1Bd4FE7221e4796039c3F5eeD98ec80A84A36667",
  PIGGY_VAULT: "0xa1fBDb1737E6C8B0510cFeb440d2d33ea2c4B2C6",
} as const;
