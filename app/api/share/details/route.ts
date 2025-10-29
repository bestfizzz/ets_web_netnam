// app/api/share-detail/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ShareDetailServerAPI } from "@/lib/server_api/share-detail"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await ShareDetailServerAPI.list(token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("List share details error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  try {
    const data = await ShareDetailServerAPI.create(body, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Create share detail error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
