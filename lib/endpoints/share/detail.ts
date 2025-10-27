import type {
  CreateShareDetailRequest,
  UpdateShareDetailRequest,
  ShareDetailListResponse,
  ShareDetailGetResponse,
  ShareDetailCreateResponse,
  ShareDetailUpdateResponse,
  ShareDetailDeleteResponse,
} from "@/lib/types/share-detail"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

export const ShareDetailAPI = {
  /** GET /share/details */
  list: () => ({
    url: `${BACKEND}/share/details`,
    method: "GET" as const,
    response: undefined as unknown as ShareDetailListResponse,
  }),

  /** GET /share/details/{id} */
  get: (id: number) => ({
    url: `${BACKEND}/share/details/${id}`,
    method: "GET" as const,
    response: undefined as unknown as ShareDetailGetResponse,
  }),

  /** POST /share/details */
  create: () => ({
    url: `${BACKEND}/share/details`,
    method: "POST" as const,
    response: undefined as unknown as ShareDetailCreateResponse,
  }),

  /** PUT /share/details/{id} */
  update: (id: number) => ({
    url: `${BACKEND}/share/details/${id}`,
    method: "PUT" as const,
    response: undefined as unknown as ShareDetailUpdateResponse,
  }),

  /** DELETE /share/details/{id} */
  delete: (id: number) => ({
    url: `${BACKEND}/share/details/${id}`,
    method: "DELETE" as const,
    response: undefined as unknown as ShareDetailDeleteResponse,
  }),
}
