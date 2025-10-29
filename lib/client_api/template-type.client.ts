// lib/client_api/template-type.client.ts

import { http } from "@/lib/http"
import type {
  TemplateTypeListResponse,
  TemplateTypeGetResponse,
  TemplateTypeCreateResponse,
  TemplateTypeUpdateResponse,
  TemplateTypePayloadRequest,
} from "@/lib/types/template-type"

const BASE = "/api/template/type" // proxy route (Next.js API route)
const SERVER_BASE = (process.env.NEXT_PUBLIC_URL || "") + "/api/template/type" // direct backend call

export const TemplateTypeClientAPI = {
  // ✅ List all template types
  list: () => http<TemplateTypeListResponse>(`${BASE}`, { method: "GET" }),

  serverList: async (session?: string, accessToken?: string) => {
    return http<TemplateTypeListResponse>(`${SERVER_BASE}`, {
      method: "GET",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })
  },

  // ✅ Create a new template type
  create: (data: TemplateTypePayloadRequest) =>
    http<TemplateTypeCreateResponse>(`${BASE}`, { method: "POST", body: data }),

  // ✅ Get a template type by ID
  get: (id: number) => http<TemplateTypeGetResponse>(`${BASE}/${id}`, { method: "GET" }),

  // ✅ Direct server-side call (bypasses Next.js route)
  serverGet: async (id: number, session?: string, accessToken?: string) => {
    return http<TemplateTypeListResponse>(`${SERVER_BASE}/${id}`, {
      method: "GET",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })
  },

  // ✅ Update a template type
  update: (id: number, data: TemplateTypePayloadRequest) =>
    http<TemplateTypeUpdateResponse>(`${BASE}/${id}`, { method: "PUT", body: data }),

  // ✅ Delete a template type
  delete: (id: number) => http(`${BASE}/${id}`, { method: "DELETE" }),
}
