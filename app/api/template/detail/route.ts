import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TemplateDetailServerAPI } from "@/lib/server_api/template-detail"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET() {
  try {
    const token = (await cookies()).get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to list template details", {
        context: LoggerContext.TemplateDetailServer
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching template details list", {
      context: LoggerContext.TemplateDetailServer
    })
    const data = await TemplateDetailServerAPI.list(token)
    logger.debug("Template details list fetched successfully", {
      context: LoggerContext.TemplateDetailServer,
      count: Array.isArray(data) ? data.length : 0
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get template details list", {
      context: LoggerContext.TemplateDetailServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to create template detail", {
        context: LoggerContext.TemplateDetailServer
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    logger.info("Creating new template detail", {
      context: LoggerContext.TemplateDetailServer
    })

    logger.debug("Creating new template detail", {
      context: LoggerContext.TemplateDetailServer,
      body
    })

    const data = await TemplateDetailServerAPI.create(body, token)
    logger.debug("Template detail created successfully", {
      context: LoggerContext.TemplateDetailServer,
      id: data.id,
      name: data.name,
      templateType: data.templateType
    })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    logger.error("Failed to create template detail", {
      context: LoggerContext.TemplateDetailServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
