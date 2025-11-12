"use client"

import * as React from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { PageCustomize } from "@/components/customize/page-customize"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import AdminLayout from "@/components/layout-admin"
import BackButton from "@/components/back-button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { capitalizeFirstLetter } from "@/lib/utils"
import { TemplateDetail } from "@/lib/types/types"
import { TemplateDetailClientAPI } from "@/lib/client_api/template-detail.client"
import EmailEditor from "@/components/customize/email-editor"

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const pageCustomizeRef = React.useRef<any>(null)

  const [pageName, designID] = params.id as string[]
  const [pageData, setPageData] = React.useState<TemplateDetail | null>(null)
  const [designName, setDesignName] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [notFoundState, setNotFoundState] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [onRequest, setOnRequest] = React.useState(false)

  // 🧠 Fetch template by ID
  React.useEffect(() => {
    if (!designID) {
      setNotFoundState(true)
      return
    }

    const fetchTemplate = async () => {
      setLoading(true)
      try {
        const data = await TemplateDetailClientAPI.get(Number(designID))

        if (!data) throw new Error("Template not found")
        setPageData(data)
        setDesignName(data.name)
        toast.info(
          `Loaded ${capitalizeFirstLetter(data.templateType.name)} template "${data.name}"`
        )
      } catch (err: any) {
        console.error("Error fetching template:", err)
        toast.error(err.message || "Failed to load template")
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [designID])

  if (notFoundState) return notFound()

  // 🧠 Save updated template
  const handleSave = async (formData: any) => {
    try {
      setOnRequest(true)
      const { name, isActive,...restData } = formData
      await TemplateDetailClientAPI.update(Number(designID), {
        name: name,
        isActive: isActive,
        jsonConfig: restData,
        templateTypeId: pageData?.templateType.id!,
      })
      toast.success(`✅ Saved ${pageName} (${name})`)
      router.push("/admin/customize")
    } catch (err: any) {
      console.error("Error saving:", err)
      toast.error(err.message || "Error saving template")
    } finally {
      setOnRequest(false)
    }
  }

  // 🧠 Delete template
  const handleDelete = async () => {
    try {
      setOnRequest(true)
      await TemplateDetailClientAPI.delete(Number(designID))
      toast.success(`✅ Deleted ${pageName} (${designName})`)
      router.push("/admin/customize")
    } catch (err: any) {
      console.error("Error deleting:", err)
      toast.error(err.message || "Error deleting template")
    } finally {
      setDeleteDialogOpen(false)
      setOnRequest(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-3 xs:p-5 flex flex-col gap-4">
        <BackButton path="/admin/customize" />

        {loading && <SkeletonLoading />}

        {!loading && pageData && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold capitalize hidden xs:block">
                Editing {pageName} - {designName}
              </h1>
              <h1 className="text-xl font-bold capitalize xs:hidden mr-2">
                {designName}
              </h1>

              <div className="flex gap-2 xs:gap-3">
                {/* 🗑️ Delete Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="h-9 w-19 gap-1 xs:w-fit"
                      variant="destructive"
                      type="button"
                    >
                      <Trash2 className="h-2 w-2 xs:h-4 xs:w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <strong>{designName}</strong>?{" "}
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={onRequest}
                      >
                        Delete
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>

                {/* 💾 Save Button -> unified handleSubmit call */}
                <Button
                  type="button"
                  className="w-25 xs:w-auto"
                  onClick={() => {
                    // both PageCustomize (via ref) and EmailEditor (via ref) expose handleSubmit(cb) -> () => Promise
                    pageCustomizeRef.current?.handleSubmit(handleSave)();
                  }}
                  disabled={onRequest}
                >
                  {onRequest ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            {/* Conditional Page Content */}
            {pageName.toLocaleLowerCase() === "email" ? (
              <EmailEditor
                pageData={pageData}
                templateOptions={[]}
                selectedDesign={designID}
                onDesignChange={() => { }}
                ref={pageCustomizeRef}
              />
            ) : (
              <PageCustomize
                pageName={pageName}
                pageData={pageData}
                selectedDesign={designID}
                onDesignChange={() => { }}
                templateOptions={[]}
                ref={pageCustomizeRef}
              />
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}