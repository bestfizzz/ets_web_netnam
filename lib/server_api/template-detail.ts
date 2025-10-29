import { http } from "@/lib/http"
import type {
    TemplateDetailPayloadRequest,
    TemplateDetailListResponse,
    TemplateDetailGetResponse,
    TemplateDetailCreateResponse,
    TemplateDetailUpdateResponse,
    TemplateDetailDeleteResponse,
} from "@/lib/types/template-detail"
import type { TemplateDetail } from "@/lib/types/types"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

export const TemplateDetailServerAPI = {
    /** GET /template/detail */
    list: (accessToken?: string) =>
        http<TemplateDetailListResponse>(`${BACKEND}/template/detail`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken ?? ""}` },
        }),

    /** GET /template/detail/{id} */
    get: (id: number, accessToken?: string) =>
        http<TemplateDetailGetResponse>(`${BACKEND}/template/detail/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken ?? ""}` },
    }),

    getPageDetails: (uuid: string) =>
        http<TemplateDetailListResponse>(`${BACKEND}/template/detail/uuid/${uuid}`, {
            method: "GET",
        }),

    /** POST /template/detail */
    create: (data: TemplateDetailPayloadRequest, accessToken?: string) =>
        http<TemplateDetailCreateResponse>(`${BACKEND}/template/detail`, {
            method: "POST",
            body: data,
            headers: { Authorization: `Bearer ${accessToken ?? ""}` },
        }),

    /** PUT /template/detail/{id} */
    update: (id: number, data: TemplateDetailPayloadRequest, accessToken?: string) =>
        http<TemplateDetailUpdateResponse>(`${BACKEND}/template/detail/${id}`, {
            method: "PUT",
            body: data,
            headers: { Authorization: `Bearer ${accessToken ?? ""}` },
        }),

    /** DELETE /template/detail/{id} */
    delete: (id: number, accessToken?: string) =>
        http<TemplateDetailDeleteResponse>(`${BACKEND}/template/detail/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken ?? ""}` },
        }),
}
