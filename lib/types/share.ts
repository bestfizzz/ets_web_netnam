// types/share
export interface CreateSharePayload {
  contacts: {
    phone?: string
    email?: string
    telegramId?: string
  }
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

export interface ShareGuestCreateResponse {
  status: number
  message: string
  data: {
    profileGuestId: number
    contacts: {
      phone: string
      email: string
    }
    notificationResponses: {
      platform: string
      status: "unsupported" | "failed" | "success"
      message: string
    }[]
  }
}
