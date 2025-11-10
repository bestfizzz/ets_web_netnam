import { http } from "@/lib/http"
import type { CreateSharePayload, ShareAuthPayload, ShareResponse } from "@/lib/types/share"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!
const SHARE_BASE = `${BASE}/share`

export const ShareActionsAPI = {
  /** Authenticate a share access code */
  authenticate: (uuid: string, id: string | number, accessCode: string) =>
    http<ShareResponse>(`${SHARE_BASE}/${uuid}/${id}`, {
      method: "POST",
      body: { accessCode } satisfies ShareAuthPayload,
    }),

  /** Create a guest share */
  createGuest: (uuid: string, data: CreateSharePayload) =>{
    http<ShareResponse>(`${SHARE_BASE}/${uuid}`, {
      method: "POST",
      body: data,
    })
  }
}
