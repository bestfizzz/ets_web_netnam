"use client"

import * as React from "react"
import AdminLayout from "@/components/layout-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { Plus } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const pages = ["search", "share"]
  const [templates, setTemplates] = React.useState<Record<string, any[]>>({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedPage, setSelectedPage] = React.useState<string>(pages[0])
  
  React.useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/customize/get-template?pageType=${selectedPage}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) throw new Error("Failed to fetch templates")
        const { data } = await res.json()

        // API already returns filtered array of templates
        setTemplates(prev => ({ ...prev, [selectedPage]: data }))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [selectedPage])

  return (
    <AdminLayout>
      <div className="flex flex-col gap-2 p-6">
        {/* Header and Add Button */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Customize Templates</h1>
          <Button className="h-9 w-32 gap-1 xs:w-fit" onClick={() => router.push("/admin/customize/add")}>
            <span className="hidden xs:block">Add New</span> <Plus className="xs:hidden"/> Template
          </Button>
        </div>

        {/* Page Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex space-x-2">
            {pages.map(page => (
              <button
                key={page}
                className={`px-4 py-2 -mb-px font-medium border-b-2 transition-colors ${
                  selectedPage === page
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPage(page)}
              >
                <p className="capitalize">{page}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Loading/Error */}
        {loading ? (
          <SkeletonLoading />
        ) : error ? (
          <p className="text-red-500">❌ {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {(templates[selectedPage] || []).length === 0 ? (
              <p className="text-gray-500">No templates available</p>
            ) : (
              (templates[selectedPage] || []).map(design => (
                <Card
                  key={design.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/admin/customize/edit/${selectedPage}/${design.id}`)}
                >
                  <CardHeader>
                    <CardTitle>{design.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{design.id}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
