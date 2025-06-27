export interface TokenBalance {
  tokenId: string
  balance: number
}

export interface NFTOwner {
  address: string
  totalTokens: number
  tokens: TokenBalance[]
}

export interface NFTOwnersResponse {
  owners: NFTOwner[]
  totalOwners: number
  pageKey?: string
  hasMore: boolean
}

export interface NFTCollectionFormData {
  contractAddress: string
}

export interface NFTCollectionStats {
  totalOwners: number
  totalTokens: number
  uniqueTokenIds: number
  averageTokensPerOwner: number
}

export interface NFTContractMetadata {
  address: string
  name: string | null
  symbol: string | null
  totalSupply: number | null
  tokenType: "ERC721" | "ERC1155" | "NO_SUPPORTED_NFT_STANDARD" | "NOT_A_CONTRACT"
  contractDeployer: string | null
  deployedBlockNumber: number | null
} 