import { useState, useCallback } from 'react'
import type { ApiResponse } from '@/types'

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

export function useApi(hookOptions: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<unknown>(null)

  const fetchData = useCallback(async <T>(
    url: string,
    requestOptions: RequestInit = {}
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        },
        ...requestOptions,
      })

      const result: ApiResponse<T> = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`)
      }

      setData(result.data)
      hookOptions.onSuccess?.(result.data)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      hookOptions.onError?.(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [hookOptions])

  return {
    loading,
    error,
    data,
    fetchData,
  }
} 