import { NextRequest, NextResponse } from "next/server"
import { SharePlatformServerAPI } from "@/lib/server_api/share-platform"
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
      logger.warn("Unauthorized access attempt to get share platform", {
        context: LoggerContext.SharePlatformServer,
        platformId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching share platform details", {
      context: LoggerContext.SharePlatformServer,
      platformId: id
    })
    const res = await SharePlatformServerAPI.get(Number(id), token)
    logger.debug("Share platform details fetched successfully", {
      context: LoggerContext.SharePlatformServer,
      platformId: id,
      name: res.name
    })
    return NextResponse.json(res, { status: 200 })
  } catch (err) {
    logger.error("Failed to get share platform details", {
      context: LoggerContext.SharePlatformServer,
      platformId: id,
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
      logger.warn("Unauthorized access attempt to update share platform", {
        context: LoggerContext.SharePlatformServer,
        platformId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    logger.info("Updating share platform", {
      context: LoggerContext.SharePlatformServer,
      platformId: id
    })
    logger.debug("Updating share platform", {
      context: LoggerContext.SharePlatformServer,
      platformId: id,
      name: body.name
    })
    const res = await SharePlatformServerAPI.update(Number(id), body, token)
    logger.debug("Share platform updated successfully", {
      context: LoggerContext.SharePlatformServer,
      platformId: id,
      name: res.name
    })
    return NextResponse.json(res, { status: 200 })
  } catch (err) {
    logger.error("Failed to update share platform", {
      context: LoggerContext.SharePlatformServer,
      platformId: id,
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
      logger.warn("Unauthorized access attempt to delete share platform", {
        context: LoggerContext.SharePlatformServer,
        platformId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Deleting share platform", {
      context: LoggerContext.SharePlatformServer,
      platformId: id
    })
    const res = await SharePlatformServerAPI.delete(Number(id), token)
    logger.debug("Share platform deleted successfully", {
      context: LoggerContext.SharePlatformServer,
      platformId: id
    })
    return NextResponse.json(res, { status: 200 })
  } catch (err) {
    logger.error("Failed to delete share platform", {
      context: LoggerContext.SharePlatformServer,
      platformId: id,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
