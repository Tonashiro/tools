'use client'

import Link from "next/link"
import { useMediaQuery } from "react-responsive"
import { AuthButton } from "@/components/auth/auth-button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

export function Header() {
  const isMobile = useMediaQuery({ maxWidth: 767 })

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
            <span className="font-bold">Snapshoter</span>
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
            <Link 
              href="/about" 
              className="transition-colors hover:text-foreground/80"
            >
              About
            </Link>
          </nav>
        )}

        {/* Auth Button - Always visible */}
        <div className="ml-auto flex items-center space-x-2">
          <AuthButton />
        </div>
      </div>
    </header>
  )
} 