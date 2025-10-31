import { NextRequest, NextResponse } from "next/server"
import { URLManagerServerAPI } from "@/lib/server_api/url-manager"
import { UrlManagerPayload } from "@/lib/types/url-manager"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      logger.warn("Unauthorized access attempt to URL Manager list", { 
        context: LoggerContext.UrlManagerServer 
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching URL Managers list", { 
      context: LoggerContext.UrlManagerServer 
    })
    const data = await URLManagerServerAPI.list(accessToken)
    logger.debug("URL Managers list fetched successfully", { 
      context: LoggerContext.UrlManagerServer,
      count: Array.isArray(data) ? data.length : 0 
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get URL Managers list", {
      context: LoggerContext.UrlManagerServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      logger.warn("Unauthorized access attempt to create URL Manager", { 
        context: LoggerContext.UrlManagerServer 
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: UrlManagerPayload = await req.json()
    logger.info("Creating new URL Manager", { 
      context: LoggerContext.UrlManagerServer
    })
    logger.debug("Creating new URL Manager", { 
      context: LoggerContext.UrlManagerServer,
      body
    })
    const result = await URLManagerServerAPI.create(
      body,
      accessToken
    )

    logger.debug("URL Manager created successfully", { 
      context: LoggerContext.UrlManagerServer,
      id: result.id,
      name: result.name
    })
    return NextResponse.json(result)
  } catch (err) {
    logger.error("Failed to create URL Manager", {
      context: LoggerContext.UrlManagerServer,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
