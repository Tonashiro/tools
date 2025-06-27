'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientApi } from '@/lib/api'
import type { UserSession } from '@/types/auth'

// Query key for authentication
export const authQueryKey = ['auth', 'session'] as const

// Hook to get current user session
export function useAuth() {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: () => clientApi.get<{ user: UserSession }>('/auth/session'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: true, // Refetch when window gains focus
  })
}

// Hook for logout mutation
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => clientApi.post<{ message: string }>('/auth/logout', {}),
    onSuccess: () => {
      // Invalidate and refetch auth session
      queryClient.invalidateQueries({ queryKey: authQueryKey })
      // Clear any cached user data
      queryClient.clear()
    },
  })
}

// Hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
  const { data } = useAuth()
  return data?.data?.user?.isAuthenticated ?? false
}

// Hook to get current user
export function useCurrentUser(): UserSession | null {
  const { data } = useAuth()
  return data?.data?.user ?? null
} 