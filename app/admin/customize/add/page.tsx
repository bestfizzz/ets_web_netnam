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

const pages = ["search", "share"]

export default function CustomizeAddPage() {
  const router = useRouter()
  const [selectedPage, setSelectedPage] = React.useState(pages[0])
  const [selectedDesign, setSelectedDesign] = React.useState<string>("")
  const [pageData, setPageData] = React.useState<any>(null)
  const [templates, setTemplates] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [onRequest, setOnRequest] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const pageCustomizeRef = React.useRef<any>(null)

  // Fetch templates by page type
  React.useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      setError(null)
      setPageData(null)
      setTemplates([])

      try {
        const res = await fetch("/api/customize/get-template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageType: selectedPage }),
        })

        if (!res.ok) throw new Error("Failed to fetch templates")

        const { data } = await res.json()

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No templates found for this page type")
        }

        setTemplates(data)

        // pick first template as default
        setSelectedDesign(data[0].id)
        setPageData(data[0].data)
      } catch (err: any) {
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [selectedPage])

  // Load template when selectedDesign changes
  React.useEffect(() => {
    const template = templates.find(t => t.id === selectedDesign)
    if (template) {
      setPageData(template)
      toast.info(`Loaded ${capitalizeFirstLetter(selectedPage)} template "${template.name}"`)
    }
  }, [selectedDesign, templates])

  const handleSave = async (formData: any) => {
    try {
      setOnRequest(true)
      const res = await fetch(`/api/customize/save-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageType: selectedPage,
          name: formData.name,
          data: formData,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast.success(`Saved new design ${formData.name} for ${selectedPage}`)
      router.push("/admin/customize")
    } catch (err: any) {
      toast.error(`Error saving template: ${err.message || err}`)
    } finally {
      setOnRequest(false)
    }
  }

  const templateOptions = templates.map(t => ({ id: t.id, label: t.name }))

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <BackButton path={"/admin/customize"} />

        {/* Tabs for page selection + Save button */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex space-x-2">
            {pages.map((page) => (
              <button
                key={page}
                className={`px-4 py-2 -mb-px font-medium border-b-2 transition-colors
                  ${selectedPage === page
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => setSelectedPage(page)}
              >
                <p className="capitalize">{page}</p>
              </button>
            ))}
          </div>

          <Button
            variant="default"
            size="lg"
            className="h-9"
            onClick={() => pageCustomizeRef.current?.handleSubmit(handleSave)()}
            disabled={onRequest}
          >
            {onRequest ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div>
          {loading && <SkeletonLoading />}
          {error && <p className="text-red-500">❌ {error}</p>}
          {!loading && pageData && (
            <PageCustomize
              pageName={selectedPage}
              pageData={pageData}
              selectedDesign={selectedDesign}
              onDesignChange={setSelectedDesign}
              templateOptions={templateOptions}
              ref={pageCustomizeRef}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
