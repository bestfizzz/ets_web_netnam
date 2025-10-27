import { AuthSigninRequest, AuthSigninResponse } from "@/lib/types/types"
import { NextResponse } from "next/server"

const AUTH_PROXY_BASE = `/api/auth`

export const AuthClientAPI = {
  signin: {
    url: `${AUTH_PROXY_BASE}/login`,
    method: "POST" as const,
    body: {} as AuthSigninRequest,
    response: {} as AuthSigninResponse,
  },
  logout: {
    url: `${AUTH_PROXY_BASE}/logout`,
    method: "POST" as const,
    response: {} as NextResponse,
  },
}
