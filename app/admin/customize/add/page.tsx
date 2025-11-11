"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layout-admin"
import { PageCustomize } from "@/components/customize/page-customize"
import { Button } from "@/components/ui/button"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { toast } from "sonner"
import { capitalizeFirstLetter } from "@/lib/utils"
import BackButton from "@/components/back-button"
import { TemplateDetailClientAPI } from "@/lib/client_api/template-detail.client"
import { TemplateTypeClientAPI } from "@/lib/client_api/template-type.client"
import { TemplateDetail, TemplateType } from "@/lib/types/types"
import EmailEditor from "@/components/customize/email-editor"

export default function CustomizeAddPage() {
  const router = useRouter()
  const [templateTypes, setTemplateTypes] = React.useState<TemplateType[]>([])
  const [templateType, setTemplateType] = React.useState<TemplateType>()
  const [selectedDesign, setSelectedDesign] = React.useState<string>("")
  const [pageData, setPageData] = React.useState<TemplateDetail>()
  const [templates, setTemplates] = React.useState<TemplateDetail[]>([])
  const [allTemplates, setAllTemplates] = React.useState<TemplateDetail[]>([])
  const [loading, setLoading] = React.useState(false)
  const [onRequest, setOnRequest] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const pageCustomizeRef = React.useRef<any>(null)

  // 🧠 Load template types
  React.useEffect(() => {
    const fetchTemplateTypes = async () => {
      try {
        const res = await TemplateTypeClientAPI.list()
        const types = res || []
        if (types.length === 0) throw new Error("No template types found")
        setTemplateTypes(types)
        setTemplateType(types[0])
      } catch (err: any) {
        console.error("Error fetching template types:", err)
        toast.error(err.message || "Failed to load template types")
      }
    }
    fetchTemplateTypes()
  }, [])

  // 🧠 Fetch all default templates
  React.useEffect(() => {
    const fetchAllDefaults = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await TemplateDetailClientAPI.getDefaultsTemplates()
        const all = Array.isArray(res) ? res : []
        if (all.length === 0) throw new Error("No default templates found")
        setAllTemplates(all)
      } catch (err: any) {
        console.error("Error fetching defaults:", err)
        setError(err.message || "Failed to load templates")
        toast.error(err.message || "Failed to load templates")
      } finally {
        setLoading(false)
      }
    }
    fetchAllDefaults()
  }, [])

  // 🧠 Filter by type
  React.useEffect(() => {
    if (!templateType || allTemplates.length === 0) return
    const filtered = allTemplates.filter((t) => t.templateType?.id === templateType.id)
    if (filtered.length === 0) {
      setTemplates([])
      setPageData(undefined)
      toast.warning(`No templates found for "${templateType.name}"`)
      return
    }
    setTemplates(filtered)
    const first = filtered[0]
    setSelectedDesign(first.id)
    setPageData(first)
  }, [templateType, allTemplates])

  // 🧠 Update when selecting new design
  React.useEffect(() => {
    const template = templates.find((t) => t.id === selectedDesign)
    if (template) {
      setPageData(template)
      toast.info(
        `Loaded ${capitalizeFirstLetter(templateType?.name || "")} template "${template.name}"`
      )
    }
  }, [selectedDesign, templates])

  // 🧠 Save
  const handleSave = async (formData: any) => {
    if (!templateType) return
    try {
      setOnRequest(true)
      const { name, ...restData } = formData
      await TemplateDetailClientAPI.create({
        templateTypeId: templateType.id,
        name: name || "Untitled",
        isActive: true,
        jsonConfig: restData,
      })
      toast.success(`✅ Saved new design "${name}" for ${templateType.name}`)
      router.push("/admin/customize")
    } catch (err: any) {
      console.error("Save error:", err)
      toast.error(`Error saving template: ${err.message || err}`)
    } finally {
      setOnRequest(false)
    }
  }

  const templateOptions = templates.map((t) => ({
    id: t.id,
    label: t.name,
  }))

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-3 xs:p-6">
        <BackButton path={"/admin/customize"} />

        {/* Tabs + Save */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex space-x-2">
            {templateTypes.map((template) => (
              <button
                key={template.id}
                className={`px-1.5 xs:px-4 py-2 -mb-px font-medium border-b-2 transition-colors ${
                  templateType?.id === template.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setTemplateType(template)}
              >
                <p className="capitalize">{template.name}</p>
              </button>
            ))}
          </div>

          <Button
            variant="default"
            size="lg"
            className=" w-20 xs:w-auto h-9"
            onClick={() => pageCustomizeRef.current?.handleSubmit(handleSave)()}
            disabled={onRequest || !templateType}
          >
            {onRequest ? "Creating Page..." : "Save Page"}
          </Button>
        </div>

        <div>
          {loading && <SkeletonLoading />}
          {error && <p className="text-red-500">❌ {error}</p>}

          {!loading && pageData && (
            templateType?.name.toLocaleLowerCase() === "email" ? (
              <EmailEditor
                pageData={pageData}
                selectedDesign={selectedDesign}
                onDesignChange={setSelectedDesign}
                templateOptions={templateOptions}
                ref={pageCustomizeRef}
              />
            ) : (
              <PageCustomize
                pageName={templateType?.name || ""}
                pageData={pageData}
                selectedDesign={selectedDesign}
                onDesignChange={setSelectedDesign}
                templateOptions={templateOptions}
                ref={pageCustomizeRef}
              />
            )
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
