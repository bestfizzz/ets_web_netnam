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
import { URL } from "@/components/url/url-table"
import { toast } from "sonner"
import { Detail } from "@/components/share/share-detail-table"

// ===== EDIT MODAL =====
type UrlEditModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: URL | null
  platforms?: { id: number; name: string }[]
  shareDetails?: Detail[]
}

export function UrlEditModal({ open, onOpenChange, url, platforms = [], shareDetails = [] }: UrlEditModalProps) {
  const router = useRouter()
  const [designs, setDesigns] = React.useState<any[]>([])
  const formId = "url-edit-form"

  React.useEffect(() => {
    if (!open) return
    fetch("/api/customize/get-template")
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        const data = await r.json()
        setDesigns(data.data || [])
      })
      .catch((err) => {
        console.error("Template fetch failed:", err)
        toast.error("Failed to load templates ❌")
      })
  }, [open])

  if (!url) return null

  const handleSubmit = async (payload: any) => {
    try {
      const shareDetailIds: number[] = []
      Object.keys(payload).forEach((k) => {
        if (k.startsWith("platform_")) {
          const v = payload[k]
          if (v && v !== "none") {
            const n = Number(v)
            if (!Number.isNaN(n)) shareDetailIds.push(n)
          }
        }
      })

      const data: Record<string, any> = {
        name: payload.name,
        shareDetailIds,
      }

      const res = await fetch(`/api/url-manager/${url.uuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data}),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Update failed")
      }

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
          <DialogTitle>Edit {url.name}</DialogTitle>
        </DialogHeader>

        <UrlForm
          url={url}
          onSubmit={handleSubmit}
          platforms={platforms}
          shareDetails={shareDetails}
          designs={designs}
          formId={formId}
        />

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button type="submit" form={formId}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ===== ADD MODAL =====
export function UrlAddModal({ platforms = [], shareDetails = [] }: any) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [designs, setDesigns] = React.useState<any[]>([])
  const formId = "url-add-form"

  React.useEffect(() => {
    if (!open) return
    fetch("/api/customize/get-template")
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        const data = await r.json()
        setDesigns(data.data || [])
      })
      .catch((err) => {
        console.error("Template fetch failed:", err)
        toast.error("Failed to load templates ❌")
      })
  }, [open])

  const handleSubmit = async (payload: any) => {
    try {
      const shareDetailIds: number[] = []
      Object.keys(payload).forEach((k) => {
        if (k.startsWith("platform_")) {
          const v = payload[k]
          if (v && v !== "none") {
            const n = Number(v)
            if (!Number.isNaN(n)) shareDetailIds.push(n)
          }
        }
      })

      const data = {
        name: payload.name,
        shareDetailIds,
      }

      const res = await fetch("/api/url-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Add failed")
      }

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
      <DialogTrigger asChild><Button>Add URL</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create URL</DialogTitle></DialogHeader>

        <UrlForm
          onSubmit={handleSubmit}
          platforms={platforms}
          shareDetails={shareDetails}
          designs={designs}
          formId={formId}
        />

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button type="submit" form={formId}>Save</Button>
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
      const res = await fetch(`/api/url-manager/${url.uuid}`, { method: "DELETE" })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Delete failed")
      }

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
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
