import { NextResponse } from "next/server"
import searchTemplate1 from "@/config/template-search-default-1.json"
import searchTemplate2 from "@/config/template-search-default-2.json"
import shareTemplate1 from "@/config/template-share-default-1.json"
import { readTemplates } from "@/lib/api"

// Default templates 
export const templateOptions = [
  { pageType: "search", id: "srch_b47d92aa", name: "Default 1", data: searchTemplate1 },
  { pageType: "search", id: "srch_c3e81b55", name: "Default 2", data: searchTemplate2 },
  { pageType: "share", id: "srch_d8f72e11", name: "Default 1", data: shareTemplate1 },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pageType = searchParams.get("pageType")
  const id = searchParams.get("id")

  let result = await readTemplates()
  if (pageType) {
    result = result.filter((d) => d.pageType === pageType)
  }

  if (id) {
    const found = result.find((d) => d.id === id)
    if (!found) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }
    return NextResponse.json({ data: found })
  }

  return NextResponse.json({ data: result })
}

export async function POST(req: Request) {
  try {
    const { pageType } = await req.json()

    if (!pageType) {
      return NextResponse.json({ error: "pageType is required" }, { status: 400 })
    }

    const filtered = templateOptions.filter(t => t.pageType === pageType)

    return NextResponse.json({ data: filtered })
  } catch (err) {
    console.error("❌ API Error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
