import type { NFTOwner } from '@/types/nft'

/**
 * Calculate the correct token count based on token type
 * @param owner - The NFT owner data
 * @param tokenType - The token type ('ERC721' or 'ERC1155')
 * @returns The correct token count
 */
export function calculateTokenCount(owner: NFTOwner, tokenType: string): number {
  if (tokenType === 'ERC721') {
    // For ERC-721, count unique tokens (each token is unique)
    return owner.tokens.length
  } else if (tokenType === 'ERC1155') {
    // For ERC-1155, sum the balances (users can have multiple of the same token)
    return owner.tokens.reduce((sum, token) => sum + token.balance, 0)
  } else {
    // Fallback to balance sum for unknown token types
    return owner.tokens.reduce((sum, token) => sum + token.balance, 0)
  }
}

/**
 * Calculate the correct token count for raw Alchemy owner data
 * @param owner - The raw Alchemy owner data
 * @param tokenType - The token type ('ERC721' or 'ERC1155')
 * @returns The correct token count
 */
export function calculateTokenCountFromAlchemy(owner: { tokenBalances: { balance: number }[] }, tokenType: string): number {
  if (tokenType === 'ERC721') {
    // For ERC-721, count unique tokens
    return owner.tokenBalances.length
  } else if (tokenType === 'ERC1155') {
    // For ERC-1155, sum the balances
    return owner.tokenBalances.reduce((sum, token) => sum + token.balance, 0)
  } else {
    // Fallback to balance sum for unknown token types
    return owner.tokenBalances.reduce((sum, token) => sum + token.balance, 0)
  }
} 