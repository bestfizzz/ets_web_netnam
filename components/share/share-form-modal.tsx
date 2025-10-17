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
import { Profile } from "@/components/share/share-profile-table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

const profileFormSchema = z.object({
  contact: z.string().min(1, "Contact is required"),
  accessCode: z.string().min(1, "Access code is required"),
  socialPlatform: z.enum(["facebook", "twitter", "linkedin"], {
    required_error: "Select a platform",
  }),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

export function AddShareProfileModal() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      contact: "",
      accessCode: "",
      socialPlatform: "facebook",
    },
  })

  const handleSubmit = async (data: ProfileFormData) => {
    const res = await fetch("/api/share-platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      toast.error("Failed to add profile")
      return
    }

    toast.success(`New ${data.socialPlatform} profile added.`)
    form.reset()
    setOpen(false)

    router.refresh() // 🔄 re-fetches server component data without full reload
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="profile-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter access code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialPlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="profile-form">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ProfileEditModalProps {
  profile: Profile | null
  socialPlatform: "facebook" | "twitter" | "linkedin"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditShareProfileModal({ profile, socialPlatform, open, onOpenChange }: ProfileEditModalProps) {
  const router = useRouter()
  if (!profile || !socialPlatform) return null
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      contact: profile?.contact ?? "",
      accessCode: profile?.accessCode ?? "",
      socialPlatform: socialPlatform,
    },
  })

  React.useEffect(() => {
    if (profile && socialPlatform) {
      form.reset({
        contact: profile.contact,
        accessCode: profile.accessCode,
        socialPlatform,
      })
    }
  }, [profile, socialPlatform, form])

  const handleSubmit = async (data: ProfileFormData) => {
    if (!profile) return

    const res = await fetch('/api/share-platform', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      console.error("Failed to update profile:", await res.text())
      toast.error("Failed to update profile")
      return
    }

    toast.success(`${data.socialPlatform} profile updated.`)
    onOpenChange(false)
    router.refresh()
  }

  if (!profile) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="edit-profile-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter access code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialPlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Select value={field.value} disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


interface ProfileDeleteModalProps {
  profile: Profile | null
  socialPlatform: "facebook" | "twitter" | "linkedin"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteShareProfileModal({
  profile,
  socialPlatform,
  open,
  onOpenChange,
}: ProfileDeleteModalProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    if (!profile) return
    setLoading(true)
    try {
      const res = await fetch("/api/share-platform", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profile.id, socialPlatform }),
      })

      if (!res.ok) {
        toast.error("Error deleting profile")
        return
      }

      toast.success(`Profile "${profile.contact}" deleted`)
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error("Error deleting profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {profile ? `Delete ${profile.contact}?` : "Delete profile?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white"
            onClick={handleDelete}
            disabled={loading || !profile}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

