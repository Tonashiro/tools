// Discord API types
export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number | null;
  global_name: string | null;
  avatar_decoration: string | null;
  display_name: string | null;
  display_name_global: string | null;
}

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

// JWT payload types
export interface JWTPayload {
  id: string;
  discord_id: string;
  username: string;
  avatar: string | null;
  iat: number;
  exp: number;
}

// Session types
export interface UserSession {
  id: string;
  discord_id: string;
  name: string;
  image: string | null;
  isAuthenticated: boolean;
}

// API response types
export interface AuthResponse {
  success: boolean;
  user?: UserSession;
  error?: string;
  message?: string;
}

// Environment variables validation
export interface DiscordConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  returnTo: string;
}
