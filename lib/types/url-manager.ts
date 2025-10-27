import { UrlManager } from "@/lib/types/types"

/** Request body for POST / PATCH */
export interface UrlManagerPayload {
  name: string
  shareDetailIds: number[]
}

/** List response for GET /api/v1/url-manager */
export type UrlManagerListResponse = UrlManager[]

/** Single response for GET / PATCH / DELETE / POST */
export type UrlManagerResponse = UrlManager
