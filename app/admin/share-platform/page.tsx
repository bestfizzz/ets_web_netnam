import { cookies } from "next/headers"
import AdminLayout from "@/components/layout-admin"
import ShareDetailsClient from "@/components/share/share-detail-client"

async function getSharePlatforms(): Promise<{ data: any[]; error?: string }> {
  try {
    const cookieStore = cookies()
    const session = (await cookieStore).get("session")?.value
    const accessToken = (await cookieStore).get("accessToken")?.value

    const res = await fetch(`${process.env.URL}/api/share/platforms`, {
      cache: "no-store",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to fetch platforms:", res.status, text)
      return { data: [], error: `Failed to fetch platforms: ${res.status}` }
    }

    const json = await res.json()
    const data = Array.isArray(json) ? json : json.data ?? []
    return { data }
  } catch (err) {
    console.error("Network error:", err)
    return { data: [], error: "Network error while fetching platforms" }
  }
}

async function getShareDetails(): Promise<{ data: any; error?: string }> {
  try {
    const cookieStore = cookies()
    const session = (await cookieStore).get("session")?.value
    const accessToken = (await cookieStore).get("accessToken")?.value

    const res = await fetch(`${process.env.URL}/api/share/details`, {
      cache: "no-store",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to fetch details:", res.status, text)
      return { data: {}, error: `Failed to fetch details: ${res.status}` }
    }

    const json = await res.json()
    const data = Array.isArray(json) ? json : json.data ?? {}
    return { data }
  } catch (err) {
    console.error("Network error:", err)
    return { data: {}, error: "Network error while fetching details" }
  }
}

export default async function Page() {
  const [platforms, details] = await Promise.all([
    getSharePlatforms(),
    getShareDetails(),
  ])

  const error = platforms.error || details.error

  return (
    <AdminLayout>
      <div className="flex flex-col gap-3 p-3 xs:gap-6 xs:p-6">
        <ShareDetailsClient
          platforms={platforms.data}
          data={details.data}
          error={error ? true : undefined}
        />
      </div>
    </AdminLayout>
  )
}