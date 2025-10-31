import { http } from "@/lib/http"
import type { UrlManagerPayload, UrlManagerListResponse, UrlManagerResponse } from "@/lib/types/url-manager"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!
const URL_MANAGER_BASE = `${BACKEND}/url-manager`

export const URLManagerServerAPI = {
  /** List all URL managers */
  list: (accessToken?: string) =>
    http<UrlManagerListResponse>(`${URL_MANAGER_BASE}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** Create a new URL manager */
  create: (data: UrlManagerPayload, accessToken?: string) =>
    http<UrlManagerResponse>(`${URL_MANAGER_BASE}`, {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** Get a URL manager by UUID */
  get: (uuid: string, accessToken?: string) =>
    http<UrlManagerResponse>(`${URL_MANAGER_BASE}/${uuid}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** Update a URL manager by UUID */
  update: (uuid: string, data: UrlManagerPayload, accessToken?: string) =>
    http<UrlManagerResponse>(`${URL_MANAGER_BASE}/${uuid}`, {
      method: "PATCH",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** Delete a URL manager by UUID */
  delete: (uuid: string, accessToken?: string) =>
    http<UrlManagerResponse>(`${URL_MANAGER_BASE}/${uuid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),
}
