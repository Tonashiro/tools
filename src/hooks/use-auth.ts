"use client";

import { useSession, signOut } from "next-auth/react";

// Hook to get current user session
export function useAuth() {
  const { data: session, status, update } = useSession();

  const userData = session?.user;
  const isAuthenticated = !!userData?.id && status === "authenticated";

  const user = {
    id: userData?.id || "",
    discord_id: userData?.discordId || "",
    username: userData?.username || "",
    avatar: userData?.avatar || null,
  };

  return {
    user,
    isLoading: status === "loading",
    error: status === "unauthenticated" ? new Error("Not authenticated") : null,
    refetch: update,
    isAuthenticated,
  };
}

export function useLogout() {
  return {
    mutateAsync: async () => {
      document.cookie = "auth-token=; Max-Age=0; path=/; domain=localhost";
      document.cookie = "auth-token=; Max-Age=0; path=/";

      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    },
    isPending: false,
  };
}
