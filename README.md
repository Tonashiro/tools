# Snapshoter - Modern Next.js 15 Application

A clean, well-structured Next.js 15 application built with best practices, featuring semantic HTML, modern UI components, and Discord authentication.

## 🚀 Features

- **Next.js 15** - Latest version with App Router
- **TypeScript** - Full type safety throughout the application
- **Discord OAuth** - Secure authentication with Discord
- **TanStack Query** - Powerful client-side data fetching and caching
- **Server Components** - Server-side rendering and data fetching
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Semantic HTML** - Proper HTML structure and accessibility
- **Clean Architecture** - Well-organized folder structure

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── discord/   # Discord OAuth routes
│   │   │   ├── session/   # Session management
│   │   │   └── logout/    # Logout endpoint
│   │   └── hello/         # Example API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   │   ├── discord-login-button.tsx
│   │   ├── user-profile.tsx
│   │   └── user-welcome.tsx
│   ├── layout/           # Layout components
│   │   ├── header.tsx    # Site header
│   │   └── footer.tsx    # Site footer
│   ├── providers/        # Context providers
│   │   └── query-provider.tsx  # TanStack Query provider
│   └── ui/               # UI components
│       └── button.tsx    # Button component
├── hooks/                # Custom hooks
│   ├── use-auth.ts       # Authentication hooks
│   └── use-queries.ts    # TanStack Query hooks
├── lib/                  # Utility libraries
│   ├── api.ts           # API client functions
│   ├── auth.ts          # Authentication utilities
│   ├── query-client.ts  # TanStack Query configuration
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   └── index.ts         # Common types
└── utils/               # Utility functions
    └── constants.ts     # Application constants
```

## 🛠️ Data Management

### Server-Side Data Fetching
- **Server Components**: Fetch data on the server during page load
- **API Routes**: RESTful API endpoints for your application needs
- **Server Functions**: Reusable server-side data fetching functions

### Client-Side Data Fetching
- **TanStack Query**: Powerful caching, background updates, and optimistic updates
- **Custom Hooks**: Reusable query and mutation hooks
- **Error Handling**: Comprehensive error handling and retry logic

## 🔐 Discord Authentication

The application includes a complete Discord OAuth flow:

### Features
- **Secure OAuth Flow**: Uses Discord's OAuth 2.0 for authentication
- **JWT Tokens**: Secure session management with JSON Web Tokens
- **HTTP-Only Cookies**: Secure cookie storage for authentication tokens
- **Automatic Session Persistence**: Sessions persist across browser refreshes
- **User Profile Display**: Shows Discord user information and avatar

### Setup Instructions

1. **Create a Discord Application**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to OAuth2 settings
   - Add redirect URI: `http://localhost:3000/api/auth/discord/callback`

2. **Environment Variables**:
   Create a `.env.local` file with:
   ```env
   # Discord OAuth Configuration
   DISCORD_CLIENT_ID=your_discord_client_id_here
   DISCORD_CLIENT_SECRET=your_discord_client_secret_here
   DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
   DISCORD_RETURN_TO=http://localhost:3000/
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here_make_it_long_and_random
   
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (see Discord Authentication section above)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Endpoints

### Authentication API
- `GET /api/auth/discord` - Initiate Discord OAuth flow
- `GET /api/auth/discord/callback` - Discord OAuth callback
- `GET /api/auth/session` - Get current user session
- `POST /api/auth/logout` - Logout user

### Example API
- `GET /api/hello` - Simple hello endpoint
- `POST /api/hello` - Echo endpoint

## 🎯 Key Concepts

### Server vs Client Components
- **Server Components**: Fetch data on the server, no JavaScript sent to client
- **Client Components**: Interactive components with client-side state and effects

### Authentication Flow
1. **OAuth Initiation**: User clicks "Login with Discord"
2. **Discord Authorization**: User authorizes on Discord
3. **Token Exchange**: Server exchanges code for Discord token
4. **User Data Fetch**: Server fetches user information from Discord
5. **JWT Generation**: Server creates JWT with user data
6. **Cookie Storage**: JWT stored in HTTP-only cookie
7. **Session Persistence**: Cookie automatically sent with requests

### Data Fetching Strategy
1. **Initial Load**: Server-side data fetching for SEO and performance
2. **Interactions**: Client-side data fetching with TanStack Query for real-time updates
3. **Caching**: Intelligent caching to minimize API calls

### Type Safety
- Full TypeScript support throughout the application
- Shared types between client and server
- API response type definitions

## 🎨 UI Components

Built with Radix UI primitives and styled with Tailwind CSS:
- Accessible by default
- Customizable through CSS classes
- Consistent design system

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
- `DISCORD_CLIENT_ID` - Discord application client ID
- `DISCORD_CLIENT_SECRET` - Discord application client secret
- `DISCORD_REDIRECT_URI` - OAuth redirect URI
- `DISCORD_RETURN_TO` - Return URL after authentication
- `JWT_SECRET` - Secret key for JWT signing
- `NEXT_PUBLIC_API_URL` - API base URL

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)
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
