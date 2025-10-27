import { http } from "@/lib/http"
import { AuthClientAPI } from "@/lib/endpoints/auth.client"
import type { AuthSigninRequest, AuthSigninResponse } from "@/lib/types/types"
import { NextResponse } from "next/server"

export async function loginClient(payload: AuthSigninRequest): Promise<AuthSigninResponse> {
  const { url, method } = AuthClientAPI.signin

  return http<typeof AuthClientAPI.signin.response>(url, {
    method,
    body: payload,
    credentials: "include",
  })
}

export async function logOutClient(): Promise<NextResponse> {
  const { url, method } = AuthClientAPI.logout

  return http<typeof AuthClientAPI.logout.response>(url, {
    method,
  })
}
