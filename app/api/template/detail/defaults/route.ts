import { NextResponse } from "next/server"
import searchTemplate1 from "@/config/template-search-default-1.json"
import searchTemplate2 from "@/config/template-search-default-2.json"
import shareTemplate1 from "@/config/template-share-default-1.json"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export const templateOptions = [
  searchTemplate1,
  searchTemplate2,
  shareTemplate1,
]

export async function GET() {
  try {
    logger.info("Fetching default templates", {
      context: LoggerContext.TemplateDetailServer
    })
    
    logger.debug("Default templates fetched successfully", {
      context: LoggerContext.TemplateDetailServer,
      count: templateOptions.length,
      templates: templateOptions.map(t => t.name)
    })
    
    return NextResponse.json(templateOptions)
  } catch (err) {
    logger.error("Failed to get default templates", {
      context: LoggerContext.TemplateDetailServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
