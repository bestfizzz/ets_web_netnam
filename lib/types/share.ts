// types/share
export interface CreateSharePayload {
  contact: string
  assetIds: string[]
}

export interface ShareAuthPayload {
  accessCode: string
}

export interface ShareResponse {
  id: number
  contact: string
  assetIds: string[]
}

