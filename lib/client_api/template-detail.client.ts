// lib/client_api/template-detail.client.ts

import { http } from "@/lib/http"
import type {
  TemplateDetailListResponse,
  TemplateDetailGetResponse,
  TemplateDetailCreateResponse,
  TemplateDetailUpdateResponse,
  TemplateDetailPayloadRequest
} from "@/lib/types/template-detail"

const BASE = "/api/template/detail" // proxy route you control in Next
const SERVER_BASE = (process.env.NEXT_PUBLIC_URL || "") + "/api/template/detail" // direct backend call

export const TemplateDetailClientAPI = {
  // proxied (client-side)
  list: () => http<TemplateDetailListResponse>(`${BASE}`, { method: "GET" }),

  serverList: async (session?: string, accessToken?: string) => {
    return http<TemplateDetailListResponse>(`${SERVER_BASE}`, {
      method: "GET",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })
  },

  create: (data: TemplateDetailPayloadRequest) =>
    http<TemplateDetailCreateResponse>(`${BASE}`, { method: "POST", body: data }),

  get: (id: number) => http<TemplateDetailGetResponse>(`${BASE}/${id}`, { method: "GET" }),

  serverGet: async (id: number, session?: string, accessToken?: string) => {
    return http<TemplateDetailListResponse>(`${SERVER_BASE}/${id}`, {
      method: "GET",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })
  },

  getDefaultsTemplates: () =>
    http<TemplateDetailListResponse>(`${BASE}/defaults`, { method: "GET" }),

  update: (id: number, data: TemplateDetailPayloadRequest) =>
    http<TemplateDetailUpdateResponse>(`${BASE}/${id}`, { method: "PUT", body: data }),

  delete: (id: number) => http(`${BASE}/${id}`, { method: "DELETE" }),
}
