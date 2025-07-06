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

export type Network = 'Monad' | 'Ethereum' | 'Base' | 'Abstract'

export interface NFTCollectionFormData {
  contractAddress: string
  network: Network
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

// Magic Eden specific types
export interface MagicEdenPrice {
  currency: {
    contract: string
    name: string
    symbol: string
    decimals: number
  }
  amount: {
    raw: string
    decimal: number
    usd: number | null
    native: number
  }
  netAmount?: {
    raw: string
    decimal: number
    usd: number | null
    native: number
  }
}

export interface MagicEdenFloorAsk {
  id: string
  sourceDomain: string
  price: MagicEdenPrice
  maker: string
  validFrom: number
  validUntil: number
  token: {
    contract: string
    tokenId: string
    name: string
    image: string
  }
}

export interface MagicEdenTopBid {
  id: string
  sourceDomain: string
  price: MagicEdenPrice
  maker: string
  validFrom: number
  validUntil: number
}

export interface MagicEdenRoyalty {
  bps: number
  recipient: string
}

export interface MagicEdenRoyalties {
  recipient: string
  breakdown: MagicEdenRoyalty[]
  bps: number
}

export interface MagicEdenAllRoyalties {
  eip2981: MagicEdenRoyalty[]
  onchain: MagicEdenRoyalty[]
}

export interface MagicEdenMintStage {
  stage: string
  price: string
  startTime: number
  endTime: number
  maxMintsPerWallet: number
  maxMintsPerTransaction: number
}

export interface MagicEdenCollectionData {
  // Basic collection info
  name: string
  symbol: string | null
  description: string | null
  image: string | null
  banner: string | null
  externalUrl: string | null
  twitterUrl: string | null
  discordUrl: string | null
  twitterUsername: string | null
  
  // Contract info
  contractAddress: string
  contractKind: string
  creator: string | null
  isSharedContract: boolean
  
  // Supply and token info
  tokenCount: number
  supply: number
  remainingSupply: number
  onSaleCount: number
  ownerCount: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
  contractDeployedAt: string | null
  mintedTimestamp: number
  lastMintTimestamp: number
  
  // Verification status
  openseaVerificationStatus: string | null
  magicedenVerificationStatus: string | null
  
  // Collection flags
  isSpam: boolean
  isNsfw: boolean
  isMinting: boolean
  metadataDisabled: boolean
  collectionBidSupported: boolean
  
  // Sample images
  sampleImages: string[]
  
  // Royalties
  royalties: MagicEdenRoyalties
  allRoyalties: MagicEdenAllRoyalties
  
  // Market data
  floorAsk: MagicEdenFloorAsk | null
  topBid: MagicEdenTopBid | null
  
  // Rankings
  rank: {
    "1day": number | null
    "7day": number | null
    "30day": number | null
    allTime: number | null
  }
  
  // Volume data
  volume: {
    "1day": number
    "7day": number
    "30day": number
    allTime: number
  }
  volumeChange: {
    "1day": number
    "7day": number
    "30day": number
  }
  
  // Floor sale data
  floorSale: {
    "1day": number
    "7day": number
    "30day": number
  }
  floorSaleChange: {
    "1day": number
    "7day": number
    "30day": number
  }
  
  // Mint stages
  mintStages: MagicEdenMintStage[]
}

// Enhanced metadata that combines Alchemy and Magic Eden data
export interface EnhancedNFTContractMetadata extends NFTContractMetadata {
  magicEden?: MagicEdenCollectionData
} 