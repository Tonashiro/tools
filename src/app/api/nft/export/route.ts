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
      fetchAllOwners(validatedParams.contractAddress, validatedParams.network, 'CSV Export')
    ]);

    const tokenType = metadata.tokenType || 'ERC721';

    // Transform the data for CSV export
    const csvData = allOwners.map((owner) => ({
      address: owner.ownerAddress,
      totalTokens: calculateTokenCountFromAlchemy(owner, tokenType),
      tokenDetails: owner.tokenBalances.map(token => `${token.tokenId}:${token.balance}`).join(';'),
    }));

    // Generate CSV content
    const csvHeaders = ['Address', 'Total Tokens', 'Token Details (TokenID:Balance)'];
    const csvRows = csvData.map(row => [
      row.address,
      row.totalTokens,
      row.tokenDetails
    ]);

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create response with CSV headers
    const csvResponse = new NextResponse(csvContent);
    csvResponse.headers.set('Content-Type', 'text/csv');
    csvResponse.headers.set('Content-Disposition', `attachment; filename="nft-owners-${validatedParams.contractAddress.slice(0, 8)}.csv"`);
    
    return csvResponse;

  } catch (error) {
    console.error("NFT export API error:", error);

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