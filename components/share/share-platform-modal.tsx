"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SharePlatformClientAPI } from "@/lib/client_api/share-platform.client"

// 🟩 CREATE
export function AddPlatformModal() {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleAddPlatform = async () => {
    if (!name.trim()) {
      toast.error("Platform name cannot be empty")
      return
    }

    setLoading(true)
    try {
      await SharePlatformClientAPI.create({ name })
      toast.success(`Platform "${name}" added.`)
      setName("")
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to add platform")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Platform</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Platform</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <label className="text-sm font-medium">Platform Name</label>
          <Input
            placeholder="Enter platform name (e.g., Facebook)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddPlatform} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 🟦 UPDATE
interface EditPlatformModalProps {
  id: number
  name: string
}

export function EditPlatformModal({ id, name }: EditPlatformModalProps) {
  const [open, setOpen] = React.useState(false)
  const [platformName, setPlatformName] = React.useState(name)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    setPlatformName(name)
  }, [name])

  const handleSave = async () => {
    if (!platformName.trim()) {
      toast.error("Platform name cannot be empty")
      return
    }

    setLoading(true)
    try {
      await SharePlatformClientAPI.update(id, { name: platformName })
      toast.success(`Platform renamed to "${platformName}".`)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to update platform")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Edit Platform</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Platform</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <label className="text-sm font-medium">Platform Name</label>
          <Input
            placeholder="Enter new name"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 🟥 DELETE
interface DeletePlatformModalProps {
  id: number
  name: string
}

export function DeletePlatformModal({ id, name }: DeletePlatformModalProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await SharePlatformClientAPI.delete(id)
      toast.success(`Platform "${name}" deleted.`)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete platform")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Platform</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{name}</span>?<br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
