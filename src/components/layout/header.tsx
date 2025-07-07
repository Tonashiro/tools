"use client";

import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { AuthButton } from "@/components/auth/auth-button";
import { useAuth } from "@/hooks/use-auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ChevronDown,
  ImageIcon,
  Send,
  Gift,
  MessageSquare,
} from "lucide-react";

export function Header() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-[5%]">
        {/* Mobile Menu Button */}
        {isMobile && (
          <SidebarTrigger className="mr-3 -ml-1">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </SidebarTrigger>
        )}

        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Nadtools</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/my-snapshots"
                className="transition-colors hover:text-foreground/80 flex items-center gap-1"
              >
                My Snapshots
              </Link>
            )}

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 cursor-pointer">
                Tools
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56"
                sideOffset={8}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/nft-snapshotter"
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    NFT Snapshoter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/nft-messenger"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    NFT Messenger
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/bulk-nft-transfer"
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Bulk NFT Transfer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/token-airdrop"
                    className="flex items-center gap-2"
                  >
                    <Gift className="h-4 w-4" />
                    Token Airdrop
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}

        {/* Auth Button and Wallet - Always visible */}
        <div className="ml-auto flex items-center space-x-2 gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
