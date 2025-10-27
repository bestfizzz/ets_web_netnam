import { NextRequest, NextResponse } from "next/server"
import { listUrlManagers, createUrlManager } from "@/lib/api/url-manager"

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await listUrlManagers(accessToken)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get URL Managers error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data } = await req.json()
    const result = await createUrlManager(
      { name: data.name, shareDetailIds: data.shareDetailIds },
      accessToken
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error("Create URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
