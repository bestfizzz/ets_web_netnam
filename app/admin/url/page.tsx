import AdminLayout from "@/components/layout-admin"
import { URLTable, URL } from "@/components/url/url-table"
import { cookies } from "next/headers"
import { Detail } from "@/components/share/share-detail-table"
import { PlatformOption } from "@/components/share/share-form-modal"
// ✅ Fetch Wrapper
async function fetchBackend(url: string) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value
    const accessToken = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.URL}${url}`, {
      cache: "no-store",
      headers: {
        cookie: `session=${session};accessToken=${accessToken}`,
      },
    })

    if (!res.ok) {
      console.error(`API ${url} failed:`, res.status)
      return []
    }

    return res.json()
  } catch (err) {
    console.error(`API ${url} error:`, err)
    return []
  }
}

// ✅ Load all required data concurrently
export default async function Page() {
  const [urls, platforms, shareDetails] = await Promise.all([
    fetchBackend("/api/url-manager") as Promise<URL[]>,
    fetchBackend("/api/share/platforms") as Promise<PlatformOption[]>,
    fetchBackend("/api/share/details") as Promise<Detail[]>,
  ])

  return (
    <AdminLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <URLTable
          tableData={urls}
          platforms={platforms}
          shareDetails={shareDetails}
        />
      </div>
    </AdminLayout>
  )
}
