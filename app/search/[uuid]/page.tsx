import TemplateGenerator from "@/components/customize/template-generator"
import { TemplateDetailServerAPI } from "@/lib/server_api/template-detail"

import searchTemplate1 from "@/config/template-search-default-1.json"
import { SearchTemplateDetail, SearchTemplateJsonConfig } from "@/lib/types/types"
import type { TypedObject } from "@portabletext/types"
import { AssetsServerAPI } from "@/lib/server_api/assets"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

export default async function SearchPage({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = await params

  let isValid
  let templateData: SearchTemplateDetail

  try {
    // ✅ Safely check URL validity
    isValid = await AssetsServerAPI.checkUrl(uuid)
  } catch (err: any) {
    logger.error("checkUrl failed:", { context: LoggerContext.AssetsServer, error: err instanceof Error ? err.message : String(err)})
    // Leave isValid = false to trigger Not Found
  }

  if (!isValid || isValid.active === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-2xl font-bold">Not Found</h1>
        <p className="mt-2 text-gray-500">
          The requested gallery does not exist or has been deactivated.
        </p>
      </div>
    )
  }

  try {
    const templates = await TemplateDetailServerAPI.getPageDetails(uuid)
    const found = templates.find((t) => {
      const typeName =
        typeof t.templateType === "string" ? t.templateType : t.templateType.name
      return typeName.toLowerCase() === "search"
    }) as SearchTemplateDetail
    templateData = found || searchTemplate1
  } catch (err) {
    logger.error(`getPageDetails failed: ${err} ... using default template`, { context: LoggerContext.TemplateDetailServer })
    templateData = searchTemplate1
  }

  if (templateData.isActive === false) {
    templateData = searchTemplate1
  }

  logger.info(`Using template ${templateData.name} for uuid ${uuid}`, { context: LoggerContext.TemplateDetailServer })
  logger.debug(`Using template ${templateData.name} for uuid ${uuid} templateData:`, { context: LoggerContext.TemplateDetailServer, templateData })
  const content: TypedObject[] = ((templateData.jsonConfig as SearchTemplateJsonConfig).content as TypedObject[]) || []

  return (
    <TemplateGenerator
      content={content}
      settings={(templateData.jsonConfig as SearchTemplateJsonConfig).settings}
      pageName={
        typeof templateData.templateType === "string"
          ? templateData.templateType
          : templateData.templateType.name
      }
      uuid={uuid}
    />
  )
}
