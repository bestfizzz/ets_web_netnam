import { SharePlatform } from "@/lib/types/types"
/** Requests */
export interface CreateSharePlatformRequest {
  name: string
}

export interface UpdateSharePlatformRequest {
  name: string
}

/** Responses */
export type SharePlatformListResponse = SharePlatform[]
export type SharePlatformGetResponse = SharePlatform
export type SharePlatformCreateResponse = SharePlatform
export type SharePlatformUpdateResponse = SharePlatform
export type SharePlatformDeleteResponse = { success: boolean } | null // DELETE 204 → no body
