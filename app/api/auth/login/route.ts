// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { SignJWT } from "jose"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        { statusCode: res.status, message: data.message || "Auth failed" },
        { status: res.status }
      )
    }

    const { accessToken, expires } = data
    // 🔹 JWT session cookie (for middleware / navigation auth check)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const sessionToken = await new SignJWT({ user: email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret)

    const response = NextResponse.json({ ok: true })

    // Store short JWT
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expires * 1000),
    })

    // Store raw access token for API proxying
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expires * 1000),
    })

    return response
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
