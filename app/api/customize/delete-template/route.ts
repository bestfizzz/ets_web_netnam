import { NextResponse } from "next/server"
import { writeTemplates,readTemplates } from "@/lib/api"

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }

    const templates = await readTemplates()
    const index = templates.findIndex(t => t.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const [deleted] = templates.splice(index, 1)
    await writeTemplates(templates)

    return NextResponse.json({ success: true, template: deleted })
  } catch (err: any) {
    console.error("Error deleting template:", err)
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}