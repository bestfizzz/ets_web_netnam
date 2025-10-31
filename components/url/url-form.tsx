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
import {
  ShareDetail,
  SharePlatform,
  TemplateDetail,
  TemplateType,
  UrlManager,
} from "@/lib/types/types"
import { capitalizeFirstLetter } from "@/lib/utils"

// -----------------------------
// Schema Factory
// -----------------------------
const createUrlFormSchema = (
  platforms: { id: number; name: string }[] = [],
  templateTypes: TemplateType[] = []
) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {
    name: z.string().min(1, "Name is required"),
  }

  platforms.forEach((platform) => {
    schemaFields[`platform_${platform.id}`] = z.string().optional()
  })

  templateTypes.forEach((t) => {
    schemaFields[`template_${t.name.toLowerCase()}`] = z.string().optional()
  })

  return z.object(schemaFields)
}

type UrlFormProps = {
  url?: UrlManager
  onSubmit: (data: Record<string, any>) => void
  shareDetails?: ShareDetail[]
  platforms?: SharePlatform[]
  templateTypes?: TemplateType[]
  templateDetails?: TemplateDetail[]
  formId: string
  loading?: boolean
}

export function UrlForm({
  url,
  onSubmit,
  shareDetails = [],
  platforms = [],
  templateTypes = [],
  templateDetails = [],
  formId,
  loading = false,
}: UrlFormProps) {
  const urlFormSchema = useMemo(
    () => createUrlFormSchema(platforms, templateTypes),
    [platforms, templateTypes]
  )

  // -----------------------------
  // Group shareDetails by platform
  // -----------------------------
  const groupedDetails = useMemo(() => {
    const grouped: Record<number, ShareDetail[]> = {}
    shareDetails.forEach((detail) => {
      const platformId = detail.platform?.id
      if (platformId !== undefined) {
        if (!grouped[platformId]) grouped[platformId] = []
        grouped[platformId].push(detail)
      }
    })
    return grouped
  }, [shareDetails])

  // -----------------------------
  // Default Values
  // -----------------------------
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {
      name: url?.name ?? "",
    }

    // Platform defaults
    platforms.forEach((platform) => {
      const fieldName = `platform_${platform.id}`
      const matched = url?.shareDetails?.find(
        (d) => d.platform.id === platform.id
      )
      defaults[fieldName] = matched ? String(matched.id) : "none"
    })

    // Template defaults
    templateTypes.forEach((t) => {
      const fieldName = `template_${t.name.toLowerCase()}`
      const matched = url?.templateDetails?.find(
        (td) => String(td.templateType.id) === String(t.id)
      )
      defaults[fieldName] = matched ? String(matched.id) : "none"
    })

    return defaults
  }

  const form = useForm({
    resolver: zodResolver(urlFormSchema),
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    form.reset(getDefaultValues())
  }, [url, platforms, templateTypes])

  const selected = form.watch()

  // -----------------------------
  // Render
  // -----------------------------
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

        {/* Platforms */}
        {platforms.length > 0 && (
          <div className="pt-4 border-t grid gap-4 w-full">
            <FormLabel>Social Credentials</FormLabel>
            <Tabs defaultValue={`platform_${platforms[0]?.id}`} className="w-full">
              <ScrollArea>
                <div className="relative rounded-sm overflow-x-auto overflow-y-hidden h-13 bg-muted">
                  <TabsList className="absolute flex flex-row w-full min-w-max">
                    {platforms.map((platform) => {
                      const fieldName = `platform_${platform.id}`
                      return (
                        <TabsTrigger
                          key={platform.id}
                          value={fieldName}
                          className="flex items-center gap-2 min-w-[120px]"
                        >
                          <span className="truncate">{capitalizeFirstLetter(platform.name)}</span>
                          <CheckCircle
                            className={`w-4 h-4 ${selected[fieldName] && selected[fieldName] !== "none"
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
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
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
        {templateTypes.length > 0 && (
          <div className="pt-4 border-t grid gap-4">
            <FormLabel>Templates</FormLabel>
            <Tabs defaultValue={`template_${templateTypes[0]?.name.toLowerCase()}`}>
              <TabsList className="grid w-full grid-cols-2">
                {templateTypes.map((t) => {
                  const fieldName = `template_${t.name.toLowerCase()}`
                  return (
                    <TabsTrigger key={t.id} value={fieldName}>
                      {capitalizeFirstLetter(t.name)}
                      <CheckCircle
                        className={`w-5 h-5 ${selected[fieldName] && selected[fieldName] !== "none"
                            ? "text-green-500"
                            : "text-gray-400"
                          }`}
                      />
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {templateTypes.map((t) => {
                const fieldName = `template_${t.name.toLowerCase()}`
                const templates = templateDetails.filter(
                  (td) => td.templateType?.id === t.id
                )

                return (
                  <TabsContent key={t.id} value={fieldName}>
                    <FormField
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.name} Templates</FormLabel>
                          <FormControl>
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select template" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {templates.map((tpl) => (
                                  <SelectItem key={tpl.id} value={String(tpl.id)}>
                                    {tpl.name}
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
      </form>
    </Form>
  )
}
