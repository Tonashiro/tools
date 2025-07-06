# NFT Snapshoter - Multi-Network NFT Collection Analytics Tool

A powerful Next.js 15 application for analyzing NFT collections across multiple blockchain networks. Built with modern web technologies and designed for comprehensive NFT holder analysis and data export.

## 🚀 Features

- **Multi-Network Support** - Analyze NFT collections on Monad, Ethereum, Base, and Abstract networks
- **Network Selector** - Easy switching between different blockchain networks with automatic RPC URL routing
- **NFT Collection Analysis** - Comprehensive analysis of NFT collections including ownership distribution and holder statistics
- **Holder Discovery** - Search and analyze NFT holders with advanced filtering and sorting capabilities
- **Data Export** - Export snapshot data in multiple formats (CSV, JSON, Airdrop lists)
- **Collection Statistics** - View detailed collection stats including total supply, unique holders, and token types
- **Smart Search** - Real-time search through thousands of holders with responsive pagination
- **Quick Actions** - Copy addresses, explore on blockchain, and access external links seamlessly
- **Responsive Design** - Fully responsive interface optimized for mobile, tablet, and desktop
- **ERC-721 & ERC-1155 Support** - Handles both token standards with accurate counting logic
- **Discord Authentication** - Secure user authentication via Discord OAuth
- **Snapshot Management** - Save, view, and manage your NFT collection snapshots
- **Export Functionality** - Export snapshot data in JSON format
- **Modern UI** - Built with Next.js 14, TypeScript, and Tailwind CSS
- **Magic Eden Integration** - Enhanced collection data from Magic Eden marketplace

## 🌐 Multi-Network Support

The NFT Snapshoter now supports multiple blockchain networks, allowing you to analyze NFT collections across different ecosystems.

### Supported Networks

1. **Monad** (default) - Monad blockchain
2. **Ethereum** - Ethereum mainnet
3. **Base** - Base L2 network
4. **Abstract** - Abstract blockchain

### How It Works

- **Network Selection**: Choose your preferred blockchain network from the dropdown in the form
- **Automatic RPC Routing**: The application automatically uses the appropriate RPC URL based on your selection
- **Consistent Data Flow**: Network selection is maintained across all API calls and exports
- **Export Integration**: All export formats include network information for data consistency

### Environment Configuration

Add the following environment variables to your `.env.local` file:

