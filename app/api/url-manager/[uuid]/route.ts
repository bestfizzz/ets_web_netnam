import { NextRequest, NextResponse } from "next/server"
import { URLManagerServerAPI } from "@/lib/server_api/url-manager"
import { UrlManagerPayload } from "@/lib/types/url-manager"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      logger.warn("Unauthorized access attempt to get URL Manager", {
        context: LoggerContext.UrlManagerServer,
        uuid
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching URL Manager details", {
      context: LoggerContext.UrlManagerServer,
      uuid
    })
    const data = await URLManagerServerAPI.get(uuid, accessToken)
    logger.debug("URL Manager details fetched successfully", {
      context: LoggerContext.UrlManagerServer,
      uuid,
      name: data.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get URL Manager details", {
      context: LoggerContext.UrlManagerServer,
      uuid,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      logger.warn("Unauthorized access attempt to update URL Manager", {
        context: LoggerContext.UrlManagerServer,
        uuid
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: UrlManagerPayload = await req.json()
    logger.info("Updating URL Manager", {
      context: LoggerContext.UrlManagerServer,
      uuid,
      updates: {
        name: body.name
      }
    })

    const result = await URLManagerServerAPI.update(
      uuid,
      body,
      accessToken
    )

    logger.debug("URL Manager updated successfully", {
      context: LoggerContext.UrlManagerServer,
      uuid,
      name: result.name
    })
    return NextResponse.json(result)
  } catch (err) {
    logger.error("Failed to update URL Manager", {
      context: LoggerContext.UrlManagerServer,
      uuid,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      logger.warn("Unauthorized access attempt to delete URL Manager", {
        context: LoggerContext.UrlManagerServer,
        uuid
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Deleting URL Manager", {
      context: LoggerContext.UrlManagerServer,
      uuid
    })
    const result = await URLManagerServerAPI.delete(uuid, accessToken)
    logger.debug("URL Manager deleted successfully", {
      context: LoggerContext.UrlManagerServer,
      uuid
    })
    return NextResponse.json(result)
  } catch (err) {
    logger.error("Failed to delete URL Manager", {
      context: LoggerContext.UrlManagerServer,
      uuid,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
