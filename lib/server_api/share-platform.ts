import { http } from "@/lib/http"
import type {
  CreateSharePlatformRequest,
  UpdateSharePlatformRequest,
  SharePlatformListResponse,
  SharePlatformGetResponse,
  SharePlatformCreateResponse,
  SharePlatformUpdateResponse,
  SharePlatformDeleteResponse,
} from "@/lib/types/share-platform"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

export const SharePlatformServerAPI = {
  /** GET /share/platforms */
  list: (accessToken?: string) =>
    http<SharePlatformListResponse>(`${BACKEND}/share/platforms`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** GET /share/platforms/{id} */
  get: (id: number, accessToken?: string) =>
    http<SharePlatformGetResponse>(`${BACKEND}/share/platforms/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** POST /share/platforms */
  create: (data: CreateSharePlatformRequest, accessToken?: string) =>
    http<SharePlatformCreateResponse>(`${BACKEND}/share/platforms`, {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** PUT /share/platforms/{id} */
  update: (id: number, data: UpdateSharePlatformRequest, accessToken?: string) =>
    http<SharePlatformUpdateResponse>(`${BACKEND}/share/platforms/${id}`, {
      method: "PUT",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** DELETE /share/platforms/{id} */
  delete: (id: number, accessToken?: string) =>
    http<SharePlatformDeleteResponse>(`${BACKEND}/share/platforms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),
}
