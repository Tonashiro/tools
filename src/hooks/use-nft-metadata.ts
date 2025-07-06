import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import type { EnhancedNFTContractMetadata, Network } from "@/types/nft";

interface UseNFTMetadataParams {
  contractAddress: string;
  network?: Network;
  enabled?: boolean;
}

export function useNFTMetadata({
  contractAddress,
  network = "Monad",
  enabled = true,
}: UseNFTMetadataParams) {
  return useQuery({
    queryKey: ["nft-metadata", contractAddress, network],
    queryFn: async (): Promise<EnhancedNFTContractMetadata> => {
      const params = new URLSearchParams({
        contractAddress,
        network,
      });

      const response = await clientApi.get<EnhancedNFTContractMetadata>(
        `/nft/metadata?${params.toString()}`
      );
      if (!response.data) {
        throw new Error("No data received from API");
      }
      return response.data;
    },
    enabled: enabled && !!contractAddress,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
