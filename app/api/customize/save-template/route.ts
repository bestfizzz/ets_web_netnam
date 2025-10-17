import { NextResponse } from "next/server"
import { readTemplates, writeTemplates } from "@/lib/api"
import { generateId } from "@/lib/utils"
// POST = create new template
export async function POST(req: Request) {
  try {
    const { pageType, name, data } = await req.json()
    if (!["search", "share"].includes(pageType)) {
      return NextResponse.json({ error: "Invalid pageType" }, { status: 400 })
    }

    const templates = await readTemplates()

    const newTemplate = {
      pageType,
      id: generateId(pageType),
      name,
      data:{
        settings:data.settings,
        content:data.content,
      },
    }

    templates.push(newTemplate)
    await writeTemplates(templates)

    return NextResponse.json({ success: true, template: newTemplate })
  } catch (err: any) {
    console.error("Error creating template:", err)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}

// PUT = update existing template
export async function PUT(req: Request) {
  try {
    const { id, name, data } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }
    console.log(data)
    const dataSchema = {
      settings: data.settings,
      content: data.content
    }
    const templates = await readTemplates()
    const index = templates.findIndex(t => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    templates[index] = { ...templates[index], name, data:dataSchema }
    await writeTemplates(templates)

    return NextResponse.json({ success: true, template: templates[index] })
  } catch (err: any) {
    console.error("Error updating template:", err)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}
