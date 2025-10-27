// app/actions/share-actions.ts
'use server'

import { http } from "@/lib/http"
import { ShareAPI } from "@/lib/endpoints/share"
import { CreateSharePayload, ShareAuthPayload, ShareResponse } from "@/lib/types/share"

export async function shareAuthentication(
  uuid: string,
  id: string,
  accessCode: string
): Promise<ShareResponse> {
  const { url, method } = ShareAPI.authenticate(uuid, id)
  return http<ShareResponse>(url, {
    method,
    body: { accessCode } satisfies ShareAuthPayload,
  })
}

export async function createGuestShare(
  uuid: string,
  data: CreateSharePayload
): Promise<ShareResponse> {
  const { url, method } = ShareAPI.createGuest(uuid)
  return http<ShareResponse>(url, {
    method,
    body: data,
  })
}
