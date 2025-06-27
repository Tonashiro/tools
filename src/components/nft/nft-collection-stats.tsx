'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useNFTMetadata } from '@/hooks/use-nft-metadata'
import { useAllNFTOwners } from '@/hooks/use-nft-owners'
import { BarChart3, Users, Package, Hash, Calendar, User, ExternalLink, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NFTCollectionStatsProps {
  contractAddress: string
}

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

export function NFTCollectionStats({ contractAddress }: NFTCollectionStatsProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  
  const { data: metadata, isLoading: metadataLoading, error: metadataError } = useNFTMetadata({
    contractAddress,
    enabled: !!contractAddress,
  })

  const { data: ownersData, isLoading: ownersLoading } = useAllNFTOwners({
    contractAddress,
    enabled: !!contractAddress,
  })

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '--'
    return num.toLocaleString()
  }

  if (metadataLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Collection Stats
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm lg:text-base">Loading collection data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 flex-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (metadataError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Collection Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-center py-3 sm:py-4">
            <p className="text-destructive text-xs sm:text-sm">Error loading collection data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metadata) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Collection Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-center py-3 sm:py-4">
            <p className="text-muted-foreground text-xs sm:text-sm">No collection data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
          Collection Stats
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm lg:text-base">
          {metadata.name || 'NFT Collection'} ({metadata.symbol || 'N/A'})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 flex-1">
        {/* Collection Name */}
        {metadata.name && (
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              Collection Name
            </span>
            <span className="font-semibold text-xs sm:text-sm truncate ml-1 sm:ml-2">{metadata.name}</span>
          </div>
        )}

        {/* Token Type */}
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
            Token Type
          </span>
          <span className="font-semibold text-xs sm:text-sm">
            {metadata.tokenType === 'ERC721' ? 'ERC-721' : 
             metadata.tokenType === 'ERC1155' ? 'ERC-1155' : 
             metadata.tokenType}
          </span>
        </div>

        {/* Total Supply */}
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            Total Supply
          </span>
          <span className="font-semibold text-xs sm:text-sm">{formatNumber(metadata.totalSupply)}</span>
        </div>

        {/* Unique Holders */}
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            Unique Holders
          </span>
          <span className="font-semibold text-xs sm:text-sm">
            {ownersLoading ? '...' : formatNumber(ownersData?.totalOwners)}
          </span>
        </div>

        {/* Contract Deployer */}
        {metadata.contractDeployer && (
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              Deployer
            </span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs sm:text-sm">
                <span className="block sm:hidden">
                  {formatWalletAddress(metadata.contractDeployer, true)}
                </span>
                <span className="hidden sm:block">
                  {formatWalletAddress(metadata.contractDeployer, false)}
                </span>
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyAddress(metadata.contractDeployer!)}
                  className="h-4 w-4 sm:h-5 sm:w-5 p-0"
                >
                  {copiedAddress === metadata.contractDeployer ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-4 w-4 sm:h-5 sm:w-5 p-0"
                >
                  <a
                    href={`https://testnet.monadexplorer.com/address/${metadata.contractDeployer}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Deployed Block */}
        {metadata.deployedBlockNumber && (
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Deployed Block
            </span>
            <span className="font-semibold text-xs sm:text-sm">{formatNumber(metadata.deployedBlockNumber)}</span>
          </div>
        )}

        {/* Contract Address */}
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
            Contract
          </span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs sm:text-sm">
              <span className="block sm:hidden">
                {formatWalletAddress(contractAddress, true)}
              </span>
              <span className="hidden sm:block">
                {formatWalletAddress(contractAddress, false)}
              </span>
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyAddress(contractAddress)}
                className="h-4 w-4 sm:h-5 sm:w-5 p-0"
              >
                {copiedAddress === contractAddress ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-4 w-4 sm:h-5 sm:w-5 p-0"
              >
                <a
                  href={`https://testnet.monadexplorer.com/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 