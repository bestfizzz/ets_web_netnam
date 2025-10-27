import type {
  SharePlatformListResponse,
  SharePlatformGetResponse,
  SharePlatformCreateResponse,
  SharePlatformUpdateResponse,
  SharePlatformDeleteResponse,
} from "@/lib/types/share-platform"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

export const SharePlatformAPI = {
  /** GET /share/platforms */
  list: () => ({
    url: `${BACKEND}/share/platforms`,
    method: "GET" as const,
    response: undefined as unknown as SharePlatformListResponse,
  }),

  /** GET /share/platforms/{id} */
  get: (id: number) => ({
    url: `${BACKEND}/share/platforms/${id}`,
    method: "GET" as const,
    response: undefined as unknown as SharePlatformGetResponse,
  }),

  /** POST /share/platforms */
  create: () => ({
    url: `${BACKEND}/share/platforms`,
    method: "POST" as const,
    response: undefined as unknown as SharePlatformCreateResponse,
  }),

  /** PUT /share/platforms/{id} */
  update: (id: number) => ({
    url: `${BACKEND}/share/platforms/${id}`,
    method: "PUT" as const,
    response: undefined as unknown as SharePlatformUpdateResponse,
  }),

  /** DELETE /share/platforms/{id} */
  delete: (id: number) => ({
    url: `${BACKEND}/share/platforms/${id}`,
    method: "DELETE" as const,
    response: undefined as unknown as SharePlatformDeleteResponse,
  }),
}
