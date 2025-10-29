import { NextRequest, NextResponse } from "next/server"
import { SharePlatformServerAPI } from "@/lib/server_api/share-platform"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const token = req.cookies.get("accessToken")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const res = await SharePlatformServerAPI.get(Number(id), token)
    return NextResponse.json(res, { status: 200 })
  } catch (err) {
    console.error("Get Share Platform error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const token = req.cookies.get("accessToken")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const res = await SharePlatformServerAPI.update(Number(id), body, token)
    return NextResponse.json(res, { status: 200 })
  } catch (err) {
    console.error("Update Share Platform error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const token = req.cookies.get("accessToken")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await SharePlatformServerAPI.delete(Number(id), token)
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Delete Share Platform error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
