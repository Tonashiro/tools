import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for the request
const querySchema = z.object({
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
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

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = querySchema.parse(queryParams);

    // Get environment variables
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    const monadRpcUrl = process.env.MONAD_RPC_URL;

    if (!monadRpcUrl) {
      return NextResponse.json(
        { error: "Monad RPC URL not configured" },
        { status: 500 }
      );
    }

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: "Alchemy API key not configured" },
        { status: 500 }
      );
    }

    // Build Alchemy API URL for contract metadata
    const alchemyUrl = `${monadRpcUrl}/nft/v3/${alchemyApiKey}/getContractMetadata`;

    // Build query parameters for Alchemy
    const alchemyParams = new URLSearchParams({
      contractAddress: validatedParams.contractAddress,
    });

    // Make request to Alchemy API
    const response = await fetch(`${alchemyUrl}?${alchemyParams.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Alchemy API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Alchemy API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: AlchemyContractMetadataResponse = await response.json();

    // Transform the data for better consumption
    const transformedMetadata = {
      address: data.address,
      name: data.name,
      symbol: data.symbol,
      totalSupply: data.totalSupply ? parseInt(data.totalSupply, 10) : null,
      tokenType: data.tokenType,
      contractDeployer: data.contractDeployer,
      deployedBlockNumber: data.deployedBlockNumber,
      // Exclude OpenSea metadata as requested
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