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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/guests/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Get URL Manager detail error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
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

    const {data} = await req.json()
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share/guests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({name:data.name}),
    })

    const res = await backendRes.json()
    return NextResponse.json(res, { status: backendRes.status })
  } catch (err) {
    console.error("Update URL Manager error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
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

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share/guests/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    console.error("Delete URL Manager error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
