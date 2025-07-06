import { useQuery } from '@tanstack/react-query'
import { clientApi } from '@/lib/api'
import type { MagicEdenCollectionData, Network } from '@/types/nft'

interface UseMagicEdenCollectionParams {
  contractAddress: string
  network?: Network
  enabled?: boolean
}

// Map our network names to Magic Eden chain names
const getMagicEdenChain = (network: Network): string => {
  switch (network) {
    case 'Monad':
      return 'monad-testnet'
    case 'Ethereum':
      return 'ethereum'
    case 'Base':
      return 'base'
    default:
      return 'monad-testnet'
  }
}

export function useMagicEdenCollection({ 
  contractAddress, 
  network = 'Monad', 
  enabled = true 
}: UseMagicEdenCollectionParams) {
  return useQuery({
    queryKey: ['magiceden-collection', contractAddress, network],
    queryFn: async (): Promise<MagicEdenCollectionData> => {
      const params = new URLSearchParams({
        contractAddress,
        chain: getMagicEdenChain(network),
      })

      const response = await clientApi.get<MagicEdenCollectionData>(`/nft/magiceden?${params.toString()}`)
      if (!response.data) {
        throw new Error('No data received from Magic Eden API')
      }
      return response.data
    },
    enabled: enabled && !!contractAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes (market data changes frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2, // Retry twice if it fails
    retryDelay: 1000, // Wait 1 second between retries
  })
} 