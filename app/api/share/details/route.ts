import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    })

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Get share details error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Post share details error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

