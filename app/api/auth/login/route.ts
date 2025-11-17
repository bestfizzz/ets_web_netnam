import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { AuthServerAPI } from "@/lib/server_api/auth"
import { AuthSigninSchema } from "@/lib/types/auth"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function POST(req: Request) {
  try {
    // Validate body
    const body = await req.json()
    const parsed = AuthSigninSchema.safeParse(body)

    if (!parsed.success) {
      logger.warn("Invalid login attempt - schema validation failed", {
        context: LoggerContext.AuthServer
      })
      return NextResponse.json(
        { message: "Bad email or password" },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    logger.info("Login attempt", { context: LoggerContext.AuthServer })
    logger.debug("Login attempt details", {
      context: LoggerContext.AuthServer,
      email
    })

    // Main call (NO inner try/catch)
    const result = await AuthServerAPI.signin({ email, password })

    const accessToken = result.accessToken
    const expires = result.expires // unix seconds

    // Create JWT session — FIXED HERE
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const sessionToken = await new SignJWT({ user: email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(new Date(expires * 1000)) // FIXED
      .sign(secret)

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      expires: new Date(expires * 1000),
    }

    const res = NextResponse.json({ ok: true, expires })
    res.cookies.set("session", sessionToken, cookieOptions)
    res.cookies.set("accessToken", accessToken, cookieOptions)

    logger.debug("Login successful", {
      context: LoggerContext.AuthServer,
      email,
      expiresAt: new Date(expires * 1000).toISOString(),
    })

    return res
  } catch (err: any) {
    const message = err?.message || ""
    const status =
      err?.status ?? err?.response?.status ?? err?.statusCode ?? 0

    // Authentication error
    const isAuthError =
      status === 401 ||
      status === 403 ||
      /invalid credentials|unauthorized/i.test(message)

    if (isAuthError) {
      logger.warn("Authentication failed - invalid credentials", {
        context: LoggerContext.AuthServer,
        error: err instanceof Error ? err.message : String(err)
      })
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Server error
    logger.error("Login failed (server error)", {
      context: LoggerContext.AuthServer,
      error: err instanceof Error ? err.message : String(err)
    })

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
