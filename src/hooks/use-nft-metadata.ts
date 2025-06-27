import { useQuery } from '@tanstack/react-query'
import { clientApi } from '@/lib/api'
import type { NFTContractMetadata } from '@/types/nft'

interface UseNFTMetadataParams {
  contractAddress: string
  enabled?: boolean
}

export function useNFTMetadata({ contractAddress, enabled = true }: UseNFTMetadataParams) {
  return useQuery({
    queryKey: ['nft-metadata', contractAddress],
    queryFn: async (): Promise<NFTContractMetadata> => {
      const params = new URLSearchParams({
        contractAddress,
      })

      const response = await clientApi.get<NFTContractMetadata>(`/nft/metadata?${params.toString()}`)
      if (!response.data) {
        throw new Error('No data received from API')
      }
      return response.data
    },
    enabled: enabled && !!contractAddress,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
} 