import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { loginUser } from "@/lib/api/auth"
import { AuthSigninSchema } from "@/lib/types/types"

export async function POST(req: Request) {
  try {
    // 🔹 Validate input using zod
    const json = await req.json()
    const parsed = AuthSigninSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 })
    }

    const { email, password } = parsed.data

    // 🔹 Call backend via shared http client
    const { accessToken, expires } = await loginUser({ email, password })

    // 🔹 Sign a short-lived session JWT
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

    return res
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
