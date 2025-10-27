'use server'
import { cookies } from "next/headers"
import { promises as fs } from "fs"
import path from "path"
import { decodeJwt } from "jose"

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