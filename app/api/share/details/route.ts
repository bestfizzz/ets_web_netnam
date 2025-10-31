import { NextRequest, NextResponse } from "next/server"
import { ShareDetailServerAPI } from "@/lib/server_api/share-detail"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) {
    logger.warn("Unauthorized access attempt to list share details", {
      context: LoggerContext.ShareDetailServer
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    logger.info("Fetching share details list", {
      context: LoggerContext.ShareDetailServer
    })
    const data = await ShareDetailServerAPI.list(token)
    logger.debug("Share details list fetched successfully", {
      context: LoggerContext.ShareDetailServer,
      count: Array.isArray(data) ? data.length : 0
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get share details list", {
      context: LoggerContext.ShareDetailServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) {
    logger.warn("Unauthorized access attempt to create share detail", {
      context: LoggerContext.ShareDetailServer
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    logger.info("Creating new share detail", {
      context: LoggerContext.ShareDetailServer
    })

    logger.debug("Creating new share detail", {
      context: LoggerContext.ShareDetailServer,
      body
    })

    const data = await ShareDetailServerAPI.create(body, token)
    logger.debug("Share detail created successfully", {
      context: LoggerContext.ShareDetailServer,
      id: data.id,
      name: data.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to create share detail", {
      context: LoggerContext.ShareDetailServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
