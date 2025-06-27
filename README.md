# NFT Snapshoter - Monad NFT Collection Analytics Tool

A powerful Next.js 15 application for analyzing NFT collections on the Monad blockchain. Built with modern web technologies and designed for comprehensive NFT holder analysis and data export.

## 🚀 Features

- **NFT Collection Analysis** - Comprehensive analysis of NFT collections including ownership distribution and holder statistics
- **Holder Discovery** - Search and analyze NFT holders with advanced filtering and sorting capabilities
- **Data Export** - Export snapshot data in multiple formats (CSV, JSON, Airdrop lists)
- **Collection Statistics** - View detailed collection stats including total supply, unique holders, and token types
- **Smart Search** - Real-time search through thousands of holders with responsive pagination
- **Quick Actions** - Copy addresses, explore on blockchain, and access external links seamlessly
- **Responsive Design** - Fully responsive interface optimized for mobile, tablet, and desktop
- **ERC-721 & ERC-1155 Support** - Handles both token standards with accurate counting logic

## 🛠️ Tech Stack

- **Next.js 15** - Latest version with App Router
- **TypeScript** - Full type safety throughout the application
- **TanStack Query** - Powerful client-side data fetching and caching
- **Alchemy NFT API** - Professional NFT data and analytics
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Monad Blockchain** - Native support for Monad NFT collections

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── nft/          # NFT-related endpoints
│   │       ├── export/   # Data export endpoints
│   │       ├── metadata/ # Collection metadata
│   │       └── owners/   # NFT owners data
│   ├── nft-snapshoter/   # Main NFT analysis page
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
   ALCHEMY_NETWORK=monad-testnet
   
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
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
- `ALCHEMY_NETWORK` - Monad network configuration
- `NEXT_PUBLIC_API_URL` - API base URL

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
