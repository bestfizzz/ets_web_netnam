"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { SharePlatform, ShareDetail } from "@/lib/types/types"
import { ShareDetailClientAPI } from "@/lib/client_api/share-detail.client"

// -------------------- SCHEMA --------------------
const detailFormSchema = z.object({
  name: z.string().min(1, "ShareDetail name is required"),
  platform: z.number().int().min(1, "Platform is required"),
  settings: z.record(z.string(), z.any()).optional(),
})

type DetailFormData = z.infer<typeof detailFormSchema>

// -------------------- KEY-VALUE EDITOR --------------------
interface KeyValue {
  key: string
  value: string
}

function KeyValueEditor({
  pairs,
  onChange,
  disabled = false,
}: {
  pairs: KeyValue[]
  onChange: (pairs: KeyValue[]) => void
  disabled?: boolean
}) {
  const handleAdd = () => {
    onChange([...pairs, { key: "", value: "" }])
  }

  const handleRemove = (index: number) => {
    onChange(pairs.filter((_, i) => i !== index))
  }

  const handleUpdate = (index: number, field: "key" | "value", newVal: string) => {
    const updated = [...pairs]
    updated[index][field] = newVal
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {pairs.map((pair, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            placeholder="Key"
            value={pair.key}
            onChange={(e) => handleUpdate(i, "key", e.target.value)}
            disabled={disabled}
          />
          <Input
            placeholder="Value"
            value={pair.value}
            onChange={(e) => handleUpdate(i, "value", e.target.value)}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleRemove(i)}
            disabled={disabled}
          >
            ✕
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={handleAdd}
        disabled={disabled}
      >
        + Add Field
      </Button>
    </div>
  )
}

// -------------------- ADD MODAL --------------------
interface AddShareDetailModalProps {
  platforms: SharePlatform[]
}

export function AddShareDetailModal({ platforms }: AddShareDetailModalProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [keyValues, setKeyValues] = React.useState<KeyValue[]>([])
  const router = useRouter()

  const form = useForm<DetailFormData>({
    resolver: zodResolver(detailFormSchema),
    defaultValues: {
      name: "",
      platform: 0,
      settings: {},
    },
  })

  const handleSubmit = async (data: DetailFormData) => {
    const settingsObj = keyValues.reduce((acc, kv) => {
      if (kv.key.trim() !== "") acc[kv.key] = kv.value
      return acc
    }, {} as Record<string, any>)
    data.settings = settingsObj
    const toastID = toast.loading("Creating share detail...")
    try {
      setLoading(true)
      await ShareDetailClientAPI.create(data)
      setLoading(false)

      toast.success(`New detail "${data.name}" added.`,{
        id:toastID
      })
      form.reset()
      setKeyValues([])
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setLoading(false)
      toast.error(err.message || "Request failed ❌",{
        id:toastID
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={loading}>Add detail</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New ShareDetail</DialogTitle>
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
                  <FormLabel>ShareDetail Name</FormLabel>
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

            {/* Key-Value Editor */}
            <FormItem>
              <FormLabel>Settings</FormLabel>
              <FormControl>
                <KeyValueEditor
                  pairs={keyValues}
                  onChange={setKeyValues}
                  disabled={loading}
                />
              </FormControl>
              <p className="text-muted-foreground text-xs">
                Add key–value pairs. Empty keys are ignored.
              </p>
            </FormItem>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="detail-form" disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------- EDIT MODAL --------------------
interface DetailEditModalProps {
  detail: ShareDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: SharePlatform
}

export function EditShareDetailModal({
  detail,
  open,
  onOpenChange,
  platform,
}: DetailEditModalProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [keyValues, setKeyValues] = React.useState<KeyValue[]>([])

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
      if (detail.settings) {
        const entries = Object.entries(detail.settings).map(([k, v]) => ({
          key: k,
          value: String(v),
        }))
        setKeyValues(entries)
      }
    }
  }, [detail, platform, form])

  const handleSubmit = async (data: DetailFormData) => {
    if (!detail) return

    const settingsObj = keyValues.reduce((acc, kv) => {
      if (kv.key.trim() !== "") acc[kv.key] = kv.value
      return acc
    }, {} as Record<string, any>)
    data.settings = settingsObj
    const toastID = toast.loading("Updating share detail...")
    try {
      setLoading(true)
      await ShareDetailClientAPI.update(detail.id, data)
      setLoading(false)

      toast.success(`ShareDetail "${data.name}" updated.`,{
        id:toastID
      })
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      setLoading(false)
      toast.error(err.message || "Update failed ❌",{
        id:toastID
      })
    }
  }

  if (!detail) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit ShareDetail</DialogTitle>
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
                  <FormLabel>ShareDetail Name</FormLabel>
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

            {/* Key-Value Editor */}
            <FormItem>
              <FormLabel>Settings</FormLabel>
              <FormControl>
                <KeyValueEditor
                  pairs={keyValues}
                  onChange={setKeyValues}
                  disabled={loading}
                />
              </FormControl>
              <p className="text-muted-foreground text-xs">
                Modify key–value pairs below.
              </p>
            </FormItem>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="edit-detail-form" disabled={loading}>
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
  detail: ShareDetail | null
  platform: SharePlatform
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
    const toastID = toast.loading("Deleting photo...")
    try {
      setLoading(true)
      await ShareDetailClientAPI.delete(detail.id)
      setLoading(false)

      toast.success(`Deleted "${detail.name}" from ${platformName}`,{
        id:toastID
      })
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      setLoading(false)
      toast.error(err.message || "Delete failed ❌",{
        id:toastID
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete ShareDetail</AlertDialogTitle>
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
