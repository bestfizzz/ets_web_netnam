"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { UrlForm, UrlFormData } from "./url-form"
import { URL } from "@/components/url/url-table"
import { Profile } from "../share/share-detail-table"
import { toast } from "sonner"

// ---------------- EDIT MODAL ----------------
type UrlEditModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: URL | null
}

export function UrlEditModal({ open, onOpenChange, url }: UrlEditModalProps) {
  const router = useRouter()
  const [profileList, setProfileList] = React.useState({
    facebook: [] as Profile[],
    twitter: [] as Profile[],
    linkedin: [] as Profile[],
  })
  const [designs, setDesigns] = React.useState<{ pageType: string; id: string; name: string }[]>([])
  const formId = "url-edit-form"
  React.useEffect(() => {
    if (!open) return
    async function fetchData() {
      try {
        const res = await fetch("/api/customize/get-template")
        const data = await res.json()
        setDesigns(data.data) // 👈 store designs
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [open])


  // Fetch social accounts when modal opens
  React.useEffect(() => {
    if (!open) return
    async function fetchData() {
      try {
        const res = await fetch("/api/share-platform")
        const data = await res.json()
        setProfileList(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [open])

  if (!url) return null
  const handleSubmit = async (data: UrlFormData) => {
    try {
      console.log("Submitting", data)
      // await fetch("/api/url", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ data, uuid: url.uuid}),
      // })
      const res = await fetch(`/api/url-manager/${url.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
      if (!res.ok) throw new Error(res.statusText)
      onOpenChange(false)
      router.refresh() // Refresh the page to update the list
      toast.success("URL updated successfully")
    } catch (err) {
      console.error("Failed to update URL:", err)
      toast.error("Failed to update URL")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {url.name}</DialogTitle>
          <DialogDescription>Update details for this URL. Click save when done.</DialogDescription>
        </DialogHeader>

        <UrlForm
          url={url}
          onSubmit={handleSubmit}
          facebookAccounts={profileList.facebook}
          twitterAccounts={profileList.twitter}
          linkedinAccounts={profileList.linkedin}
          designs={designs}
          formId={formId}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={formId}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- ADD MODAL ----------------
export function UrlAddModal() {
  const router = useRouter()
  const [profileList, setProfileList] = React.useState({
    facebook: [] as Profile[],
    twitter: [] as Profile[],
    linkedin: [] as Profile[],
  })
  const [open, setOpen] = React.useState(false)
  const [designs, setDesigns] = React.useState<{ pageType: string; id: string; name: string }[]>([])

  const formId = "url-add-form"
  React.useEffect(() => {
    if (!open) return
    async function fetchData() {
      try {
        const res = await fetch("/api/customize/get-template")
        const data = await res.json()
        setDesigns(data.data) // 👈 store designs
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [open])

  // Fetch social accounts once on mount
  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/share-platform")
        const data = await res.json()
        setProfileList(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (data: UrlFormData) => {
    try {
      const res = await fetch("/api/url-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
      if (!res.ok) throw new Error(res.statusText)
      setOpen(false)
      router.refresh() // Refresh the page to update the list
      toast.success("URL added successfully")
    } catch (err) {
      console.error("Failed to add URL:", err)
      toast.error("Failed to add URL")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-4">
          Add URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new URL</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when done.</DialogDescription>
        </DialogHeader>

        <UrlForm
          onSubmit={handleSubmit}
          facebookAccounts={profileList.facebook}
          twitterAccounts={profileList.twitter}
          linkedinAccounts={profileList.linkedin}
          designs={designs}
          formId={formId}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={formId}>
            Add URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- DELETE MODAL ----------------
type UrlDeleteModalProps = {
  url: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UrlDeleteModal({ url, open, onOpenChange }: UrlDeleteModalProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  if (!url) return null

  const handleDelete = async () => {
    setLoading(true)
    try {
      // const res = await fetch("/api/url", {
      //   method: "DELETE",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ id: url.id }),
      // })
      const res = await fetch(`/api/url-manager/${url.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success(`URL "${url.name}" deleted`)
      onOpenChange(false) // close after delete
      router.refresh()
    } catch (err) {
      toast.error("Error deleting URL")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {url.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 text-white" onClick={handleDelete} disabled={loading}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
