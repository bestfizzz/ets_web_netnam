import { NextRequest, NextResponse } from "next/server"
import { URLManagerServerAPI } from "@/lib/server_api/url-manager"
import { UrlManagerPayload } from "@/lib/types/url-manager"

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await URLManagerServerAPI.list(accessToken)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get URL Managers error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: UrlManagerPayload = await req.json()
    const result = await URLManagerServerAPI.create(
      body,
      accessToken
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error("Create URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
