import { NextResponse } from "next/server"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function POST() {
  logger.info("User logout requested", {
    context: LoggerContext.AuthServer
  })

  const response = NextResponse.json({ ok: true })
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expire immediately
  })

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expire immediately
  })

  logger.debug("User logged out successfully", {
    context: LoggerContext.AuthServer
  })
  
  return response
}
