import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId: string;
      username: string;
      avatar?: string | null;
    };
  }

  interface User {
    id: string;
    discordId: string;
    username: string;
    avatar?: string | null;
  }

  interface Profile {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account?.provider === "discord" && profile) {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { discordId: profile.id },
          });

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                discordId: profile.id,
                username:
                  profile.username || profile.global_name || "Unknown User",
                avatar: profile.avatar,
              },
            });
          } else {
            // Update existing user's info
            await prisma.user.update({
              where: { discordId: profile.id },
              data: {
                username:
                  profile.username ||
                  profile.global_name ||
                  existingUser.username,
                avatar: profile.avatar,
              },
            });
          }
        } catch (error) {
          console.error("Error saving user to database:", error);
          return false;
        }
      }
      return true;
    },
    jwt: async ({ token, account, profile }) => {
      if (account?.provider === "discord" && profile) {
        // Get user from database
        const dbUser = await prisma.user.findUnique({
          where: { discordId: profile.id },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.discordId = dbUser.discordId;
          token.username = dbUser.username;
          token.avatar = dbUser.avatar;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          id: token.id as string,
          discordId: token.discordId as string,
          username: token.username as string,
          avatar: token.avatar as string | null,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
