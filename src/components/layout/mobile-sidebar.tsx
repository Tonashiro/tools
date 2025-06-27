"use client";

import { useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "@/hooks/use-auth";
import { getDiscordAvatarUrl } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Home, User, Settings } from "lucide-react";

function AvatarWithSkeleton({ 
  src, 
  alt, 
  className 
}: { 
  src: string
  alt: string
  className: string 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center text-xs font-medium`}>
        {alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <Skeleton className={`${className} absolute`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </>
  )
}

interface MobileSidebarProps {
  children: React.ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const { data } = useAuth();
  const user = data?.data?.user;
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // On desktop, just render children without sidebar
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <span className="font-bold text-lg">Snapshoter</span>
            </div>
          </SidebarHeader>

          {/* User Profile Section */}
          {user?.isAuthenticated && (
            <div className="px-3 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AvatarWithSkeleton
                    src={getDiscordAvatarUrl(user.discord_id, user.avatar)}
                    alt={user.username}
                    className="w-10 h-10 rounded-full border-2 border-primary/20"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {user.username}
                  </h3>
                  <p className="text-xs text-muted-foreground">Discord User</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/about">
                  <User className="h-4 w-4" />
                  <span>About</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
} 