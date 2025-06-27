'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useAllNFTOwners } from '@/hooks/use-nft-owners'
import { useNFTMetadata } from '@/hooks/use-nft-metadata'
import { Users, ExternalLink, Copy, Check, Download, ChevronDown, Search, X, ArrowUpDown } from 'lucide-react'
import type { NFTOwner } from '@/types/nft'
import { downloadCSV, downloadJSON, downloadAirdropList } from '@/utils/csv-export'
import { calculateTokenCount } from '@/lib/token-utils'

interface NFTOwnersListProps {
  contractAddress: string
}

const PAGE_SIZE_OPTIONS = [25, 50, 100]

type SortOption = 'tokenCount-desc' | 'tokenCount-asc' | 'address-asc' | 'address-desc'

// Utility function to format wallet addresses responsively
const formatWalletAddress = (address: string, isMobile: boolean = false) => {
  if (!address) return '--'
  
  if (isMobile) {
    // Show first 4 and last 4 characters on mobile/tablet
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
  // Show first 6 and last 4 characters on desktop
  return `${address.slice(0, 8)}...${address.slice(-4)}`
}

export function NFTOwnersList({ contractAddress }: NFTOwnersListProps) {
  const [pageSize, setPageSize] = useState<number>(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('tokenCount-desc')

  const { data, isLoading, error } = useAllNFTOwners({
    contractAddress,
    enabled: !!contractAddress,
  })

  const { data: metadata } = useNFTMetadata({
    contractAddress,
    enabled: !!contractAddress,
  })

  const tokenType = metadata?.tokenType || 'ERC721'
  const isERC721 = tokenType === 'ERC721'

  // Client-side pagination for the results we receive
  const paginatedOwners = useMemo(() => {
    if (!data?.owners) return []
    
    // Filter owners based on search query
    let filteredOwners = data.owners
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filteredOwners = data.owners.filter(owner => 
        owner.address.toLowerCase().includes(query)
      )
    }
    
    // Sort owners based on sort option
    const sortedOwners = [...filteredOwners].sort((a, b) => {
      const aTokenCount = calculateTokenCount(a, tokenType)
      const bTokenCount = calculateTokenCount(b, tokenType)
      
      switch (sortBy) {
        case 'tokenCount-desc':
          return bTokenCount - aTokenCount
        case 'tokenCount-asc':
          return aTokenCount - bTokenCount
        case 'address-asc':
          return a.address.toLowerCase().localeCompare(b.address.toLowerCase())
        case 'address-desc':
          return b.address.toLowerCase().localeCompare(a.address.toLowerCase())
        default:
          return bTokenCount - aTokenCount
      }
    })
    
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    
    return sortedOwners.slice(startIndex, endIndex)
  }, [data?.owners, currentPage, pageSize, searchQuery, sortBy, tokenType])

  // Calculate pagination info based on filtered data
  const filteredOwners = useMemo(() => {
    if (!data?.owners) return []
    
    let filtered = data.owners
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = data.owners.filter(owner => 
        owner.address.toLowerCase().includes(query)
      )
    }
    
    // Sort owners based on sort option
    return [...filtered].sort((a, b) => {
      const aTokenCount = calculateTokenCount(a, tokenType)
      const bTokenCount = calculateTokenCount(b, tokenType)
      
      switch (sortBy) {
        case 'tokenCount-desc':
          return bTokenCount - aTokenCount
        case 'tokenCount-asc':
          return aTokenCount - bTokenCount
        case 'address-asc':
          return a.address.toLowerCase().localeCompare(b.address.toLowerCase())
        case 'address-desc':
          return b.address.toLowerCase().localeCompare(a.address.toLowerCase())
        default:
          return bTokenCount - aTokenCount
      }
    })
  }, [data?.owners, searchQuery, sortBy, tokenType])

  const totalOwners = filteredOwners.length
  const totalPages = Math.ceil(totalOwners / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(startIndex + pageSize - 1, totalOwners)

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize, 10)
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const clearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort as SortOption)
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handleExport = async (format: 'csv' | 'json' | 'airdrop-txt' | 'airdrop-json') => {
    if (!contractAddress) return
    
    setIsExporting(true)
    try {
      if (format === 'csv') {
        await downloadCSV(contractAddress)
      } else if (format === 'json') {
        await downloadJSON(contractAddress)
      } else if (format === 'airdrop-txt') {
        await downloadAirdropList(contractAddress, 'txt')
      } else if (format === 'airdrop-json') {
        await downloadAirdropList(contractAddress, 'json')
      }
    } catch (error) {
      console.error('Export failed:', error)
      // You could add a toast notification here
    } finally {
      setIsExporting(false)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, last page, and pages around current
      pages.push(1)
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      if (start > 2) {
        pages.push('ellipsis-start')
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (end < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            NFT Owners
          </CardTitle>
          <CardDescription>Loading owners data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Fetching complete collection data...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This may take a moment for large collections
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            NFT Owners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Error loading NFT owners</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.owners || data.owners.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            NFT Owners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No owners found for this collection.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              NFT Owners ({totalOwners})
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Showing {startIndex}-{endIndex} of {totalOwners} owners
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('airdrop-txt')}>
                  Airdrop List (TXT)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('airdrop-json')}>
                  Airdrop List (JSON)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sort and Page Size Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Sort:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokenCount-desc">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Most Tokens First</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="tokenCount-asc">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Least Tokens First</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="address-asc">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Address A-Z</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="address-desc">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Address Z-A</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Show:</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-20 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Section */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by wallet address..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 text-sm sm:text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Found {totalOwners} result{totalOwners !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {paginatedOwners.length === 0 && searchQuery ? (
            <div className="text-center py-6 sm:py-8">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-muted-foreground mb-2 text-sm sm:text-base">
                No wallets found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Try a different search term or check the spelling
              </p>
            </div>
          ) : paginatedOwners.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-muted-foreground text-sm sm:text-base">
                No owners found for this collection.
              </p>
            </div>
          ) : (
            paginatedOwners.map((owner: NFTOwner, index: number) => (
              <div key={owner.address} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                {/* Owner Rank */}
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                  {startIndex + index}
                </div>

                {/* Owner Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <p className="font-mono text-xs sm:text-sm truncate">
                      <span className="block sm:hidden">
                        {formatWalletAddress(owner.address, true)}
                      </span>
                      <span className="hidden sm:block">
                        {formatWalletAddress(owner.address, false)}
                      </span>
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyAddress(owner.address)}
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                      >
                        {copiedAddress === owner.address ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                      >
                        <a
                          href={`https://testnet.monadexplorer.com/address/${owner.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {calculateTokenCount(owner, tokenType)} {isERC721 ? 'unique' : 'total'} token{calculateTokenCount(owner, tokenType) !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Token Count */}
                <div className="flex-shrink-0 text-right">
                  <p className="font-semibold text-sm sm:text-base">{calculateTokenCount(owner, tokenType)}</p>
                  <p className="text-xs text-muted-foreground">{isERC721 ? 'tokens' : 'tokens'}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Proper Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <div className="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              {searchQuery ? (
                <>
                  Showing {startIndex}-{endIndex} of {totalOwners} matching owners
                </>
              ) : (
                <>
                  Showing {startIndex}-{endIndex} of {totalOwners} owners
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 