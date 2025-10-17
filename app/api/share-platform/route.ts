import { NextResponse } from "next/server"

let shareProfiles = {
  facebook: [{ id: "1", contact: "fb_user1@example.com", accessCode: "FB123" }],
  twitter: [{ id: "1", contact: "@tw_user1", accessCode: "TW123" }],
  linkedin: [{ id: "1", contact: "linkedin.com/in/user1", accessCode: "LI123" }],
}

export async function GET() {
  return NextResponse.json(shareProfiles)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { socialPlatform, contact, accessCode } = body

  if (!["facebook", "twitter", "linkedin"].includes(socialPlatform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
  }

  const newProfile = {
    id: Date.now().toString(),
    contact,
    accessCode,
  }

  shareProfiles[socialPlatform as keyof typeof shareProfiles].push(newProfile)

  return NextResponse.json({ success: true, newProfile })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { socialPlatform, id, contact, accessCode } = body

  if (!["facebook", "twitter", "linkedin"].includes(socialPlatform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
  }

  const profiles = shareProfiles[socialPlatform as keyof typeof shareProfiles]
  const idx = profiles.findIndex((p) => p.id === id)

  if (idx === -1) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  profiles[idx] = {
    ...profiles[idx],
    contact: contact ?? profiles[idx].contact,
    accessCode: accessCode ?? profiles[idx].accessCode,
  }

  return NextResponse.json({ success: true, updated: profiles[idx] })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { socialPlatform, id } = body

  if (!["facebook", "twitter", "linkedin"].includes(socialPlatform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
  }

  const profiles = shareProfiles[socialPlatform as keyof typeof shareProfiles]
  const idx = profiles.findIndex((p) => p.id === id)

  if (idx === -1) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  const deleted = profiles.splice(idx, 1)[0]

  return NextResponse.json({ success: true, deleted })
}