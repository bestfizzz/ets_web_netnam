'use server'
import { cookies } from "next/headers"
import { promises as fs } from "fs"
import path from "path"
import { decodeJwt } from "jose"

export async function getShareProfiles() {
  try {
    const cookieStore = cookies()
    const session = (await cookieStore).get("session")?.value

    const res = await fetch(`${process.env.URL}/api/share-platform`, {
      cache: "no-store",
      headers: {
        cookie: `session=${session}`,
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("API fetch error:", res.status, errorText)
      return { data: { facebook: [], twitter: [], linkedin: [] }, error: true }
    }

    const data = await res.json()
    return { data, error: false }
  } catch (err) {
    console.error("Network or fetch error:", err)
    return { data: { facebook: [], twitter: [], linkedin: [] }, error: true }
  }
}

// !!!!! IMPORTANT: This function assumes the JWT is verified by middleware
export async function getCurrentUser() {
  const cookieStore = cookies()
  const session = (await cookieStore).get("session")?.value
  if (!session) return null

  try {
    const decoded = decodeJwt(session)
    return {
      user: decoded.user
    }
  } catch (err) {
    console.error("❌ Failed to decode JWT:", err)
    return null
  }
}

// File path to the unified design DB
const DB_FILE = path.join(process.cwd(), "config", "design-db.json")

// Helper to read all templates
export async function readTemplates(): Promise<any[]> {
  try {
    const content = await fs.readFile(DB_FILE, "utf-8")
    return JSON.parse(content)
  } catch {
    return []
  }
}

// Helper to write all templates
export async function writeTemplates(templates: any[]) {
  await fs.writeFile(DB_FILE, JSON.stringify(templates, null, 2), "utf-8")
}

export async function getAllAssets(uuid: string, page = 1, size = 20) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/${uuid}/getAllAssetsId?page=${page}&size=${size}`
  )
  if (!res.ok) throw new Error(`Failed to fetch all assets: ${res.status}`)
  return res.json()
}

export async function getPersonAssets(uuid: string, personId: string, page = 1, size = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/person/${uuid}/page?personId=${personId}&page=${page}&size=${size}`
  )
  if (!res.ok) throw new Error(`Failed to fetch person assets: ${res.status}`)
  return res.json()
}

export async function getPersonAssetStats(uuid: string, personId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/person/${uuid}/statistics?personId=${personId}`
  )
  if (!res.ok) throw new Error(`Failed to fetch person asset stats: ${res.status}`)
  return res.json()
}

export async function getAssetsByKeyword(uuid: string, keyword: string, page = 1, count = 60) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/search/keyword?count=${count}&page=${page}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid, keyword }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to fetch assets: ${res.status} ${errText}`)
  }

  const data = await res.json()
  return data
}

export async function shareAuthentication(uuid: string, id: string, accessCode: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/${uuid}/${id}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessCode: accessCode }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to share item: ${res.status} ${errText}`)
  }

  const data = await res.json()
  return data
}

export async function createGuestShare( uuid:string,data: {
  contact: string
  assetIds: string[]
}) {
  console.log(data)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/guests/${uuid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to create guest share: ${res.status}`)
  }

  return res.json()
}

