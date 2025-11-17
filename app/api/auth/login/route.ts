import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { AuthServerAPI } from "@/lib/server_api/auth"
import { AuthSigninSchema } from "@/lib/types/auth"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function POST(req: Request) {
  try {
    // 🔹 Validate input using Zod
    const json = await req.json()
    const parsed = AuthSigninSchema.safeParse(json)

    if (!parsed.success) {
      logger.warn("Invalid login attempt - schema validation failed", {
        context: LoggerContext.AuthServer,
        validationErrors: parsed.error,
      })

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    logger.info("Login attempt", { context: LoggerContext.AuthServer })
    logger.debug("Login attempt details", {
      context: LoggerContext.AuthServer,
      email,
    })

    // 🔥 Try to sign in — if wrong credentials, catch and return 401
    let accessToken: string
    let expires: number

    try {
      const result = await AuthServerAPI.signin({ email, password })
      accessToken = result.accessToken
      expires = result.expires
    } catch (authError) {
      logger.warn("Authentication failed - invalid credentials", {
        context: LoggerContext.AuthServer,
        email,
      })

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // 🔐 Create session JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const sessionToken = await new SignJWT({ user: email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
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
  } catch (err) {
    // 🔥 Server errors only
    logger.error("Login failed (server error)", {
      context: LoggerContext.AuthServer,
      error: err instanceof Error ? err.message : String(err),
    })

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
