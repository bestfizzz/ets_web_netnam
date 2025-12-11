import TemplateGenerator from "@/components/customize/template-generator"
import { TemplateDetailServerAPI } from "@/lib/server_api/template-detail"
import shareTemplate1 from "@/config/template-share-default-1.json"
import {
  ShareTemplateDetail,
  ShareTemplateJsonConfig,
} from "@/lib/types/types"
import type { TypedObject } from "@portabletext/types"
import { AssetsServerAPI } from "@/lib/server_api/assets"
import { logger } from "@/lib/logger/logger"
import LoggerContext from "@/lib/logger/logger-context"

/* ---------------------------------------------
    Shared Helpers (same as SearchPage)
---------------------------------------------- */

async function ensureValidUrl(uuid: string) {
  try {
    const result = await AssetsServerAPI.checkUrl(uuid)
    return result?.active === true
  } catch (err) {
    logger.error("checkUrl failed:", {
      context: LoggerContext.AssetsServer,
      error: err instanceof Error ? err.message : String(err),
    })
    return false
  }
}

async function loadTemplate(uuid: string): Promise<ShareTemplateDetail> {
  try {
    const templates = await TemplateDetailServerAPI.getPageDetails(uuid)

    const found = templates.find((t) => {
      const typeName =
        typeof t.templateType === "string"
          ? t.templateType
          : t.templateType.name
      return typeName.toLowerCase() === "share"
    }) as ShareTemplateDetail

    const template = found || (shareTemplate1 as ShareTemplateDetail)

    if (template.isActive === false) {
      return shareTemplate1 as ShareTemplateDetail
    }

    return template
  } catch (err) {
    logger.error(`loadTemplate failed: ${err}`, {
      context: LoggerContext.TemplateDetailServer,
    })
    return shareTemplate1 as ShareTemplateDetail
  }
}

/* ---------------------------------------------
    Metadata
---------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = await params
  const templateData = await loadTemplate(uuid)

  return {
    title:
      templateData.jsonConfig.settings.metaTitle ||
      "NetNam AI Share",
    description:
      templateData.jsonConfig.settings.metaDescription ||
      "NETNAM CORPORATION - Your Net, We Care!",
  }
}

/* ---------------------------------------------
    Page Component
---------------------------------------------- */

export default async function SharePage({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = await params

  // 1. Validate URL (deduped)
  const valid = await ensureValidUrl(uuid)
  if (!valid) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-2xl font-bold">Not Found</h1>
        <p className="mt-2 text-gray-500">
          The requested gallery does not exist or has been deactivated.
        </p>
      </div>
    )
  }

  // 2. Load template (deduped)
  const templateData = await loadTemplate(uuid)

  logger.info(`Using template ${templateData.name} for uuid ${uuid}`, {
    context: LoggerContext.TemplateDetailServer,
  })
  logger.debug(
    `Using template ${templateData.name} for uuid ${uuid} templateData:`,
    {
      context: LoggerContext.TemplateDetailServer,
      templateData,
    }
  )

  const jsonConf = templateData.jsonConfig as ShareTemplateJsonConfig
  const content: TypedObject[] = (jsonConf.content as TypedObject[]) || []

  return (
    <TemplateGenerator
      content={content}
      settings={jsonConf.settings}
      pageName={
        typeof templateData.templateType === "string"
          ? templateData.templateType
          : templateData.templateType.name
      }
      uuid={uuid}
    />
  )
}
