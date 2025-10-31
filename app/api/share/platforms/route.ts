import { NextRequest, NextResponse } from "next/server"
import { SharePlatformServerAPI } from "@/lib/server_api/share-platform"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to share platforms list", {
        context: LoggerContext.SharePlatformServer
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching share platforms list", {
      context: LoggerContext.SharePlatformServer
    })
    const res = await SharePlatformServerAPI.list(token)
    logger.debug("Share platforms list fetched successfully", {
      context: LoggerContext.SharePlatformServer,
      count: Array.isArray(res) ? res.length : 0
    })
    return NextResponse.json(res, { status: 200 })
  } catch (err) {
    logger.error("Failed to get share platforms list", {
      context: LoggerContext.SharePlatformServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value
    if (!token) {
      logger.warn("Unauthorized access attempt to create share platform", {
        context: LoggerContext.SharePlatformServer
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    logger.info("Creating new share platform", {
      context: LoggerContext.SharePlatformServer
    })
    logger.debug("Creating new share platform", {
      context: LoggerContext.SharePlatformServer,
      name: body.name
    })
    const res = await SharePlatformServerAPI.create({ name: body.name }, token)
    logger.debug("Share platform created successfully", {
      context: LoggerContext.SharePlatformServer,
      id: res.id,
      name: res.name
    })
    return NextResponse.json(res, { status: 201 })
  } catch (err) {
    logger.error("Failed to create share platform", {
      context: LoggerContext.SharePlatformServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
