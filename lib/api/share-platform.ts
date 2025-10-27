'use server'

import { http } from "@/lib/http"
import { SharePlatformAPI } from "@/lib/endpoints/share/platform"
import type {
  CreateSharePlatformRequest,
  UpdateSharePlatformRequest,
  SharePlatformListResponse,
  SharePlatformGetResponse,
  SharePlatformCreateResponse,
  SharePlatformUpdateResponse,
  SharePlatformDeleteResponse,
} from "@/lib/types/share-platform"

/**
 * List all share platforms
 */
export async function listSharePlatforms(accessToken?: string) {
  const { url, method } = SharePlatformAPI.list()
  return http<SharePlatformListResponse>(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/**
 * Get share platform by ID
 */
export async function getSharePlatform(id: number, accessToken?: string) {
  const { url, method } = SharePlatformAPI.get(id)
  return http<SharePlatformGetResponse>(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/**
 * Create a share platform
 */
export async function createSharePlatform(
  data: CreateSharePlatformRequest,
  accessToken?: string
) {
  const { url, method } = SharePlatformAPI.create()
  return http<SharePlatformCreateResponse>(url, {
    method,
    body: data,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/**
 * Update a share platform
 */
export async function updateSharePlatform(
  id: number,
  data: UpdateSharePlatformRequest,
  accessToken?: string
) {
  const { url, method } = SharePlatformAPI.update(id)
  return http<SharePlatformUpdateResponse>(url, {
    method,
    body: data,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

/**
 * Delete a share platform
 */
export async function deleteSharePlatform(id: number, accessToken?: string) {
  const { url, method } = SharePlatformAPI.delete(id)
  return http<SharePlatformDeleteResponse>(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}
