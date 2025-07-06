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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Settings,
  ImageIcon,
  Coins,
  Send,
  Gift,
  MessageSquare,
  ChevronRight,
  BookOpen,
} from "lucide-react";

function AvatarWithSkeleton({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`${className} bg-muted flex items-center justify-center text-xs font-medium`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <>
      {isLoading && <Skeleton className={`${className} absolute`} />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </>
  );
}

interface MobileSidebarProps {
  children: React.ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [toolsOpen, setToolsOpen] = useState(false);

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
              <span className="font-bold text-lg">Nadtools</span>
            </div>
          </SidebarHeader>

          {/* User Profile Section */}
          {isAuthenticated && user && (
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

            {isAuthenticated && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/my-snapshots">
                    <BookOpen className="h-4 w-4" />
                    <span>My Snapshots</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {/* Tools Section */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setToolsOpen(!toolsOpen)}
                className="w-full"
              >
                <Settings className="h-4 w-4" />
                <span>Tools</span>
                <ChevronRight
                  className={`h-4 w-4 ml-auto transition-transform ${
                    toolsOpen ? "rotate-90" : ""
                  }`}
                />
              </SidebarMenuButton>

              {toolsOpen && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/nft-snapshotter">
                        <ImageIcon className="h-4 w-4" />
                        <span>NFT Snapshoter</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/token-snapshoter">
                        <Coins className="h-4 w-4" />
                        <span>Token Snapshoter</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/bulk-nft-transfer">
                        <Send className="h-4 w-4" />
                        <span>Bulk NFT Transfer</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/token-airdrop">
                        <Gift className="h-4 w-4" />
                        <span>Token Airdrop</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/nft-messenger">
                        <MessageSquare className="h-4 w-4" />
                        <span>NFT Messenger</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}
