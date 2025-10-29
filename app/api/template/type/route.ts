import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TemplateTypeServerAPI } from "@/lib/server_api/template-type"

export async function GET() {
  try {
    const token = (await cookies()).get("accessToken")?.value
    const data = await TemplateTypeServerAPI.list(token)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Get template types error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("accessToken")?.value
    const body = await req.json()
    const data = await TemplateTypeServerAPI.create(body, token)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error("Create template type error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
