import { useQuery } from '@tanstack/react-query'
import { clientApi } from '@/lib/api'
import type { NFTOwnersResponse, NFTOwner } from '@/types/nft'

interface UseNFTOwnersParams {
  contractAddress: string
  pageKey?: string
  enabled?: boolean
}

interface UseAllNFTOwnersParams {
  contractAddress: string
  enabled?: boolean
}

// Original hook for single page fetching (kept for backward compatibility)
export function useNFTOwners({ contractAddress, pageKey, enabled = true }: UseNFTOwnersParams) {
  return useQuery({
    queryKey: ['nft-owners', contractAddress, pageKey],
    queryFn: async (): Promise<NFTOwnersResponse> => {
      const params = new URLSearchParams({
        contractAddress,
        withTokenBalances: 'true',
      })
      
      if (pageKey) {
        params.append('pageKey', pageKey)
      }

      const response = await clientApi.get<NFTOwnersResponse>(`/nft/owners?${params.toString()}`)
      if (!response.data) {
        throw new Error('No data received from API')
      }
      return response.data
    },
    enabled: enabled && !!contractAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// New hook for fetching ALL owners with automatic pagination
export function useAllNFTOwners({ contractAddress, enabled = true }: UseAllNFTOwnersParams) {
  return useQuery({
    queryKey: ['all-nft-owners', contractAddress],
    queryFn: async (): Promise<NFTOwnersResponse> => {
      const allOwners: NFTOwner[] = []
      let currentPageKey: string | undefined = undefined
      let pageCount = 0
      const maxPages = 1000 // Safety limit to prevent infinite loops
      
      console.log(`Starting to fetch all owners for contract: ${contractAddress}`)
      
      do {
        pageCount++
        console.log(`Fetching page ${pageCount}...`)
        
        const params = new URLSearchParams({
          contractAddress,
          withTokenBalances: 'true',
        })
        
        if (currentPageKey) {
          params.append('pageKey', currentPageKey)
        }

        const response = await clientApi.get<NFTOwnersResponse>(`/nft/owners?${params.toString()}`)
        if (!response.data) {
          throw new Error('No data received from API')
        }

        const pageData = response.data
        allOwners.push(...pageData.owners)
        currentPageKey = pageData.pageKey
        
        console.log(`Page ${pageCount}: Fetched ${pageData.owners.length} owners. Total so far: ${allOwners.length}`)
        
        // Safety check to prevent infinite loops
        if (pageCount >= maxPages) {
          console.warn(`Reached maximum page limit (${maxPages}). Stopping pagination.`)
          break
        }
        
        // Add a small delay to avoid rate limiting
        if (currentPageKey) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
      } while (currentPageKey)
      
      console.log(`Completed fetching all owners. Total: ${allOwners.length} owners across ${pageCount} pages.`)
      
      return {
        owners: allOwners,
        totalOwners: allOwners.length,
        pageKey: undefined, // No more pages
        hasMore: false,
      }
    },
    enabled: enabled && !!contractAddress,
    staleTime: 10 * 60 * 1000, // 10 minutes (longer cache for complete data)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
} 