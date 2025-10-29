import { http } from "@/lib/http"
import type {
  SharePlatformListResponse,
  SharePlatformGetResponse,
  SharePlatformCreateResponse,
  SharePlatformUpdateResponse,
  CreateSharePlatformRequest,
  UpdateSharePlatformRequest,
} from "@/lib/types/share-platform"

const BASE = "/api/share/platforms"
const SERVER_BASE = process.env.NEXT_PUBLIC_URL + "/api/share/platforms"

export const SharePlatformClientAPI = {
  list: () => http<SharePlatformListResponse>(`${BASE}`, { method: "GET" }),

  serverList: async (session?:string,accessToken?:string) => {
    return http<SharePlatformListResponse>(`${SERVER_BASE}`, {
      method: "GET",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })
  },

  create: (data: CreateSharePlatformRequest) =>
    http<SharePlatformCreateResponse>(`${BASE}`, { method: "POST", body: data }),

  get: (id: number) => http<SharePlatformGetResponse>(`${BASE}/${id}`, { method: "GET" }),

  update: (id: number, data: UpdateSharePlatformRequest) =>
    http<SharePlatformUpdateResponse>(`${BASE}/${id}`, { method: "PUT", body: data }),

  delete: (id: number) => http(`${BASE}/${id}`, { method: "DELETE" }),
}
