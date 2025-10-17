"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { URL } from "@/components/url/url-table"
import { Profile } from "@/components/share/share-profile-table"

export const urlFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  searchTemplate: z.string().optional(),
  shareTemplate: z.string().optional(),
})

export type UrlFormData = z.infer<typeof urlFormSchema>

type UrlFormProps = {
  url?: URL
  onSubmit: (data: UrlFormData) => void
  facebookAccounts: Profile[]
  twitterAccounts: Profile[]
  linkedinAccounts: Profile[]
  designs: { pageType: string; id: string; name: string }[]
  formId: string
}

export function UrlForm({
  url,
  onSubmit,
  facebookAccounts,
  twitterAccounts,
  linkedinAccounts,
  designs,
  formId
}: UrlFormProps) {
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      name: url?.name ?? "",
      facebook: url?.facebook ?? "none",
      twitter: url?.twitter ?? "none",
      linkedin: url?.linkedin ?? "none",
      searchTemplate: url?.searchTemplate ?? "none",
      shareTemplate: url?.shareTemplate ?? "none",
    },
  })

  // Reset form whenever url changes
  useEffect(() => {
    form.reset({
      name: url?.name ?? "",
      facebook: url?.facebook ?? "none",
      twitter: url?.twitter ?? "none",
      linkedin: url?.linkedin ?? "none",
      searchTemplate: url?.searchTemplate ?? "none",
      shareTemplate: url?.shareTemplate ?? "none",
    })
  }, [url]) // ✅ no need to include form

  const selected = form.watch()

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Socials */}
        <div className="pt-4 border-t grid gap-4">
          <FormLabel>Social Credentials</FormLabel>
          <Tabs defaultValue="facebook" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {["facebook", "twitter", "linkedin"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex items-center gap-2"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <CheckCircle
                    className={`w-5 h-5 ${
                      selected[tab] && selected[tab] !== "none"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Facebook */}
            <TabsContent value="facebook">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Account</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credential" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {facebookAccounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.contact}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Twitter */}
            <TabsContent value="twitter">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Account</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credential" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {twitterAccounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.contact}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* LinkedIn */}
            <TabsContent value="linkedin">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Account</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credential" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {linkedinAccounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.contact}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Templates */}
        <div className="pt-4 border-t grid gap-4">
          <FormLabel>Templates</FormLabel>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {["search", "share"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex items-center gap-2"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <CheckCircle
                    className={`w-5 h-5 ${
                      selected[`${tab}Template`] &&
                      selected[`${tab}Template`] !== "none"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Search Templates */}
            <TabsContent value="search">
              <FormField
                control={form.control}
                name="searchTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Templates</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {designs
                            .filter((d) => d.pageType === "search")
                            .map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Share Templates */}
            <TabsContent value="share">
              <FormField
                control={form.control}
                name="shareTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share Templates</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {designs
                            .filter((d) => d.pageType === "share")
                            .map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  )
}
