"use client"

import * as React from "react"
import AdminLayout from "@/components/layout-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { Plus } from "lucide-react"
import { TemplateTypeClientAPI } from "@/lib/client_api/template-type.client"
import { TemplateDetailClientAPI } from "@/lib/client_api/template-detail.client"
import { TemplateType } from "@/lib/types/types"

export default function Page() {
  const router = useRouter()
  const [types, setTypes] = React.useState<TemplateType[]>([])
  const [templates, setTemplates] = React.useState<Record<string, any[]>>({})
  const [selectedTemplateType, setSelectedTemplateType] = React.useState<string>("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        // 1️⃣ Fetch template types (via client API)
        const typeRes = await TemplateTypeClientAPI.list()
        const allTypes = Array.isArray(typeRes) ? typeRes : []
        setTypes(allTypes)

        if (allTypes.length > 0 && !selectedTemplateType) {
          setSelectedTemplateType(allTypes[0].name)
        }

        // 2️⃣ Fetch template details (via client API)
        const detailRes = await TemplateDetailClientAPI.list()
        const details = Array.isArray(detailRes) ? detailRes : []

        // 3️⃣ Group templates by templateType.name
        const grouped: Record<string, any[]> = {}
        for (const detail of details) {
          const typeName = detail.templateType?.name || "unknown"
          if (!grouped[typeName]) grouped[typeName] = []
          grouped[typeName].push(detail)
        }

        setTemplates(grouped)
      } catch (err: any) {
        setError(err.message || "Failed to load templates")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const currentList = templates[selectedTemplateType] || []

  return (
    <AdminLayout>
      <div className="flex flex-col gap-2 p-6">
        {/* Header and Add Button */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Customize Templates</h1>
          <Button
            className="h-9 w-32 gap-1 xs:w-fit"
            onClick={() => router.push("/admin/customize/add")}
          >
            <span className="hidden xs:block">Add New</span>
            <Plus className="xs:hidden" /> Template
          </Button>
        </div>

        {/* Dynamic Tabs (Template Types) */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div
            className="flex space-x-2 overflow-x-auto no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {types.map((type) => (
              <button
                key={type.id}
                className={`px-4 py-2 -mb-px font-medium border-b-2 transition-colors ${
                  selectedTemplateType === type.name
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTemplateType(type.name)}
              >
                <p className="capitalize">{type.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <SkeletonLoading />
        ) : error ? (
          <p className="text-red-500">❌ {error}</p>
        ) : currentList.length === 0 ? (
          <p className="text-gray-500 mt-4">
            No templates available for "{selectedTemplateType}"
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {currentList.map((design) => (
              <Card
                key={design.id}
                className={`relative cursor-pointer hover:shadow-lg transition-shadow ${
                  !design.isActive ? "opacity-70" : ""
                }`}
                onClick={() =>
                  router.push(
                    `/admin/customize/edit/${selectedTemplateType}/${design.id}`
                  )
                }
              >
                {/* 🔵 Status Badge */}
                <div className="absolute top-5 right-5 flex items-center gap-1">
                  <span
                    className={`text-xs font-medium ${
                      design.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {design.isActive ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      design.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  
                </div>

                <CardHeader>
                  <CardTitle>{design.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Template Id: {design.id}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
