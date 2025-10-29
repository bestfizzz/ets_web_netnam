// app/api/template-type/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { TemplateTypeServerAPI } from "@/lib/server_api/template-type"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number((await context.params).id)

  try {
    const data = await TemplateTypeServerAPI.get(id, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get template type by ID error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number((await context.params).id)
  const body = await req.json()

  try {
    const data = await TemplateTypeServerAPI.update(id, body, token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Update template type error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number((await context.params).id)

  try {
    await TemplateTypeServerAPI.delete(id, token)
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Delete template type error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
