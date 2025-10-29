import { http } from "@/lib/http"
import type {
  CreateShareDetailRequest,
  UpdateShareDetailRequest,
  ShareDetailListResponse,
  ShareDetailGetResponse,
  ShareDetailCreateResponse,
  ShareDetailUpdateResponse,
  ShareDetailDeleteResponse,
} from "@/lib/types/share-detail"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

export const ShareDetailServerAPI = {
  /** GET /share/details */
  list: (accessToken?: string) =>
    http<ShareDetailListResponse>(`${BACKEND}/share/details`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** GET /share/details/{id} */
  get: (id: number, accessToken?: string) =>
    http<ShareDetailGetResponse>(`${BACKEND}/share/details/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** POST /share/details */
  create: (data: CreateShareDetailRequest, accessToken?: string) =>
    http<ShareDetailCreateResponse>(`${BACKEND}/share/details`, {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** PUT /share/details/{id} */
  update: (id: number, data: UpdateShareDetailRequest, accessToken?: string) =>
    http<ShareDetailUpdateResponse>(`${BACKEND}/share/details/${id}`, {
      method: "PUT",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** DELETE /share/details/{id} */
  delete: (id: number, accessToken?: string) =>
    http<ShareDetailDeleteResponse>(`${BACKEND}/share/details/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),
}
