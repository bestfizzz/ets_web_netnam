import { PaginatedAssets } from "../types/types"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!
const ASSET_BASE = `${BASE}/assets`

export const AssetsAPI = {
  getAll: (uuid: string) => ({
    url: `${ASSET_BASE}/${uuid}/getAllAssetsId`,
    method: "GET" as const,
    response: {} as PaginatedAssets,
  }),

  searchByKeyword: {
    url: `${ASSET_BASE}/search/keyword`,
    method: "POST" as const,
    response: {} as PaginatedAssets,
  },

  personAssets: (uuid: string) => ({
    url: `${ASSET_BASE}/person/${uuid}/page`,
    method: "GET" as const,
    response: {} as PaginatedAssets,
  }),

  personStats: (uuid: string) => ({
    url: `${ASSET_BASE}/person/${uuid}/statistics`,
    method: "GET" as const,
    response: {} as Record<string, any>, // replace with your stat type if available
  }),
}
