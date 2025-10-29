import { http } from "@/lib/http"
import type {
  TemplateTypePayloadRequest,
  TemplateTypeListResponse,
  TemplateTypeGetResponse,
  TemplateTypeCreateResponse,
  TemplateTypeUpdateResponse,
  TemplateTypeDeleteResponse,
} from "@/lib/types/template-type"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

export const TemplateTypeServerAPI = {
  /** GET /template/type */
  list: (accessToken?: string) =>
    http<TemplateTypeListResponse>(`${BACKEND}/template/type`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** GET /template/type/{id} */
  get: (id: number, accessToken?: string) =>
    http<TemplateTypeGetResponse>(`${BACKEND}/template/type/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** POST /template/type */
  create: (data: TemplateTypePayloadRequest, accessToken?: string) =>
    http<TemplateTypeCreateResponse>(`${BACKEND}/template/type`, {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** PUT /template/type/{id} */
  update: (id: number, data: TemplateTypePayloadRequest, accessToken?: string) =>
    http<TemplateTypeUpdateResponse>(`${BACKEND}/template/type/${id}`, {
      method: "PUT",
      body: data,
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

  /** DELETE /template/type/{id} */
  delete: (id: number, accessToken?: string) =>
    http<TemplateTypeDeleteResponse>(`${BACKEND}/template/type/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),
}
