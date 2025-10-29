// app/api/template-detail/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { TemplateDetailServerAPI } from "@/lib/server_api/template-detail"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = Number((await context.params).id)

  try {
    const data = await TemplateDetailServerAPI.get(id, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get template detail error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = Number((await context.params).id)
  const body = await req.json()

  try {
    const data = await TemplateDetailServerAPI.update(id, body, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Update template detail error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: number }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = Number((await context.params).id)

  try {
    await TemplateDetailServerAPI.delete(id, token)
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    )
  } catch (err) {
    console.error("Delete template detail error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
