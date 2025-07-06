// Types for Alchemy API response
export interface TokenBalance {
  tokenId: string;
  balance: number | string; // Alchemy can return balance as string for ERC-1155
}

export interface Owner {
  ownerAddress: string;
  tokenBalances: TokenBalance[];
}

export interface AlchemyResponse {
  owners: Owner[];
  pageKey?: string;
}

// Network type
export type Network = "Monad" | "Ethereum" | "Base" | "Abstract";

// Function to get RPC URL based on network
export function getRpcUrl(network: Network): string {
  const rpcUrls = {
    Monad: process.env.MONAD_RPC_URL,
    Ethereum: process.env.ETHEREUM_RPC_URL,
    Base: process.env.BASE_RPC_URL,
    Abstract: process.env.ABSTRACT_RPC_URL,
  };

  const rpcUrl = rpcUrls[network];
  if (!rpcUrl) {
    throw new Error(`RPC URL not configured for network: ${network}`);
  }

  return rpcUrl;
}

// Utility function to fetch all owners with pagination
export async function fetchAllOwners(
  contractAddress: string,
  network: Network = "Monad",
  context: string = "API"
): Promise<Owner[]> {
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  const rpcUrl = getRpcUrl(network);

  if (!rpcUrl || !alchemyApiKey) {
    throw new Error("API configuration missing");
  }

  const alchemyUrl = `${rpcUrl}/nft/v3/${alchemyApiKey}/getOwnersForContract`;
  const allOwners: Owner[] = [];
  let currentPageKey: string | undefined = undefined;
  let pageCount = 0;
  const maxPages = 1000; // Safety limit

  do {
    pageCount++;

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

    // Safety check
    if (pageCount >= maxPages) {
      console.warn(
        `[${context}] Reached maximum page limit (${maxPages}). Stopping pagination.`
      );
      break;
    }

    // Add delay to avoid rate limiting
    if (currentPageKey) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } while (currentPageKey);

  return allOwners;
}
