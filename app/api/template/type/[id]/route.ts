import { NextRequest, NextResponse } from "next/server"
import { TemplateTypeServerAPI } from "@/lib/server_api/template-type"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const token = req.cookies.get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to get template type", {
        context: LoggerContext.TemplateTypeServer,
        templateTypeId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching template type details", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id
    })
    const data = await TemplateTypeServerAPI.get(Number(id), token)
    logger.debug("Template type details fetched successfully", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id,
      name: data.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get template type details", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const token = req.cookies.get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to update template type", {
        context: LoggerContext.TemplateTypeServer,
        templateTypeId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    logger.info("Updating template type", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id,
      updates: {
        name: body.name
      }
    })

    const data = await TemplateTypeServerAPI.update(Number(id), body, token)
    logger.debug("Template type updated successfully", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id,
      name: data.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to update template type", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const token = req.cookies.get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to delete template type", {
        context: LoggerContext.TemplateTypeServer,
        templateTypeId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Deleting template type", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id
    })
    const data = await TemplateTypeServerAPI.delete(Number(id), token)
    logger.debug("Template type deleted successfully", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to delete template type", {
      context: LoggerContext.TemplateTypeServer,
      templateTypeId: id,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
