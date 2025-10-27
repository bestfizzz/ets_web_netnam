'use server'

import { http } from "@/lib/http"
import { AuthServerAPI } from "@/lib/endpoints/auth"
import type { AuthSigninRequest, AuthBackendSigninResponse } from "@/lib/types/auth"

// 🔹 Next.js server → backend
export async function loginUser(payload: AuthSigninRequest): Promise<AuthBackendSigninResponse> {
  const { url, method } = AuthServerAPI.signin

  return http<typeof AuthServerAPI.signin.response>(url, {
    method,
    body: payload,
  })
}
