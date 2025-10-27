import { NextRequest, NextResponse } from "next/server"
import {
  getShareDetail,
  updateShareDetail,
  deleteShareDetail,
} from "@/lib/api/share-detail"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = Number((await context.params).id)

  try {
    const data = await getShareDetail(id, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get share detail error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = Number((await context.params).id)
  const body = await req.json()

  try {
    const data = await updateShareDetail(id, body, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Update share detail error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = Number((await context.params).id)

  try {
    const data = await deleteShareDetail(id, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Delete share detail error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
