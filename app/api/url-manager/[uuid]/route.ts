import { NextRequest, NextResponse } from "next/server"
import {
  getUrlManager,
  updateUrlManager,
  deleteUrlManager,
} from "@/lib/api/url-manager"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await context.params
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await getUrlManager(uuid, accessToken)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await context.params
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data } = await req.json()
    const result = await updateUrlManager(
      uuid,
      { name: data.name, shareDetailIds: data.shareDetailIds },
      accessToken
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error("Update URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await context.params
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const result = await deleteUrlManager(uuid, accessToken)
    return NextResponse.json(result)
  } catch (err) {
    console.error("Delete URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
