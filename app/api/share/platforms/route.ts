import { NextRequest, NextResponse } from "next/server"
import { SharePlatformServerAPI } from "@/lib/server_api/share-platform"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const res = await SharePlatformServerAPI.list(token)
    return NextResponse.json(res, { status: 200 })
  } catch (err) {
    console.error("Get Share Platforms error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const res = await SharePlatformServerAPI.create({ name: body.name }, token)
    return NextResponse.json(res, { status: 201 })
  } catch (err) {
    console.error("Create Share Platform error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