```bash
# Alchemy API Key (required for all networks)
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Magic Eden API Key (optional, for enhanced collection data)
MAGIC_EDEN_API_KEY=your_magic_eden_api_key_here

# RPC URLs for different networks
MONAD_RPC_URL=https://rpc.monad.xyz
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2
ABSTRACT_RPC_URL=https://rpc.abstract.money

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/snapshoter"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Discord OAuth Configuration
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### API Endpoints with Network Support

All API endpoints now accept a `network` parameter:

- `GET /api/nft/owners?contractAddress=...&network=Monad`
- `GET /api/nft/metadata?contractAddress=...&network=Monad`
- `GET /api/nft/magiceden?contractAddress=...&chain=monad-testnet`
- `GET /api/nft/export?contractAddress=...&network=Monad`
- `GET /api/nft/export/json?contractAddress=...&network=Monad`
- `GET /api/nft/export/airdrop?contractAddress=...&network=Monad&format=txt`

## 🎨 Magic Eden Integration

The NFT Snapshoter now integrates with Magic Eden's API to provide enhanced collection data and market insights.

### Enhanced Collection Data

When you search for a collection, the application fetches data from both Alchemy and Magic Eden APIs to provide comprehensive information:

- **Market Data**: Floor price, top bids, volume statistics
- **Collection Rankings**: 24h, 7d, 30d, and all-time rankings
- **Trading Activity**: Floor sales, volume changes, and market trends
- **Collection Status**: Verification status, spam detection, NSFW flags
- **Social Links**: Twitter, Discord, and external website links
- **Royalty Information**: On-chain and EIP-2981 royalty data
- **Minting Status**: Active minting stages and supply information

### Supported Magic Eden Chains

- **Monad Testnet** (`monad-testnet`) - For Monad network collections
- **Ethereum** (`ethereum`) - For Ethereum mainnet collections  
- **Base** (`base`) - For Base L2 collections

### Getting Your Magic Eden API Key

1. Visit the [Magic Eden Developer Portal](https://docs.magiceden.io/)
2. Sign up for a developer account
3. Generate an API key for your application
4. Add the API key to your environment variables

**Note**: The Magic Eden integration is optional. If no API key is provided, the application will still work with Alchemy data only.

### Getting Your RPC URLs

1. **Monad**: Use the official Monad RPC endpoint
2. **Ethereum**: Use Alchemy, Infura, or other Ethereum RPC providers
3. **Base**: Use Coinbase's Base RPC or Alchemy's Base endpoint
4. **Abstract**: Use the official Abstract RPC endpoint

## 🛠️ Tech Stack

- **Next.js 15** - Latest version with App Router
- **TypeScript** - Full type safety throughout the application
- **TanStack Query** - Powerful client-side data fetching and caching
- **Alchemy NFT API** - Professional NFT data and analytics
- **Magic Eden API** - Enhanced marketplace data and collection insights
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Multi-Blockchain Support** - Native support for multiple blockchain networks

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── nft/          # NFT-related endpoints
│   │       ├── export/   # Data export endpoints
│   │       ├── metadata/ # Collection metadata
│   │       └── owners/   # NFT owners data
│   ├── nft-snapshotter/   # Main NFT analysis page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable components
│   ├── layout/          # Layout components
│   │   ├── header.tsx   # Site header
│   │   └── footer.tsx   # Site footer
│   ├── nft/             # NFT-specific components
│   │   ├── nft-collection-form.tsx
│   │   ├── nft-collection-stats.tsx
│   │   └── nft-owners-list.tsx
│   ├── providers/       # Context providers
│   │   └── query-provider.tsx
│   └── ui/              # UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── pagination.tsx
├── hooks/               # Custom hooks
│   ├── use-all-nft-owners.ts
│   ├── use-nft-metadata.ts
│   └── use-queries.ts
├── lib/                 # Utility libraries
│   ├── alchemy-utils.ts # Alchemy API utilities
│   ├── api.ts          # API client functions
│   ├── query-client.ts # TanStack Query configuration
│   ├── token-utils.ts  # Token counting utilities
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
│   ├── nft.ts          # NFT-related types
│   └── index.ts        # Common types
└── utils/              # Utility functions
    ├── constants.ts    # Application constants
    └── csv-export.ts   # Export utilities
```

## 🎯 Key Features

### NFT Collection Analysis
- **Complete Data Fetching** - Fetches all NFT owners from large collections (700k+ holders)
- **Token Type Support** - Handles both ERC-721 and ERC-1155 with accurate counting
- **Real-time Statistics** - Live collection statistics and holder counts
- **Metadata Display** - Collection name, symbol, deployer, and deployment details

### Holder Discovery & Search
- **Advanced Search** - Search by wallet address with real-time filtering
- **Smart Sorting** - Sort by token count (ascending/descending) or address (A-Z/Z-A)
- **Responsive Pagination** - Efficient pagination for large datasets
- **Holder Information** - Detailed holder data with copy and explore functionality

### Data Export Capabilities
- **CSV Export** - Complete holder data in CSV format
- **JSON Export** - Structured data export for API integration
- **Airdrop Lists** - Specialized formats for token distribution
- **Multiple Formats** - TXT and JSON airdrop list formats

### User Experience
- **Mobile-First Design** - Fully responsive across all devices
- **Responsive Address Display** - Shorter addresses on mobile for better readability
- **Loading States** - Comprehensive loading indicators and skeleton screens
- **Error Handling** - Graceful error handling with user-friendly messages

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```env
   # Alchemy API Configuration
   ALCHEMY_API_KEY=your_alchemy_api_key_here
   
   # Magic Eden API Configuration (optional)
   MAGIC_EDEN_API_KEY=your_magic_eden_api_key_here
   
   # RPC URLs for different networks
   MONAD_RPC_URL=https://rpc.monad.xyz
   ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2
   BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2
   ABSTRACT_RPC_URL=https://rpc.abstract.money
   
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   
   # Database Configuration
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/snapshoter"
   
   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   
   # Discord OAuth Configuration
   DISCORD_CLIENT_ID="your-discord-client-id"
   DISCORD_CLIENT_SECRET="your-discord-client-secret"
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Endpoints

### NFT Data API
- `GET /api/nft/metadata` - Get collection metadata
- `GET /api/nft/owners` - Get NFT owners data
- `GET /api/nft/export` - Export data in CSV format
- `GET /api/nft/export/json` - Export data in JSON format
- `GET /api/nft/export/airdrop` - Export airdrop list

## 🎨 UI Components

Built with modern design principles:
- **Responsive Design** - Optimized for all screen sizes
- **Accessible Components** - Built with Radix UI for accessibility
- **Consistent Styling** - Tailwind CSS for maintainable styles
- **Interactive Elements** - Hover effects and smooth transitions

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
- `ALCHEMY_API_KEY` - Alchemy API key for NFT data
- `MONAD_RPC_URL` - Monad blockchain RPC endpoint
- `ETHEREUM_RPC_URL` - Ethereum mainnet RPC endpoint
- `BASE_RPC_URL` - Base L2 network RPC endpoint
- `ABSTRACT_RPC_URL` - Abstract blockchain RPC endpoint
- `NEXT_PUBLIC_API_URL` - API base URL
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - NextAuth base URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `DISCORD_CLIENT_ID` - Discord OAuth client ID
- `DISCORD_CLIENT_SECRET` - Discord OAuth client secret

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Alchemy NFT API Documentation](https://docs.alchemy.com/reference/nft-api-quickstart)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with 💜 by [Tonashiro](https://x.com/tonashiro_). Powered by Chog.

## 📚 Additional Documentation

### Database Management

#### Docker Commands

```bash
# Start database services
yarn docker:up

