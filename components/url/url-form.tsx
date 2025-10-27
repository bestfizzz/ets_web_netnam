"use client"

import { useEffect, useMemo } from "react"
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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
import { ShareDetail,SharePlatform } from "@/lib/types/types"

// Create dynamic schema based on available platforms
const createUrlFormSchema = (platforms: { id: number; name: string }[] = []) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {
    name: z.string().min(1, "Name is required"),
    searchTemplate: z.string().optional(),
    shareTemplate: z.string().optional(),
  }

  // Add platform fields dynamically
  platforms.forEach((platform) => {
    schemaFields[`platform_${platform.id}`] = z.string().optional()
  })

  return z.object(schemaFields)
}

type UrlFormProps = {
  url?: URL
  onSubmit: (data: Record<string, any>) => void
  shareDetails?: ShareDetail[]
  platforms?: SharePlatform[]
  designs?: { pageType: string; id: string; name: string }[]
  formId: string
}

export function UrlForm({
  url,
  onSubmit,
  shareDetails = [],
  platforms = [],
  designs = [],
  formId
}: UrlFormProps) {
  const urlFormSchema = useMemo(() => createUrlFormSchema(platforms), [platforms])
  // Group share details by platform
  const groupedDetails = useMemo(() => {
    const grouped: Record<number, ShareDetail[]> = {}
    shareDetails.forEach((detail) => {
      const platformId = detail.platform?.id
      if (platformId !== undefined) {
        if (!grouped[platformId]) {
          grouped[platformId] = []
        }
        grouped[platformId].push(detail)
      }
    })
    return grouped
  }, [shareDetails])

  // Create default values
  // Create default values
  const getDefaultValues = () => {
    
    const defaults: Record<string, any> = {
      name: url?.name ?? "",
      searchTemplate: url?.searchTemplate ?? "none",
      shareTemplate: url?.shareTemplate ?? "none",
    }

    // Loop through each available platform
    platforms.forEach((platform) => {
      const fieldName = `platform_${platform.id}`
      let matchedId = "none"

      if (url?.shareDetails?.length) {
        
        // Get the IDs from url.shareDetails
        const urlDetailIds = url.shareDetails.map((d: any) => Number(d.id))
        
        // Find a detail that matches one of the URL's detail IDs AND belongs to this platform
        const matched = shareDetails.find((detail: ShareDetail) => {
          const idMatch = urlDetailIds.includes(Number(detail.id))
          const platformMatch = detail.platform.id === platform.id

          return idMatch && platformMatch
        })
        
        if (matched) {
          matchedId = String(matched.id)
        } 
      }

      defaults[fieldName] = matchedId
    })
    
    return defaults
  }

  const form = useForm({
    resolver: zodResolver(urlFormSchema),
    defaultValues: getDefaultValues(),
  })

  // Reset form whenever url changes
  useEffect(() => {
    form.reset(getDefaultValues())
  }, [url, platforms])

  const selected = form.watch()

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 w-full"
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

        {/* Social Credentials - Dynamic */}
        {platforms.length > 0 && (
          <div className="pt-4 border-t grid gap-4 w-full">
            <FormLabel>Social Credentials</FormLabel>
            <Tabs defaultValue={`platform_${platforms[0]?.id}`} className="w-full">
              <ScrollArea >
                <div className="relative rounded-sm overflow-x-auto overflow-y-hidden h-13 bg-muted">
                  <TabsList className="absolute flex flex-row w-full min-w-max ">
                    {platforms.map((platform) => {
                      const fieldName = `platform_${platform.id}`
                      return (
                        <TabsTrigger
                          key={platform.id}
                          value={fieldName}
                          className="flex items-center gap-2 min-w-[120px]"
                        >
                          <span className="truncate">{platform.name}</span>
                          <CheckCircle
                            className={`w-4 h-4 flex-shrink-0 ${selected[fieldName] && selected[fieldName] !== "none"
                              ? "text-green-500"
                              : "text-gray-400"
                              }`}
                          />
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>


              {platforms.map((platform) => {
                const fieldName = `platform_${platform.id}`
                const accounts = groupedDetails[platform.id] || []

                return (
                  <TabsContent key={platform.id} value={fieldName}>
                    <FormField
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{platform.name} Account</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select credential" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {accounts.map((acc) => (
                                  <SelectItem key={acc.id} value={String(acc.id)}>
                                    {acc.name}
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
                )
              })}
            </Tabs>
          </div>
        )}

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
                    className={`w-5 h-5 ${selected[`${tab}Template`] &&
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
