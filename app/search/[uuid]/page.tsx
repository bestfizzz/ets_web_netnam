import TemplateGenerator from "@/components/customize/template-generator"
import { TemplateDetailServerAPI } from "@/lib/server_api/template-detail"
import { URLManagerServerAPI } from "@/lib/server_api/url-manager"
import searchTemplate1 from "@/config/template-search-default-1.json"
import { TemplateDetail } from "@/lib/types/types"
import type { TypedObject } from "@portabletext/types"

export default async function SearchPage({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = await params

  let isValid
  let templateData: TemplateDetail

  try {
    // ✅ Safely check URL validity
    isValid = await URLManagerServerAPI.checkUrl(uuid)
  } catch (err) {
    console.error("checkUrl failed:", err)
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
      return typeName === "search"
    })
    templateData = found || searchTemplate1
  } catch (err) {
    console.error("getPageDetails failed:", err, "... using default template")
    templateData = searchTemplate1
  }
  console.log(`Using template ${templateData.name} for uuid ${uuid} templateData:`, templateData)
  const content: TypedObject[] = (templateData.jsonConfig.content as TypedObject[]) || []

  return (
    <TemplateGenerator
      content={content}
      settings={templateData.jsonConfig.settings}
      pageName={
        typeof templateData.templateType === "string"
          ? templateData.templateType
          : templateData.templateType.name
      } 
      uuid={uuid}
    />
  )
}
