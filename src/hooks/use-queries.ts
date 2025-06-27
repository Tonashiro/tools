'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientApi } from '@/lib/api'
import type { ApiResponse } from '@/types'

// Query keys for better cache management
export const queryKeys = {
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
} as const

// Generic API query hook
export function useApiQuery<T>(
  queryKey: readonly unknown[],
  endpoint: string,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey,
    queryFn: () => clientApi.get<T>(endpoint),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime,
  })
}

// Generic API mutation hook
export function useApiMutation<T, TData = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: {
    onSuccess?: (data: ApiResponse<T>) => void
    onError?: (error: Error) => void
    invalidateQueries?: readonly unknown[][]
  }
) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data?: TData) => {
      switch (method) {
        case 'POST':
          return clientApi.post<T>(endpoint, data)
        case 'PUT':
          return clientApi.put<T>(endpoint, data)
        case 'DELETE':
          return clientApi.delete<T>(endpoint)
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    },
    onSuccess: (data) => {
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
} 