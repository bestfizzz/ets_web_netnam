// endpoints/share.ts
import { ShareResponse } from "@/lib/types/types"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!
const SHARE_BASE = `${BASE}/share`

export const ShareAPI = {
  authenticate: (uuid: string, id: string | number) => ({
    url: `${SHARE_BASE}/${uuid}/${id}`,
    method: "POST" as const,
    response: {} as ShareResponse,
  }),

  createGuest: (uuid: string) => ({
    url: `${SHARE_BASE}/${uuid}`,
    method: "POST" as const,
    response: {} as ShareResponse,
  }),
}