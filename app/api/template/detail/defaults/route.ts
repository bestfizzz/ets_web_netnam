import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET() {
  try {
    const configDir = path.join(process.cwd(), "config")
    const files = fs.readdirSync(configDir)

    // Match both search and share template patterns
    const matchedFiles = files.filter((file) =>
      /^template-(search|share)-default-\d+\.json$/.test(file)
    )

    const templates = matchedFiles.map((file) => {
      const filePath = path.join(configDir, file)
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"))
      return jsonData
    })

    logger.info("Fetched default templates", {
      context: LoggerContext.TemplateDetailServer,
      count: templates.length,
    })

    return NextResponse.json(templates)
  } catch (err) {
    logger.error("Failed to get default templates", {
      context: LoggerContext.TemplateDetailServer,
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
