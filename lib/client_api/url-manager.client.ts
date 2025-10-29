import { http } from "@/lib/http"
import type {
  UrlManagerListResponse,
  UrlManagerPayload,
  UrlManagerResponse,
} from "@/lib/types/url-manager"

const BASE = "/api/url-manager" // proxy path
const SERVER_BASE = process.env.NEXT_PUBLIC_URL + "/api/url-manager" // direct backend server call

export const UrlManagerClientAPI = {
  list: () => http<UrlManagerListResponse>(`${BASE}`, { method: "GET" }),

  serverList: async (session?:string,accessToken?:string) => {
    return http<UrlManagerListResponse>(`${SERVER_BASE}`, {
      method: "GET",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })
  },
  
  create: (data: UrlManagerPayload) =>
    http<UrlManagerResponse>(`${BASE}`, { method: "POST", body: data }),

  get: (uuid: string) => http<UrlManagerResponse>(`${BASE}/${uuid}`, { method: "GET" }),

  update: (uuid: string, data: UrlManagerPayload) =>
    http<UrlManagerResponse>(`${BASE}/${uuid}`, { method: "PATCH", body: data }),

  delete: (uuid: string) => http<UrlManagerResponse>(`${BASE}/${uuid}`, { method: "DELETE" }),
}
