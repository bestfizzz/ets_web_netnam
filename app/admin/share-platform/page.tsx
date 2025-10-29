import AdminLayout from "@/components/layout-admin"
import ShareDetailsClient from "@/components/share/share-detail-client"
import { ShareDetailClientAPI } from "@/lib/client_api/share-detail.client"
import { SharePlatformClientAPI } from "@/lib/client_api/share-platform.client"
import { cookies } from "next/headers"

export default async function Page() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  const accessToken = cookieStore.get("accessToken")?.value

  // Load both share platforms and share details concurrently
  const [platformsResult, detailsResult] = await Promise.allSettled([
    SharePlatformClientAPI.serverList(session,accessToken),
    ShareDetailClientAPI.serverList(session,accessToken),
  ])
  console.log("Platforms Result:", platformsResult)
  console.log("Details Result:", detailsResult)
  const platforms =
    platformsResult.status === "fulfilled" ? platformsResult.value : []
  const details =
    detailsResult.status === "fulfilled" ? detailsResult.value : []

  const error =
    platformsResult.status === "rejected" || detailsResult.status === "rejected"

  return (
    <AdminLayout>
      <div className="flex flex-col gap-3 p-3 xs:gap-6 xs:p-6">
        <ShareDetailsClient
          platforms={platforms}
          data={details}
          error={error ? true : undefined}
        />
      </div>
    </AdminLayout>
  )
}
