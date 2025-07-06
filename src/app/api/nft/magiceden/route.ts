import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for the request
const querySchema = z.object({
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
  chain: z
    .enum(['monad-testnet', 'monad-mainnet', 'ethereum', 'base'])
    .default('monad-testnet'),
});

// Types for Magic Eden API response
interface MagicEdenCollection {
  chainId: number;
  id: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  symbol: string | null;
  contractDeployedAt: string | null;
  image: string | null;
  banner: string | null;
  twitterUrl: string | null;
  discordUrl: string | null;
  externalUrl: string | null;
  twitterUsername: string | null;
  openseaVerificationStatus: string | null;
  magicedenVerificationStatus: string | null;
  description: string | null;
  metadataDisabled: boolean;
  isSpam: boolean;
  isNsfw: boolean;
  isMinting: boolean;
  sampleImages: string[];
  tokenCount: string;
  onSaleCount: string;
  primaryContract: string;
  tokenSetId: string;
  creator: string | null;
  isSharedContract: boolean;
  royalties: {
    recipient: string;
    breakdown: Array<{
      bps: number;
      recipient: string;
    }>;
    bps: number;
  };
  allRoyalties: {
    eip2981: Array<{
      bps: number;
      recipient: string;
    }>;
    onchain: Array<{
      bps: number;
      recipient: string;
    }>;
  };
  floorAsk: {
    id: string;
    sourceDomain: string;
    price: {
      currency: {
        contract: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      amount: {
        raw: string;
        decimal: number;
        usd: number | null;
        native: number;
      };
    };
    maker: string;
    validFrom: number;
    validUntil: number;
    token: {
      contract: string;
      tokenId: string;
      name: string;
      image: string;
    };
  } | null;
  topBid: {
    id: string;
    sourceDomain: string;
    price: {
      currency: {
        contract: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      amount: {
        raw: string;
        decimal: number;
        usd: number | null;
        native: number;
      };
      netAmount: {
        raw: string;
        decimal: number;
        usd: number | null;
        native: number;
      };
    };
    maker: string;
    validFrom: number;
    validUntil: number;
  } | null;
  rank: {
    "1day": number | null;
    "7day": number | null;
    "30day": number | null;
    allTime: number | null;
  };
  volume: {
    "1day": number;
    "7day": number;
    "30day": number;
    allTime: number;
  };
  volumeChange: {
    "1day": number;
    "7day": number;
    "30day": number;
  };
  floorSale: {
    "1day": number;
    "7day": number;
    "30day": number;
  };
  floorSaleChange: {
    "1day": number;
    "7day": number;
    "30day": number;
  };
  collectionBidSupported: boolean;
  ownerCount: number;
  contractKind: string;
  mintedTimestamp: number;
  lastMintTimestamp: number;
  mintStages: Array<{
    stage: string;
    price: string;
    startTime: number;
    endTime: number;
    maxMintsPerWallet: number;
    maxMintsPerTransaction: number;
  }>;
  supply: string;
  remainingSupply: string;
}

interface MagicEdenResponse {
  collections: MagicEdenCollection[];
}

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = querySchema.parse(queryParams);

    // Get Magic Eden API key from environment
    const magicEdenApiKey = process.env.MAGIC_EDEN_API_KEY;

    if (!magicEdenApiKey) {
      return NextResponse.json(
        { error: "Magic Eden API key not configured" },
        { status: 500 }
      );
    }

    // Build Magic Eden API URL
    const magicEdenUrl = `https://api-mainnet.magiceden.dev/v3/rtp/${validatedParams.chain}/collections/v7`;

    // Build query parameters for Magic Eden
    const magicEdenParams = new URLSearchParams({
      contract: validatedParams.contractAddress,
    });

    // Make request to Magic Eden API
    const response = await fetch(`${magicEdenUrl}?${magicEdenParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${magicEdenApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Magic Eden API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Magic Eden API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: MagicEdenResponse = await response.json();

    // Find the collection that matches our contract address
    const collection = data.collections.find(
      col => col.primaryContract.toLowerCase() === validatedParams.contractAddress.toLowerCase()
    );

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found on Magic Eden" },
        { status: 404 }
      );
    }

    // Transform the data for better consumption
    const transformedData = {
      // Basic collection info
      name: collection.name,
      symbol: collection.symbol,
      description: collection.description,
      image: collection.image,
      banner: collection.banner,
      externalUrl: collection.externalUrl,
      twitterUrl: collection.twitterUrl,
      discordUrl: collection.discordUrl,
      twitterUsername: collection.twitterUsername,
      
      // Contract info
      contractAddress: collection.primaryContract,
      contractKind: collection.contractKind,
      creator: collection.creator,
      isSharedContract: collection.isSharedContract,
      
      // Supply and token info
      tokenCount: parseInt(collection.tokenCount, 10),
      supply: parseInt(collection.supply, 10),
      remainingSupply: parseInt(collection.remainingSupply, 10),
      onSaleCount: parseInt(collection.onSaleCount, 10),
      ownerCount: collection.ownerCount,
      
      // Timestamps
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      contractDeployedAt: collection.contractDeployedAt,
      mintedTimestamp: collection.mintedTimestamp,
      lastMintTimestamp: collection.lastMintTimestamp,
      
      // Verification status
      openseaVerificationStatus: collection.openseaVerificationStatus,
      magicedenVerificationStatus: collection.magicedenVerificationStatus,
      
      // Collection flags
      isSpam: collection.isSpam,
      isNsfw: collection.isNsfw,
      isMinting: collection.isMinting,
      metadataDisabled: collection.metadataDisabled,
      collectionBidSupported: collection.collectionBidSupported,
      
      // Sample images
      sampleImages: collection.sampleImages,
      
      // Royalties
      royalties: collection.royalties,
      allRoyalties: collection.allRoyalties,
      
      // Market data
      floorAsk: collection.floorAsk,
      topBid: collection.topBid,
      
      // Rankings
      rank: collection.rank,
      
      // Volume data
      volume: collection.volume,
      volumeChange: collection.volumeChange,
      
      // Floor sale data
      floorSale: collection.floorSale,
      floorSaleChange: collection.floorSaleChange,
    };

    return NextResponse.json({
      success: true,
      data: transformedData,
    });

  } catch (error) {
    console.error("Magic Eden API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 