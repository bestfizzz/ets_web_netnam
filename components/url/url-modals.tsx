"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { UrlForm } from "./url-form"
import { toast } from "sonner"
import {
  ShareDetail,
  SharePlatform,
  TemplateDetail,
  TemplateType,
  UrlManager,
} from "@/lib/types/types"
import { UrlManagerClientAPI } from "@/lib/client_api/url-manager.client"
import { extractIdsByPrefix } from "@/lib/utils"

// ===== EDIT MODAL =====
type UrlEditModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: UrlManager | null
  platforms?: SharePlatform[]
  shareDetails?: ShareDetail[]
  templateTypes?: TemplateType[]
  templateDetails?: TemplateDetail[]
}

export function UrlEditModal({
  open,
  onOpenChange,
  url,
  platforms = [],
  shareDetails = [],
  templateTypes = [],
  templateDetails = [],
}: UrlEditModalProps) {
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = React.useState<UrlManager | null>(url)
  const [loading, setLoading] = React.useState(false)
  const formId = "url-edit-form"

  React.useEffect(() => {
    if (!open || !url?.uuid) return
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const freshUrl = await UrlManagerClientAPI.get(url.uuid)
        setCurrentUrl(freshUrl)
      } catch (err) {
        console.error("Failed to fetch URL detail:", err)
        toast.error("Failed to fetch URL detail ❌")
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [open, url?.uuid])

  if (!currentUrl) return null

  const handleSubmit = async (payload: any) => {
    console.log("Edit payload:", payload)
    try {
      // Usage
      const shareDetailIds = extractIdsByPrefix(payload, "platform_")
      const templateDetailIds = extractIdsByPrefix(payload, "template_")

      const data = {
        name: payload.name,
        shareDetailIds,
        templateDetailIds,
      }

      await UrlManagerClientAPI.update(currentUrl.uuid, data)
      toast.success("Updated ✅")
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      console.error("Update error:", err)
      toast.error(err.message || "Update failed ❌")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {currentUrl.name}</DialogTitle>
        </DialogHeader>

        <UrlForm
          url={currentUrl}
          onSubmit={handleSubmit}
          platforms={platforms}
          shareDetails={shareDetails}
          templateTypes={templateTypes}
          templateDetails={templateDetails}
          formId={formId}
          loading={loading}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={formId}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ===== ADD MODAL =====
export function UrlAddModal({
  platforms = [],
  shareDetails = [],
  templateTypes = [],
  templateDetails = [],
}: any) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const formId = "url-add-form"

  const handleSubmit = async (payload: any) => {
    try {

      const shareDetailIds = extractIdsByPrefix(payload, "platform_")
      const templateDetailIds = extractIdsByPrefix(payload, "template_")

      const data = {
        name: payload.name,
        shareDetailIds,
        templateDetailIds,
      }

      await UrlManagerClientAPI.create(data)
      toast.success("Added ✅")
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error("Add error:", err)
      toast.error(err.message || "Failed ❌")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add URL</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create URL</DialogTitle>
        </DialogHeader>

        <UrlForm
          onSubmit={handleSubmit}
          platforms={platforms}
          shareDetails={shareDetails}
          templateTypes={templateTypes}
          templateDetails={templateDetails}
          formId={formId}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={formId}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ===== DELETE MODAL =====
export function UrlDeleteModal({ url, open, onOpenChange }: any) {
  const router = useRouter()
  const handleDelete = async () => {
    try {
      await UrlManagerClientAPI.delete(url.uuid)
      toast.success(`Deleted "${url.name}"`)
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      console.error("Delete error:", err)
      toast.error(err.message || "Failed to delete ❌")
    }
  }
  if (!url) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete?</AlertDialogTitle>
          <AlertDialogDescription>{url.name}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
