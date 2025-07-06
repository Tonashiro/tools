"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Package,
  Hash,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Crown,
  AlertTriangle,
  Shield,
  Twitter,
  MessageCircle,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { useNFTMetadata } from "@/hooks/use-nft-metadata";
import { useAllNFTOwners } from "@/hooks/use-nft-owners";
import type { Network } from "@/types/nft";

// Utility function to format wallet addresses responsively
const formatWalletAddress = (address: string, isMobile: boolean = false) => {
  if (!address) return "--";

  if (isMobile) {
    // Show first 4 and last 4 characters on mobile/tablet
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Show first 6 and last 4 characters on desktop
  return `${address.slice(0, 8)}...${address.slice(-4)}`;
};

interface NFTCollectionStatsProps {
  contractAddress: string;
  network?: Network;
}

export function NFTCollectionStats({
  contractAddress,
  network = "Monad",
}: NFTCollectionStatsProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>();

  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useNFTMetadata({
    contractAddress,
    network,
    enabled: !!contractAddress,
  });

  const { data: ownersData } = useAllNFTOwners({
    contractAddress,
    network,
    enabled: !!contractAddress,
  });

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "--";
    return num.toLocaleString();
  };

  const formatPrice = (
    price: number | null | undefined,
    currency: string = "MON"
  ) => {
    if (price === null || price === undefined) return "--";
    return `${price.toFixed(2)} ${currency}`;
  };

  const getTrendIcon = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;
    return value >= 0 ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    );
  };

  const magicEden = metadata?.magicEden;

  if (metadataLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Collection Stats
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm lg:text-base">
            Loading collection data...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
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
            <p className="text-destructive text-xs sm:text-sm">
              Error loading collection data
            </p>
          </div>
        </CardContent>
      </Card>
    );
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
            <p className="text-muted-foreground text-xs sm:text-sm">
              No collection data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          {/* Collection Image */}
          {magicEden?.image && (
            <div className="flex-shrink-0">
              <img
                src={magicEden.image}
                alt={`${magicEden.name || "Collection"} image`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border"
                onError={(e) => {
                  // Hide image on error
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Collection Stats
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm lg:text-base">
              {metadata.name || magicEden?.name || "NFT Collection"} (
              {metadata.symbol || magicEden?.symbol || "N/A"})
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 flex-1">
        {/* Collection Name */}
        {(metadata.name || magicEden?.name) && (
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              Collection Name
            </span>
            <span className="font-semibold text-xs sm:text-sm truncate ml-1 sm:ml-2">
              {magicEden?.name || metadata.name}
            </span>
          </div>
        )}

        {/* Collection Description */}
        {magicEden?.description && (
          <div className="flex justify-between items-start">
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Description
            </span>
            <span className="font-semibold text-xs sm:text-sm text-right ml-1 sm:ml-2 max-w-[60%] line-clamp-2">
              {magicEden.description}
            </span>
          </div>
        )}

        {/* Token Type */}
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
            Token Type
          </span>
          <span className="font-semibold text-xs sm:text-sm">
            {metadata.tokenType === "ERC721"
              ? "ERC-721"
              : metadata.tokenType === "ERC1155"
              ? "ERC-1155"
              : metadata.tokenType}
          </span>
        </div>

        {/* Total Supply */}
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            Total Supply
          </span>
          <span className="font-semibold text-xs sm:text-sm">
            {formatNumber(magicEden?.supply || metadata.totalSupply)}
          </span>
        </div>

        {/* Total Owners */}
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            Total Owners
          </span>
          <span className="font-semibold text-xs sm:text-sm">
            {formatNumber(magicEden?.ownerCount || ownersData?.totalOwners)}
          </span>
        </div>

        {/* Magic Eden Market Data */}
        {magicEden && (
          <>
            {/* Floor Price */}
            {magicEden.floorAsk && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  Floor Price
                </span>
                <span className="font-semibold text-xs sm:text-sm">
                  {formatPrice(
                    magicEden.floorAsk.price.amount.native,
                    magicEden.floorAsk.price.currency.symbol
                  )}
                </span>
              </div>
            )}

            {/* Items on Sale */}
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                On Sale
              </span>
              <span className="font-semibold text-xs sm:text-sm">
                {formatNumber(magicEden.onSaleCount)}
              </span>
            </div>

            {/* 24h Volume */}
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                24h Volume
              </span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xs sm:text-sm">
                  {formatNumber(magicEden.volume["1day"])}
                </span>
                {getTrendIcon(magicEden.volumeChange["1day"])}
              </div>
            </div>

            {/* 24h Floor Sales */}
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                24h Floor Sales
              </span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xs sm:text-sm">
                  {formatNumber(magicEden.floorSale["1day"])}
                </span>
                {getTrendIcon(magicEden.floorSaleChange["1day"])}
              </div>
            </div>

            {/* Rank */}
            {magicEden.rank["1day"] && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                  24h Rank
                </span>
                <span className="font-semibold text-xs sm:text-sm">
                  #{formatNumber(magicEden.rank["1day"])}
                </span>
              </div>
            )}
          </>
        )}

        {/* Verification Status */}
        {magicEden && (
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              Verification
            </span>
            <div className="flex gap-1">
              {magicEden.openseaVerificationStatus && (
                <Badge variant="secondary" className="text-xs">
                  OpenSea
                </Badge>
              )}
              {magicEden.magicedenVerificationStatus && (
                <Badge variant="secondary" className="text-xs">
                  Magic Eden
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Collection Flags */}
        {magicEden &&
          (magicEden.isMinting || magicEden.isSpam || magicEden.isNsfw) && (
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                Status
              </span>
              <div className="flex gap-1">
                {magicEden.isMinting && (
                  <Badge variant="default" className="text-xs bg-green-500">
                    Minting
                  </Badge>
                )}
                {magicEden.isSpam && (
                  <Badge variant="destructive" className="text-xs">
                    Spam
                  </Badge>
                )}
                {magicEden.isNsfw && (
                  <Badge variant="destructive" className="text-xs">
                    NSFW
                  </Badge>
                )}
              </div>
            </div>
          )}

        {/* Social Links */}
        {magicEden &&
          (magicEden.twitterUrl ||
            magicEden.discordUrl ||
            magicEden.externalUrl) && (
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                Links
              </span>
              <div className="flex gap-1">
                {magicEden.twitterUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(magicEden.twitterUrl!, "_blank")}
                  >
                    <Twitter className="h-3 w-3" />
                  </Button>
                )}
                {magicEden.discordUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(magicEden.discordUrl!, "_blank")}
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                )}
                {magicEden.externalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      window.open(magicEden.externalUrl!, "_blank")
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

        {/* Contract Deployer */}
        {metadata.contractDeployer && (
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
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
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleCopyAddress(metadata.contractDeployer!)}
              >
                {copiedAddress === metadata.contractDeployer ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
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
            <span className="font-semibold text-xs sm:text-sm">
              {formatNumber(metadata.deployedBlockNumber)}
            </span>
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
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleCopyAddress(contractAddress)}
            >
              {copiedAddress === contractAddress ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
