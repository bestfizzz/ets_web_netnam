'use server'

import { http } from "@/lib/http"
import { UrlManagerAPI } from "@/lib/endpoints/url-manager"
import type { UrlManagerPayload } from "@/lib/types/url-manager"

export async function listUrlManagers(accessToken?: string) {
  const { url, method } = UrlManagerAPI.list
  return http(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

export async function createUrlManager(data: UrlManagerPayload, accessToken?: string) {
  const { url, method } = UrlManagerAPI.create
  return http(url, {
    method,
    body: data,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

export async function getUrlManager(uuid: string, accessToken?: string) {
  const { url, method } = UrlManagerAPI.get(uuid)
  return http(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

export async function updateUrlManager(
  uuid: string,
  data: UrlManagerPayload,
  accessToken?: string
) {
  const { url, method } = UrlManagerAPI.update(uuid)
  return http(url, {
    method,
    body: data,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}

export async function deleteUrlManager(uuid: string, accessToken?: string) {
  const { url, method } = UrlManagerAPI.delete(uuid)
  return http(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken ?? ""}` },
  })
}
