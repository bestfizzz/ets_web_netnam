import { http } from "@/lib/http"
import type { PaginatedAssets } from "@/lib/types/types"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!
const ASSET_BASE = `${BASE}/assets`

export const AssetsServerAPI = {
  /** GET /assets/{uuid}/getAllAssetsId */
  getAll: (uuid: string, page = 1, size = 20) =>
    http<PaginatedAssets>(`${ASSET_BASE}/${uuid}/getAllAssetsId`, {
      method: "GET",
      query: { page, size },
    }),

  /** POST /assets/search/keyword */
  searchByKeyword: (uuid: string, keyword: string, page = 1, count = 60) =>
    http<PaginatedAssets>(`${ASSET_BASE}/search/keyword`, {
      method: "POST",
      body: { uuid, keyword },
      query: { page, count },
    }),

  /** GET /assets/person/{uuid}/page */
  personAssets: (uuid: string, personId: string, page = 1, size = 10) =>
    http<PaginatedAssets>(`${ASSET_BASE}/person/${uuid}/page`, {
      method: "GET",
      query: { personId, page, size },
    }),

  /** GET /assets/person/{uuid}/statistics */
  personStats: (uuid: string, personId: string) =>
    http(`${ASSET_BASE}/person/${uuid}/statistics`, {
      method: "GET",
      query: { personId },
    }),

  /** ✅ Check if a gallery URL is active */
  checkUrl: (uuid: string) =>
    http<{ active: boolean }>(`${ASSET_BASE}/check-url/${uuid}`, {
      method: "GET",
    }),
    
}
