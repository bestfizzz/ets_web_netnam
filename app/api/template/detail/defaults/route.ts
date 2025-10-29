import { NextResponse } from "next/server"
import searchTemplate1 from "@/config/template-search-default-1.json"
import searchTemplate2 from "@/config/template-search-default-2.json"
import shareTemplate1 from "@/config/template-share-default-1.json"

export const templateOptions = [
  searchTemplate1,
  searchTemplate2,
  shareTemplate1,
]

export async function GET() {
  return NextResponse.json(templateOptions)
}
