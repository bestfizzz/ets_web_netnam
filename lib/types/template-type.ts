import { TemplateType } from "@/lib/types/types"

/** --- Request payloads --- */
export interface TemplateTypePayloadRequest {
  name: string
}

/** --- Response payloads --- */
export type TemplateTypeListResponse = TemplateType[]

export interface TemplateTypeGetResponse extends TemplateType {}

export interface TemplateTypeCreateResponse extends TemplateType {}

export interface TemplateTypeUpdateResponse extends TemplateType {}

export interface TemplateTypeDeleteResponse {
  status?: number
  message?: string
}
