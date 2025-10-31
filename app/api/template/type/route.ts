import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TemplateTypeServerAPI } from "@/lib/server_api/template-type"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET() {
  try {
    const token = (await cookies()).get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to list template types", {
        context: LoggerContext.TemplateTypeServer
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching template types list", {
      context: LoggerContext.TemplateTypeServer
    })
    const data = await TemplateTypeServerAPI.list(token)
    logger.debug("Template types list fetched successfully", {
      context: LoggerContext.TemplateTypeServer,
      count: Array.isArray(data) ? data.length : 0
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get template types list", {
      context: LoggerContext.TemplateTypeServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to create template type", {
        context: LoggerContext.TemplateTypeServer
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    logger.info("Creating new template type", {
      context: LoggerContext.TemplateTypeServer
    })
    logger.debug("Creating new template type", {
      context: LoggerContext.TemplateTypeServer,
      name: body.name
    })

    const data = await TemplateTypeServerAPI.create(body, token)
    logger.debug("Template type created successfully", {
      context: LoggerContext.TemplateTypeServer,
      id: data.id,
      name: data.name
    })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    logger.error("Failed to create template type", {
      context: LoggerContext.TemplateTypeServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
