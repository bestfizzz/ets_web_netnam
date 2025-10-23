// app/api/url-manager/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("accessToken")?.value
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/url-manager`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Get URL Managers error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("accessToken")?.value
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data } = await req.json()
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/url-manager`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({name:data.name,shareDetailIds:data.shareDetailIds}), 
    })

    const res = await backendRes.json()
    return NextResponse.json(res, { status: backendRes.status })
  } catch (err) {
    console.error("Create URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


