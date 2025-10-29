'use server'
import { cookies } from "next/headers"
import { decodeJwt } from "jose"

// !!!!! IMPORTANT: This function assumes the JWT is verified by middleware
export async function getCurrentUser() {
  const cookieStore = cookies()
  const session = (await cookieStore).get("session")?.value
  if (!session) return null

  try {
    const decoded = decodeJwt(session)
    return {
      user: decoded.user
    }
  } catch (err) {
    console.error("❌ Failed to decode JWT:", err)
    return null
  }
}

