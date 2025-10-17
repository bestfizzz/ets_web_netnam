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

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const pageCustomizeRef = React.useRef<any>(null)

  const [pageName, designID] = params.id as string[]
  const [pageData, setPageData] = React.useState<any>(null)
  const [designName, setDesignName] = React.useState<string>("")
  const [loading, setLoading] = React.useState(true)
  const [notFoundState, setNotFoundState] = React.useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [onRequest, setOnRequest] = React.useState(false)

  // Fetch template data
  React.useEffect(() => {
    if (!designID) {
      setNotFoundState(true)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/customize/get-template?id=${designID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) throw new Error("Failed to load page")

        const { data } = await res.json()

        if (!data) {
          setNotFoundState(true)
        } else {
          setPageData(data)
          setDesignName(data.name)
        }
      } catch {
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [designID])

  if (notFoundState) {
    return notFound()
  }

  // Save template
  const handleSave = async (formData: any) => {
    try {
      setOnRequest(true);

      const res = await fetch(`/api/customize/save-template`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          id: designID,
          data: formData,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(`✅ Saved ${pageName} (${formData.name})`);
      router.push("/admin/customize");
    } catch (err: any) {
      toast.error(`Error saving: ${err.message}`);
    } finally {
      setOnRequest(false);
    }
  };

  // Delete template
  const handleDelete = async () => {
    try {
      setOnRequest(true)
      const res = await fetch(`/api/customize/delete-template`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: designID }),
      })

      if (!res.ok) throw new Error("Failed to delete")

      toast.success(`✅ Deleted ${pageName} (${designName})`)
      router.push("/admin/customize")
    } catch (err: any) {
      toast.error(`Error deleting: ${err.message}`)
    } finally {
      setDeleteDialogOpen(false)
      setOnRequest(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 flex flex-col gap-4">
        <BackButton path={"/admin/customize"} />
        {loading && <SkeletonLoading />}
        {!loading && pageData && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold capitalize hidden xs:block">
                Editing {pageName} - {designName}
              </h1>
              <h1 className="text-2xl font-bold capitalize xs:hidden mr-2">
                {designName}
              </h1>
              <div className="flex gap-2 xs:gap-3">
                {/* ShadCN AlertDialog for Delete */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="h-9 w-19 gap-1 xs:w-fit" variant="destructive" type="button">
                      <Trash2 className="h-2 w-2 xs:h-4 xs:w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <strong>{designName}</strong>? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={onRequest}>Delete</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  type="button"
                  onClick={() => pageCustomizeRef.current?.handleSubmit(handleSave)()}
                  disabled={onRequest}  
                >
                  {onRequest ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            <PageCustomize
              pageName={pageName}
              pageData={pageData}
              selectedDesign={designID}
              onDesignChange={() => { }}
              templateOptions={[]}
              ref={pageCustomizeRef}
            />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
