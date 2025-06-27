// Types for Alchemy API response
export interface TokenBalance {
  tokenId: string;
  balance: number;
}

export interface Owner {
  ownerAddress: string;
  tokenBalances: TokenBalance[];
}

export interface AlchemyResponse {
  owners: Owner[];
  pageKey?: string;
}

// Utility function to fetch all owners with pagination
export async function fetchAllOwners(contractAddress: string, context: string = 'API'): Promise<Owner[]> {
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  const monadRpcUrl = process.env.MONAD_RPC_URL;

  if (!monadRpcUrl || !alchemyApiKey) {
    throw new Error("API configuration missing");
  }

  const alchemyUrl = `${monadRpcUrl}/nft/v3/${alchemyApiKey}/getOwnersForContract`;
  const allOwners: Owner[] = [];
  let currentPageKey: string | undefined = undefined;
  let pageCount = 0;
  const maxPages = 1000; // Safety limit

  console.log(`[${context}] Starting to fetch all owners: ${contractAddress}`);

  do {
    pageCount++;
    console.log(`[${context}] Fetching page ${pageCount}...`);

    const alchemyParams = new URLSearchParams({
      contractAddress,
      withTokenBalances: "true",
    });

    if (currentPageKey) {
      alchemyParams.append("pageKey", currentPageKey);
    }

    const response = await fetch(`${alchemyUrl}?${alchemyParams.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Alchemy API error:", response.status, errorText);
      throw new Error(`Alchemy API error: ${response.status}`);
    }

    const data: AlchemyResponse = await response.json();
    allOwners.push(...data.owners);
    currentPageKey = data.pageKey;

    console.log(`[${context}] Page ${pageCount}: Fetched ${data.owners.length} owners. Total so far: ${allOwners.length}`);

    // Safety check
    if (pageCount >= maxPages) {
      console.warn(`[${context}] Reached maximum page limit (${maxPages}). Stopping pagination.`);
      break;
    }

    // Add delay to avoid rate limiting
    if (currentPageKey) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

  } while (currentPageKey);

  console.log(`[${context}] Completed fetching all owners. Total: ${allOwners.length} owners across ${pageCount} pages.`);
  return allOwners;
} 