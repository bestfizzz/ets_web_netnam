import { http } from "@/lib/http"
import type { AuthSigninRequest, AuthSigninResponse } from "@/lib/types/auth"
import { NextResponse } from "next/server"

const BASE = "/api/auth" // proxy route

export const AuthClientAPI = {
  /** Sign in (proxied through Next.js API) */
  signin: (payload: AuthSigninRequest) =>
    http<AuthSigninResponse>(`${BASE}/login`, {
      method: "POST",
      body: payload,
      credentials: "include",
    }),

  /** Logout (proxied) */
  logout: () =>
    http<NextResponse>(`${BASE}/logout`, {
      method: "POST",
    })
}