# Stop database services
yarn docker:down

# View database logs
yarn docker:logs

# Reset database (removes all data)
yarn docker:reset
```

#### Prisma Commands

```bash
# Generate Prisma client
yarn db:generate

# Push schema changes to database
yarn db:push

# Create and run migrations
yarn db:migrate

# Deploy migrations (production)
yarn db:migrate:deploy

# Open Prisma Studio (database GUI)
yarn db:studio

# Reset database
yarn db:reset
```

#### Database Access

- **PostgreSQL**: `localhost:5432`
  - Username: `postgres`
  - Password: `postgres`
  - Database: `snapshoter`

- **pgAdmin** (optional): `http://localhost:8080`
  - Email: `admin@snapshoter.com`
  - Password: `admin`

### Discord Application Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret to your `.env.local`

### Alchemy API Setup

1. Sign up at [Alchemy](https://www.alchemy.com/)
2. Create apps for each network you want to support
3. Copy the API keys to your `.env.local`

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── my-snapshots/      # User snapshots
│   └── nft-snapshotter/ # NFT snapshoter page
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── nft/           # NFT-related components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### API Endpoints

- `GET /api/nft/metadata` - Get NFT collection metadata
- `GET /api/nft/owners` - Get NFT owners data
- `GET /api/nft/export/json` - Export snapshot as JSON
- `GET /api/snapshots` - Get user's saved snapshots
- `POST /api/snapshots` - Save a new snapshot
- `DELETE /api/snapshots/[id]` - Delete a snapshot

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | NextAuth base URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | Yes |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret | Yes |
| `ALCHEMY_API_KEY_MONAD` | Alchemy API key for Monad | Yes |
| `ALCHEMY_API_KEY_ETHEREUM` | Alchemy API key for Ethereum | Yes |
| `ALCHEMY_API_KEY_BASE` | Alchemy API key for Base | Yes |
| `ALCHEMY_API_KEY_ABSTRACT` | Alchemy API key for Abstract | Yes |

### Development

#### Adding New Networks

1. Update the `Network` type in `src/types/index.ts`
2. Add RPC URL mapping in `src/lib/alchemy-utils.ts`
3. Update API routes to handle the new network
4. Add environment variable for the new network's API key

#### Database Schema Changes

1. Update `prisma/schema.prisma`
2. Run `yarn db:generate` to update Prisma client
3. Run `yarn db:push` or `yarn db:migrate` to apply changes

### Deployment

#### Production Database

For production, use a managed PostgreSQL service (e.g., Supabase, Railway, or AWS RDS) and update the `DATABASE_URL` accordingly.

#### Environment Variables

Ensure all environment variables are properly set in your production environment.

#### Build and Deploy

```bash
yarn build
yarn start
```

### Troubleshooting

#### Database Connection Issues

1. Ensure Docker is running
2. Check if the database container is healthy: `docker-compose ps`
3. Verify the `DATABASE_URL` in your `.env.local`
4. Check database logs: `yarn docker:logs`

#### Authentication Issues

1. Verify Discord OAuth configuration
2. Check `NEXTAUTH_URL` matches your deployment URL
3. Ensure `NEXTAUTH_SECRET` is properly set

#### API Key Issues

1. Verify all Alchemy API keys are valid
2. Check network-specific API key variables
3. Ensure the API keys have the necessary permissions
