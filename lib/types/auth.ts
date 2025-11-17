import { z } from "zod"

// types/auth
export const AuthSigninSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type AuthSigninRequest = z.infer<typeof AuthSigninSchema>

export interface AuthSigninResponse {
  ok: boolean
  expires?: number
  message?: string
  accessToken?: string // optional for convenience
}

export interface AuthBackendSigninResponse {
  accessToken: string
  expires: number
}