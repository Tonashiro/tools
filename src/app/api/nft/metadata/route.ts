import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRpcUrl } from "@/lib/alchemy-utils";

// Validation schema for the request
const querySchema = z.object({
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
  network: z
    .enum(['Monad', 'Ethereum', 'Base', 'Abstract'])
    .default('Monad'),
});

// Types for Alchemy API response
interface OpenSeaMetadata {
  floorPrice: number;
  collectionName: string;
  safelistRequestStatus: string;
  imageUrl: string;
  description: string;
  externalUrl: string;
  twitterUsername: string;
  discordUrl: string;
  lastIngestedAt: string;
}

interface AlchemyContractMetadataResponse {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: "ERC721" | "ERC1155" | "NO_SUPPORTED_NFT_STANDARD" | "NOT_A_CONTRACT";
  contractDeployer: string;
  deployedBlockNumber: number;
  openseaMetadata: OpenSeaMetadata | null;
}

// Function to fetch Magic Eden data
async function fetchMagicEdenData(contractAddress: string, network: string) {
  try {
    const magicEdenApiKey = process.env.MAGIC_EDEN_API_KEY;
    
    if (!magicEdenApiKey) {
      console.warn("Magic Eden API key not configured, skipping Magic Eden data");
      return null;
    }

    // Map network to Magic Eden chain
    const getMagicEdenChain = (network: string): string => {
      switch (network) {
        case 'Monad':
          return 'monad-testnet';
        case 'Ethereum':
          return 'ethereum';
        case 'Base':
          return 'base';
        default:
          return 'monad-testnet';
      }
    };

    const chain = getMagicEdenChain(network);
    const magicEdenUrl = `https://api-mainnet.magiceden.dev/v3/rtp/${chain}/collections/v7`;
    const magicEdenParams = new URLSearchParams({
      contract: contractAddress,
    });

    const response = await fetch(`${magicEdenUrl}?${magicEdenParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${magicEdenApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Magic Eden API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    // Find the collection that matches our contract address
    const collection = data.collections.find(
      (col: { primaryContract: string }) => col.primaryContract.toLowerCase() === contractAddress.toLowerCase()
    );

    if (!collection) {
      console.warn("Collection not found on Magic Eden");
      return null;
    }

    // Transform the data for better consumption
    return {
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
      
      // Mint stages
      mintStages: collection.mintStages,
    };
  } catch (error) {
    console.warn("Error fetching Magic Eden data:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = querySchema.parse(queryParams);

    // Get environment variables
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    const rpcUrl = getRpcUrl(validatedParams.network);

    if (!rpcUrl) {
      return NextResponse.json(
        { error: `${validatedParams.network} RPC URL not configured` },
        { status: 500 }
      );
    }

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: "Alchemy API key not configured" },
        { status: 500 }
      );
    }

    // Fetch both Alchemy and Magic Eden data in parallel
    const [alchemyResponse, magicEdenData] = await Promise.allSettled([
      // Alchemy API call
      (async () => {
        const alchemyUrl = `${rpcUrl}/nft/v3/${alchemyApiKey}/getContractMetadata`;
        const alchemyParams = new URLSearchParams({
          contractAddress: validatedParams.contractAddress,
        });
        const response = await fetch(`${alchemyUrl}?${alchemyParams.toString()}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Alchemy API error:", response.status, errorText);
          throw new Error(`Alchemy API error: ${response.status}`);
        }
        
        return response.json();
      })(),
      
      // Magic Eden API call
      fetchMagicEdenData(validatedParams.contractAddress, validatedParams.network)
    ]);

    // Handle Alchemy response
    if (alchemyResponse.status === 'rejected') {
      console.error("Alchemy API failed:", alchemyResponse.reason);
      return NextResponse.json(
        { error: "Failed to fetch collection metadata" },
        { status: 500 }
      );
    }

    const alchemyData: AlchemyContractMetadataResponse = alchemyResponse.value;

    // Handle Magic Eden response
    const magicEden = magicEdenData.status === 'fulfilled' ? magicEdenData.value : null;

    // Transform the Alchemy data for better consumption
    const transformedMetadata = {
      address: alchemyData.address,
      name: alchemyData.name,
      symbol: alchemyData.symbol,
      totalSupply: alchemyData.totalSupply ? parseInt(alchemyData.totalSupply, 10) : null,
      tokenType: alchemyData.tokenType,
      contractDeployer: alchemyData.contractDeployer,
      deployedBlockNumber: alchemyData.deployedBlockNumber,
      // Include Magic Eden data if available
      magicEden,
    };

    return NextResponse.json({
      success: true,
      data: transformedMetadata,
    });

  } catch (error) {
    console.error("NFT metadata API error:", error);

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