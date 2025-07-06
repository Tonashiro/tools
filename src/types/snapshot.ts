import type { NFTOwner } from './nft'

export interface Snapshot {
  id: string
  userId: string
  name: string
  contractAddress: string
  network: string
  totalOwners: number
  totalTokens: number
  tokenType: string
  collectionName?: string | null
  collectionSymbol?: string | null
  snapshotData: {
    owners: NFTOwner[]
    metadata?: {
      name?: string
      symbol?: string
      totalSupply?: number
      tokenType?: string
      contractDeployer?: string
      deployedBlockNumber?: number
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreateSnapshotRequest {
  name: string
  contractAddress: string
  network: string
  totalOwners: number
  totalTokens: number
  tokenType: string
  collectionName?: string
  collectionSymbol?: string
  snapshotData: {
    owners: NFTOwner[]
    metadata?: {
      name?: string
      symbol?: string
      totalSupply?: number
      tokenType?: string
      contractDeployer?: string
      deployedBlockNumber?: number
    }
  }
}

export interface SnapshotResponse {
  success: boolean
  data?: Snapshot
  error?: string
}

export interface SnapshotsResponse {
  success: boolean
  data?: Snapshot[]
  error?: string
} 