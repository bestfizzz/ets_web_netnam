import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TemplateDetailServerAPI } from "@/lib/server_api/template-detail"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const idNum = Number(id)

  try {
    const token = (await cookies()).get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to get template detail", {
        context: LoggerContext.TemplateDetailServer,
        templateDetailId: idNum
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching template detail", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum
    })
    const data = await TemplateDetailServerAPI.get(idNum, token)
    logger.debug("Template detail fetched successfully", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum,
      name: data.name,
      templateType: data.templateType?.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get template detail", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum,
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
  const idNum = Number(id)

  try {
    const token = (await cookies()).get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to update template detail", {
        context: LoggerContext.TemplateDetailServer,
        templateDetailId: idNum
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    logger.info("Updating template detail", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum,
      updates: {
        name: body.name,
        templateTypeId: body.templateTypeId
      }
    })
    const data = await TemplateDetailServerAPI.update(idNum, body, token)
    logger.debug("Template detail updated successfully", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum,
      name: data.name,
      templateType: data.templateType?.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to update template detail", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const idNum = Number(id)

  try {
    const token = (await cookies()).get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to delete template detail", {
        context: LoggerContext.TemplateDetailServer,
        templateDetailId: idNum
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Deleting template detail", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum
    })
    await TemplateDetailServerAPI.delete(idNum, token)
    logger.debug("Template detail deleted successfully", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum
    })
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
  } catch (err) {
    logger.error("Failed to delete template detail", {
      context: LoggerContext.TemplateDetailServer,
      templateDetailId: idNum,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
