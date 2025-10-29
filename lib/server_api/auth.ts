import { http } from "@/lib/http"
import type { AuthSigninRequest, AuthBackendSigninResponse } from "@/lib/types/auth"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!
const AUTH_BASE = `${BASE}/auth`

export const AuthServerAPI = {
  /** Sign in a user */
  signin: (payload: AuthSigninRequest) =>
    http<AuthBackendSigninResponse>(`${AUTH_BASE}/signin`, {
      method: "POST",
      body: payload,
    }),
}
