import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchAllOwners, getRpcUrl } from "@/lib/alchemy-utils";
import type { Network } from "@/lib/alchemy-utils";
import { calculateTokenCountFromAlchemy } from "@/lib/token-utils";

// Validation schema for the request
const querySchema = z.object({
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
  network: z
    .enum(['Monad', 'Ethereum', 'Base', 'Abstract'])
    .default('Monad'),
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

    // Fetch metadata and all owners
    const [metadata, allOwners] = await Promise.all([
      getContractMetadata(validatedParams.contractAddress, validatedParams.network),
      fetchAllOwners(validatedParams.contractAddress, validatedParams.network, 'JSON Export')
    ]);

    const tokenType = metadata.tokenType || 'ERC721';

    // Transform the data for JSON export
    const jsonData = {
      contractAddress: validatedParams.contractAddress,
      network: validatedParams.network,
      exportDate: new Date().toISOString(),
      tokenType: tokenType,
      totalHolders: allOwners.length,
      totalUniqueTokens: allOwners.reduce((sum, owner) => sum + owner.tokenBalances.length, 0),
      totalTokenSupply: allOwners.reduce((sum, owner) => sum + calculateTokenCountFromAlchemy(owner, tokenType), 0),
      owners: allOwners.map((owner) => ({
        address: owner.ownerAddress,
        totalTokens: calculateTokenCountFromAlchemy(owner, tokenType),
        tokens: owner.tokenBalances.map((token) => ({
          tokenId: token.tokenId,
          balance: token.balance,
        })),
      })),
    };

    // Create response with JSON headers
    const jsonResponse = new NextResponse(JSON.stringify(jsonData, null, 2));
    jsonResponse.headers.set('Content-Type', 'application/json');
    jsonResponse.headers.set('Content-Disposition', `attachment; filename="nft-owners-${validatedParams.contractAddress.slice(0, 8)}.json"`);
    
    return jsonResponse;

  } catch (error) {
    console.error("NFT JSON export API error:", error);

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