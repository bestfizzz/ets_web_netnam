// app/api/url-manager/[uuid]/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await context.params 
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/url-manager/?uuid=${uuid}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Get URL Manager detail error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const uuid = (await context.params).uuid // ✅ await params
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {data} = await req.json()
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/url-manager/${uuid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({name:data.name,shareDetailIds:data.shareDetailIds}),
    })

    const res = await backendRes.json()
    return NextResponse.json(res, { status: backendRes.status })
  } catch (err) {
    console.error("Update URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  try {
    const uuid = (await context.params).uuid // ✅ await params
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/url-manager/${uuid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Delete URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
