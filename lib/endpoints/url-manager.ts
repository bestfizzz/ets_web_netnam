import {
  UrlManagerListResponse,
  UrlManagerPayload,
  UrlManagerResponse,
} from "@/lib/types/types"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

export const UrlManagerAPI = {
  /** GET /api/v1/url-manager — list all */
  list: {
    url: `${BACKEND}/url-manager`,
    method: "GET" as const,
    response: {} as UrlManagerListResponse,
  },

  /** POST /api/v1/url-manager — create new */
  create: {
    url: `${BACKEND}/url-manager`,
    method: "POST" as const,
    body: {} as UrlManagerPayload,
    response: {} as UrlManagerResponse,
  },

  /** GET /api/v1/url-manager/{uuid} */
  get: (uuid: string) => ({
    url: `${BACKEND}/url-manager/${uuid}`,
    method: "GET" as const,
    response: {} as UrlManagerResponse,
  }),

  /** PATCH /api/v1/url-manager/{uuid} */
  update: (uuid: string) => ({
    url: `${BACKEND}/url-manager/${uuid}`,
    method: "PATCH" as const,
    body: {} as UrlManagerPayload,
    response: {} as UrlManagerResponse,
  }),

  /** DELETE /api/v1/url-manager/{uuid} */
  delete: (uuid: string) => ({
    url: `${BACKEND}/url-manager/${uuid}`,
    method: "DELETE" as const,
    response: {} as UrlManagerResponse,
  }),
}
