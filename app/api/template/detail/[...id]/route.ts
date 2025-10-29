import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TemplateDetailServerAPI } from "@/lib/server_api/template-detail"

export async function GET(_: Request, { params }: { params: { id: number } }) {
  try {
    const token = (await cookies()).get("accessToken")?.value
    const data = await TemplateDetailServerAPI.get(params.id, token) // ✅ keep as string
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get template detail by ID error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  try {
    const token = (await cookies()).get("accessToken")?.value
    const body = await req.json()
    const data = await TemplateDetailServerAPI.update(params.id, body, token) // ✅ string
    return NextResponse.json(data)
  } catch (err) {
    console.error("Update template detail error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: number } }) {
  try {
    const token = (await cookies()).get("accessToken")?.value
    await TemplateDetailServerAPI.delete(params.id, token) // ✅ string
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Delete template detail error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
