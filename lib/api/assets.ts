'use server'

import { http } from "@/lib/http"
import { AssetsAPI } from "@/lib/endpoints/assets"
import { PaginatedAssets } from "@/lib/types/types"

export async function getAllAssets(uuid: string, page = 1, size = 20): Promise<PaginatedAssets> {
  const { url, method } = AssetsAPI.getAll(uuid)
  return http<PaginatedAssets>(url, {
    method,
    query: { page, size },
  })
}

export async function getAssetsByKeyword(
  uuid: string,
  keyword: string,
  page = 1,
  count = 60
): Promise<PaginatedAssets> {
  const { url, method } = AssetsAPI.searchByKeyword
  return http<PaginatedAssets>(url, {
    method,
    body: { uuid, keyword },
    query: { page, count },
  })
}

export async function getPersonAssets(
  uuid: string,
  personId: string,
  page = 1,
  size = 10
): Promise<PaginatedAssets> {
  const { url, method } = AssetsAPI.personAssets(uuid)
  return http<PaginatedAssets>(url, {
    method,
    query: { personId, page, size },
  })
}

export async function getPersonAssetStats(uuid: string, personId: string) {
  const { url, method } = AssetsAPI.personStats(uuid)
  return http(url, {
    method,
    query: { personId },
  })
}
