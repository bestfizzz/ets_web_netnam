'use server'

import { cookies } from "next/headers"
import AdminLayout from "@/components/layout-admin"
import { URLTable } from "@/components/url/url-table"
import {  ShareDetail, SharePlatform,  UrlManager} from "@/lib/types/types"
import { UrlManagerClientAPI } from "@/lib/client_api/url-manager.client"
import { SharePlatformClientAPI } from "@/lib/client_api/share-platform.client"
import { ShareDetailClientAPI } from "@/lib/client_api/share-detail.client"
import { TemplateDetailClientAPI } from "@/lib/client_api/template-detail.client"
import { TemplateTypeClientAPI } from "@/lib/client_api/template-type.client"

// ✅ Load all required data concurrently using ClientAPI
export default async function Page() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  const accessToken = cookieStore.get("accessToken")?.value

  const [urlsResult, platformsResult, shareDetailsResult,templateTypesResult, templateDetailsResult] =
    await Promise.allSettled([
      UrlManagerClientAPI.serverList(session,accessToken),
      SharePlatformClientAPI.serverList(session,accessToken),
      ShareDetailClientAPI.serverList(session,accessToken),
      TemplateTypeClientAPI.serverList(session,accessToken),
      TemplateDetailClientAPI.serverList(session,accessToken),
    ])

  const urls: UrlManager[] =
    urlsResult.status === "fulfilled" ? urlsResult.value : []
  const platforms: SharePlatform[] =
    platformsResult.status === "fulfilled" ? platformsResult.value : []
  const shareDetails: ShareDetail[] =
    shareDetailsResult.status === "fulfilled" ? shareDetailsResult.value : []
  const templateTypes =
    templateTypesResult.status === "fulfilled" ? templateTypesResult.value : []
  const templateDetails =
    templateDetailsResult.status === "fulfilled" ? templateDetailsResult.value : []

  return (
    <AdminLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <URLTable
          tableData={urls}
          platforms={platforms}
          shareDetails={shareDetails}
          templateTypes={templateTypes}
          templateDetails={templateDetails}
        />
      </div>
    </AdminLayout>
  )
}
