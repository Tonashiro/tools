import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchAllOwners } from "@/lib/alchemy-utils";

// Validation schema for the request
const querySchema = z.object({
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
  format: z.enum(['txt', 'json']).default('txt'),
});

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = querySchema.parse(queryParams);

    // Fetch all owners with pagination
    const allOwners = await fetchAllOwners(validatedParams.contractAddress, 'Airdrop Export');

    // Extract addresses for airdrop
    const addresses = allOwners.map(owner => owner.ownerAddress);

    if (validatedParams.format === 'json') {
      // JSON format with metadata
      const jsonData = {
        contractAddress: validatedParams.contractAddress,
        exportDate: new Date().toISOString(),
        totalAddresses: addresses.length,
        addresses: addresses,
      };

      const jsonResponse = new NextResponse(JSON.stringify(jsonData, null, 2));
      jsonResponse.headers.set('Content-Type', 'application/json');
      jsonResponse.headers.set('Content-Disposition', `attachment; filename="airdrop-list-${validatedParams.contractAddress.slice(0, 8)}.json"`);
      
      return jsonResponse;
    } else {
      // Plain text format - one address per line
      const textContent = addresses.join('\n');

      const textResponse = new NextResponse(textContent);
      textResponse.headers.set('Content-Type', 'text/plain');
      textResponse.headers.set('Content-Disposition', `attachment; filename="airdrop-list-${validatedParams.contractAddress.slice(0, 8)}.txt"`);
      
      return textResponse;
    }

  } catch (error) {
    console.error("NFT airdrop export API error:", error);

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