import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { AlchemyResponse, Network } from "@/lib/alchemy-utils";
import { getRpcUrl } from "@/lib/alchemy-utils";
import { calculateTokenCountFromAlchemy } from "@/lib/token-utils";

// Validation schema for the request
const querySchema = z.object({
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
  network: z
    .enum(['Monad', 'Ethereum', 'Base', 'Abstract'])
    .default('Monad'),
  withTokenBalances: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  pageKey: z.string().optional(),
});

// Function to get contract metadata
async function getContractMetadata(contractAddress: string, network: Network) {
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  const rpcUrl = getRpcUrl(network);

  if (!rpcUrl || !alchemyApiKey) {
    throw new Error("API configuration missing");
  }

  const alchemyUrl = `${rpcUrl}/nft/v3/${alchemyApiKey}/getContractMetadata`;
  const alchemyParams = new URLSearchParams({
    contractAddress,
  });

  const response = await fetch(`${alchemyUrl}?${alchemyParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Alchemy API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = querySchema.parse(queryParams);

    // Get Alchemy API key from environment
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

    // Build Alchemy API URL
    const alchemyUrl = `${rpcUrl}/nft/v3/${alchemyApiKey}/getOwnersForContract`;

    // Build query parameters for Alchemy
    const alchemyParams = new URLSearchParams({
      contractAddress: validatedParams.contractAddress,
      withTokenBalances: "true", // Always include token balances
    });

    if (validatedParams.pageKey) {
      alchemyParams.append("pageKey", validatedParams.pageKey);
    }

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

    const data: AlchemyResponse = await response.json();

    // Get contract metadata to determine token type
    let tokenType = 'ERC721'; // Default fallback
    try {
      const metadata = await getContractMetadata(validatedParams.contractAddress, validatedParams.network);
      tokenType = metadata.tokenType || 'ERC721';
    } catch (error) {
      console.warn('Failed to fetch contract metadata, using default ERC721:', error);
    }

    // Transform the data for better consumption
    const transformedOwners = data.owners.map((owner) => ({
      address: owner.ownerAddress,
      totalTokens: calculateTokenCountFromAlchemy(owner, tokenType),
      tokens: owner.tokenBalances.map((token) => ({
        tokenId: token.tokenId,
        balance: Number(token.balance), // Ensure balance is a number
      })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        owners: transformedOwners,
        totalOwners: transformedOwners.length,
        pageKey: data.pageKey,
        hasMore: !!data.pageKey,
      },
    });
  } catch (error) {
    console.error("NFT owners API error:", error);

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
