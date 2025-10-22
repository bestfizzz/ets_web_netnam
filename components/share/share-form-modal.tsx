"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Detail } from "@/components/share/share-detail-table"

// -------------------- SCHEMA --------------------
const detailFormSchema = z.object({
  name: z.string().min(1, "Detail name is required"),
  platform: z.number().int().min(1, "Platform is required"),
  settings: z.record(z.string(), z.any()).optional(),
})

type DetailFormData = z.infer<typeof detailFormSchema>

export interface PlatformOption {
  id: number
  name: string
}

// -------------------- ADD MODAL --------------------
interface AddShareDetailModalProps {
  platforms: PlatformOption[]
}

export function AddShareDetailModal({ platforms }: AddShareDetailModalProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const [settingsText, setSettingsText] = React.useState("{}")
  const [jsonError, setJsonError] = React.useState<string | null>(null)

  const form = useForm<DetailFormData>({
    resolver: zodResolver(detailFormSchema),
    defaultValues: {
      name: "",
      platform: 0,
      settings: {},
    },
  })

  const handleSubmit = async (data: DetailFormData) => {
    try {
      const parsedSettings = settingsText.trim()
        ? JSON.parse(settingsText)
        : {}
      data.settings = parsedSettings
    } catch {
      toast.error("Invalid JSON in settings")
      return
    }

    setLoading(true)
    const res = await fetch("/api/share/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setLoading(false)

    if (!res.ok) {
      toast.error("Failed to add detail")
      return
    }

    toast.success(`New detail "${data.name}" added.`)
    form.reset()
    setSettingsText("{}")
    setOpen(false)
    router.refresh()
  }

  const handleSettingsChange = (val: string) => {
    setSettingsText(val)
    try {
      JSON.parse(val)
      setJsonError(null)
    } catch (err) {
      setJsonError("Invalid JSON format")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={loading}>Add detail</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Detail</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="detail-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter detail name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* JSON Settings Textarea */}
            <FormItem>
              <FormLabel>Settings (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  value={settingsText}
                  onChange={(e) => handleSettingsChange(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="font-mono text-sm"
                  rows={5}
                />
              </FormControl>
              {jsonError ? (
                <p className="text-red-500 text-sm">{jsonError}</p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Must be valid JSON format.
                </p>
              )}
            </FormItem>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="detail-form"
            disabled={!!jsonError || loading}
          >
            {loading ? "Saving..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------- EDIT MODAL --------------------
interface DetailEditModalProps {
  detail: Detail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: PlatformOption
}

export function EditShareDetailModal({
  detail,
  open,
  onOpenChange,
  platform,
}: DetailEditModalProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [settingsText, setSettingsText] = React.useState("{}")
  const [jsonError, setJsonError] = React.useState<string | null>(null)

  const form = useForm<DetailFormData>({
    resolver: zodResolver(detailFormSchema),
    defaultValues: {
      name: detail?.name ?? "",
      platform: platform.id,
      settings: detail?.settings ?? {},
    },
  })

  React.useEffect(() => {
    if (detail) {
      form.reset({
        name: detail.name,
        platform: platform.id,
        settings: detail.settings ?? {},
      })
      setSettingsText(JSON.stringify(detail.settings ?? {}, null, 2))
    }
  }, [detail, platform, form])

  const handleSettingsChange = (val: string) => {
    setSettingsText(val)
    try {
      JSON.parse(val)
      setJsonError(null)
    } catch {
      setJsonError("Invalid JSON format")
    }
  }

  const handleSubmit = async (data: DetailFormData) => {
    if (!detail) return
    try {
      const parsedSettings = settingsText.trim()
        ? JSON.parse(settingsText)
        : {}
      data.settings = parsedSettings
    } catch {
      toast.error("Invalid JSON in settings")
      return
    }

    setLoading(true)
    const res = await fetch(`/api/share/details/${detail.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setLoading(false)

    if (!res.ok) {
      toast.error("Failed to update detail")
      return
    }

    toast.success(`Detail "${data.name}" updated.`)
    onOpenChange(false)
    router.refresh()
  }

  if (!detail) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Detail</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="edit-detail-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter detail name" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Select value={String(field.value)} disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(platform.id)}>
                          {platform.name}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Settings (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  value={settingsText}
                  onChange={(e) => handleSettingsChange(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="font-mono text-sm"
                  rows={5}
                  disabled={loading}
                />
              </FormControl>
              {jsonError && <p className="text-red-500 text-sm">{jsonError}</p>}
            </FormItem>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="edit-detail-form" disabled={!!jsonError || loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------- DELETE MODAL --------------------
interface DeleteShareDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  detail: Detail | null
  platform: PlatformOption
}

export function DeleteShareDetailModal({
  open,
  onOpenChange,
  detail,
  platform,
}: DeleteShareDetailModalProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  if (!detail) return null

  const platformName = platform.name

  const handleDelete = async () => {
    if (!detail?.id) return
    setLoading(true)
    const res = await fetch(`/api/share/details/${detail.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    setLoading(false)

    if (!res.ok) {
      toast.error("Failed to delete detail")
      return
    }

    toast.success(`Deleted "${detail.name}" from ${platformName}`)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Detail</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{detail.name}</span> from{" "}
            <span className="font-medium">{platformName}</span>?<br />
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
