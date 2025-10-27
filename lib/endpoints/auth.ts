import { AuthSigninRequest, AuthBackendSigninResponse } from "@/lib/types/types"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!
const AUTH_BASE = `${BASE}/auth`

export const AuthServerAPI = {
  signin: {
    url: `${AUTH_BASE}/signin`,
    method: "POST" as const,
    body: {} as AuthSigninRequest,
    response: {} as AuthBackendSigninResponse,
  },
}
