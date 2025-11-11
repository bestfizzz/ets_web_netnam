"use client"
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { InlinePreview } from "./inline-preview"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PreviewPaneProps {
  formData: any
  pageName: string
  selectedDesign: string
  onDesignChange: (design: string) => void
  templateOptions: { id: string; label: string }[] // 👈 simplified
}

export function PreviewPane({
  formData,
  pageName,
  selectedDesign,
  onDesignChange,
  templateOptions
}: PreviewPaneProps) {
  const [mode, setMode] = React.useState<"desktop" | "mobile">("desktop")
  const memoizedFormData = React.useMemo(() => ({
    content: formData.content,
    settings: formData.settings
  }), [formData.content, formData.settings ])
  return (
    <Card className="shadow-lg flex-1 max-w-full h-screen">
      <CardContent className="px-3 xs:px-6 h-full">
        {/* Tabs + Select Row */}
        <div className="flex justify-between items-center mb-4">
          <Tabs
            value={mode}
            onValueChange={v => setMode(v as "desktop" | "mobile")}
            className="w-auto"
          >
            <TabsList >
              <TabsTrigger className="text-xs xs:text-sm" value="desktop">Desktop</TabsTrigger>
              <TabsTrigger className="text-xs xs:text-sm" value="mobile">Mobile</TabsTrigger>
            </TabsList>
          </Tabs>
          {templateOptions.length > 0 && (
            <Select value={selectedDesign} onValueChange={onDesignChange}>
              <SelectTrigger className="w-34 xs:w-[200px] text-xs xs:text-sm ">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templateOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Tab Content */}
        <Tabs value={mode} className="h-[95%]">
          <TabsContent value="desktop">
            <InlinePreview
              formData={memoizedFormData}
              pageName={pageName}
              mode="desktop"
            />
          </TabsContent>
          <TabsContent value="mobile">
            <InlinePreview
              formData={memoizedFormData}
              pageName={pageName}
              mode="mobile"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
