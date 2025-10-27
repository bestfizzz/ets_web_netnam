import { NextRequest, NextResponse } from "next/server"
import {
  getSharePlatform,
  updateSharePlatform,
  deleteSharePlatform,
} from "@/lib/api/share-platform"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const token = req.cookies.get("accessToken")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const res = await getSharePlatform(Number(id), token)
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
    const res = await updateSharePlatform(Number(id), body, token)
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

    const res = await deleteSharePlatform(Number(id), token)
    return NextResponse.json(res, { status: 204 })
  } catch (err) {
    console.error("Delete Share Platform error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
