import { NextRequest, NextResponse } from "next/server"
import { ShareDetailServerAPI } from "@/lib/server_api/share-detail"
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
      logger.warn("Unauthorized access attempt to get share detail", {
        context: LoggerContext.ShareDetailServer,
        shareDetailId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Fetching share detail", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id
    })
    const data = await ShareDetailServerAPI.get(Number(id), token)
    logger.debug("Share detail fetched successfully", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id,
      name: data.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to get share detail", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
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
      logger.warn("Unauthorized access attempt to update share detail", {
        context: LoggerContext.ShareDetailServer,
        shareDetailId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    logger.info("Updating share detail", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id,
      updates: {
        name: body.name,
        platformId: body.platformId
      }
    })
    
    const data = await ShareDetailServerAPI.update(Number(id), body, token)
    logger.debug("Share detail updated successfully", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id,
      name: data.name
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to update share detail", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
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
      logger.warn("Unauthorized access attempt to delete share detail", {
        context: LoggerContext.ShareDetailServer,
        shareDetailId: id
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Deleting share detail", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id
    })
    const data = await ShareDetailServerAPI.delete(Number(id), token)
    logger.debug("Share detail deleted successfully", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id
    })
    return NextResponse.json(data)
  } catch (err) {
    logger.error("Failed to delete share detail", {
      context: LoggerContext.ShareDetailServer,
      shareDetailId: id,
      error: err instanceof Error ? err.message : String(err)
    })
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}