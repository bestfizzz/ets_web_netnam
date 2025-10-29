import { http } from "@/lib/http"
import type {
  ShareDetailListResponse,
  ShareDetailGetResponse,
  ShareDetailCreateResponse,
  ShareDetailUpdateResponse,
  CreateShareDetailRequest,
  UpdateShareDetailRequest,
} from "@/lib/types/share-detail"

const BASE = "/api/share/details"
const SERVER_BASE = process.env.NEXT_PUBLIC_URL + "/api/share/details"

export const ShareDetailClientAPI = {
  list: () => http<ShareDetailListResponse>(`${BASE}`, { method: "GET" }),

  serverList: async (session?:string,accessToken?:string) => {
    return http<ShareDetailListResponse>(`${SERVER_BASE}`, {
      method: "GET",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })
  },

  create: (data: CreateShareDetailRequest) =>
    http<ShareDetailCreateResponse>(`${BASE}`, { method: "POST", body: data }),

  get: (id: number) => http<ShareDetailGetResponse>(`${BASE}/${id}`, { method: "GET" }),

  update: (id: number, data: UpdateShareDetailRequest) =>
    http<ShareDetailUpdateResponse>(`${BASE}/${id}`, { method: "PUT", body: data }),

  delete: (id: number) => http(`${BASE}/${id}`, { method: "DELETE" }),
}
