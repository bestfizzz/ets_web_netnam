import { ShareDetail } from "@/lib/types/types"

/** --- Requests --- */
export interface CreateShareDetailRequest {
  platform: number
  name: string
  settings?: Record<string, any>
}

export interface UpdateShareDetailRequest {
  platform: number
  name: string
  settings?: Record<string, any>
}

/** --- Responses --- */
export type ShareDetailListResponse = ShareDetail[]                  // GET /share/details
export type ShareDetailGetResponse = ShareDetail                     // GET /share/details/{id}
export type ShareDetailCreateResponse = ShareDetail                  // POST /share/details
export type ShareDetailUpdateResponse = ShareDetail                  // PUT /share/details/{id}
export type ShareDetailDeleteResponse = { success: boolean } | null  // DELETE /share/details/{id}
