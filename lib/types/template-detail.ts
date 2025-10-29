// lib/types/template-detail.ts

import { TemplateDetail } from "@/lib/types/types"

/** Requests */
export interface TemplateDetailPayloadRequest {
  templateTypeId: number   // backend may only need id, keep shape flexible
  name: string
  isActive: boolean
  jsonConfig: {
    settings?: Record<string, any>
    content?: Array<Record<string, any>>
  }
}

/** Responses */
export type TemplateDetailListResponse = TemplateDetail[]
export type TemplateDetailGetResponse = TemplateDetail
export type TemplateDetailCreateResponse = TemplateDetail
export type TemplateDetailUpdateResponse = TemplateDetail
export type TemplateDetailDeleteResponse = { success: boolean } | null
