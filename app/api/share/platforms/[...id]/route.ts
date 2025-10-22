import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params 
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/platforms/${id}`,
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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await context.params).id // ✅ await params
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    console.log(body)
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share/platforms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await context.params).id // ✅ await params
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share/platforms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      
    const data = await backendRes.json()
    console.log(data)
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Delete URL Manager error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
