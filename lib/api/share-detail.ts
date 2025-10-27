'use server'

import { http } from "@/lib/http"
import { ShareDetailAPI } from "@/lib/endpoints/share/detail"
import type {
  CreateShareDetailRequest,
  UpdateShareDetailRequest,
  ShareDetailListResponse,
  ShareDetailGetResponse,
  ShareDetailCreateResponse,
  ShareDetailUpdateResponse,
} from "@/lib/types/share-detail"

/** List all share details */
export async function listShareDetails(accessToken?: string) {
  const { url, method } = ShareDetailAPI.list()
  return http<ShareDetailListResponse>(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/** Get one share detail by ID */
export async function getShareDetail(id: number, accessToken?: string) {
  const { url, method } = ShareDetailAPI.get(id)
  return http<ShareDetailGetResponse>(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/** Create a new share detail */
export async function createShareDetail(
  data: CreateShareDetailRequest,
  accessToken?: string
) {
  const { url, method } = ShareDetailAPI.create()
  return http<ShareDetailCreateResponse>(url, {
    method,
    body: data,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/** Update an existing share detail */
export async function updateShareDetail(
  id: number,
  data: UpdateShareDetailRequest,
  accessToken?: string
) {
  const { url, method } = ShareDetailAPI.update(id)
  return http<ShareDetailUpdateResponse>(url, {
    method,
    body: data,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/** Delete a share detail */
export async function deleteShareDetail(id: number, accessToken?: string) {
  const { url, method } = ShareDetailAPI.delete(id)
  return http(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}
