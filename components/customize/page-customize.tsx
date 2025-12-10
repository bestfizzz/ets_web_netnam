"use client"

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"

import { Card } from "@/components/ui/card"
import { PreviewPane } from "@/components/customize/preview-panel"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SearchLayoutMap } from "@/lib/layoutMap/search-map"
import { ShareLayoutMap } from "@/lib/layoutMap/share-map"
import NameAndAdd from "@/components/customize/setting_blocks/name-and-add"
import SettingsPanel from "@/components/customize/setting_blocks/settings-panel"
import BlocksPanel from "@/components/customize/setting_blocks/blocks-panel"
import defaultBlocks from "@/components/customize/portable_text_block/default-blocks"
// ----- Main component (refactored) -----
export const PageCustomize = forwardRef(({
  pageName,
  pageData,
  selectedDesign,
  onDesignChange,
  templateOptions,
}: any, ref: any) => {
  const defaultValues = {
    name: "",
    isActive:true,
    content: [],
    settings: {
      themeColor: "#000000",
      pageTitle: "",
      pageLogo: "",
      pageSize: 10,
      customCSS: "",
      layout: "default",
      privateGallery: false,
      hasAds: false,
      adbannerLeft: "",
      adbannerRight: "",
    },
  }

  const normalizedPageName = pageName.toLowerCase();
  const layoutMap = normalizedPageName === 'search' ? SearchLayoutMap : ShareLayoutMap
  const { control, watch, setValue, reset, getValues, formState: { errors }, handleSubmit } = useForm<any>({ defaultValues })

  const [formData, setFormData] = useState(defaultValues)
  const content = watch("content")
  const [editingName, setEditingName] = useState(!pageData?.name)
  const [collapsed, setCollapsed] = useState<boolean[]>([])
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({ getFormData: () => getValues(), handleSubmit: (cb: any) => handleSubmit(cb) }))

  useEffect(() => { const subscription = watch((values) => setFormData(prev => ({ ...prev, ...(values as any) }))); return () => subscription.unsubscribe() }, [watch])

  useEffect(() => {
    if (!pageData) return
    const resetData = {
      ...(pageData.jsonConfig ?? {}),
      name: pageData.name ?? "",
      isActive : pageData.isActive ?? true,
      settings: {
        themeColor: pageData.jsonConfig?.settings?.themeColor ?? "#000000",
        pageTitle: pageData.jsonConfig?.settings?.pageTitle ?? "",
        pageLogo: pageData.jsonConfig?.settings?.pageLogo ?? "",
        pageSize: pageData.jsonConfig?.settings?.pageSize ?? 10,
        customCSS: pageData.jsonConfig?.settings?.customCSS ?? "",
        privateGallery: pageData.jsonConfig?.settings?.privateGallery ?? false,
        layout: pageData.jsonConfig?.settings?.layout ?? "default",
        hasAds: pageData.jsonConfig?.settings?.hasAds ?? false,
        adbannerLeft: pageData.jsonConfig?.settings?.adbannerLeft ?? "",
        adbannerRight: pageData.jsonConfig?.settings?.adbannerRight ?? "",

        ...(normalizedPageName === "search" && {
          shareFields: pageData.jsonConfig?.settings?.shareFields ?? { phone: true, email: false, telegramId: false },
        }),

        ...(normalizedPageName === "share" && {
        }),
      },
      content: pageData.jsonConfig?.content ?? [],
    }

    reset(resetData)
    setFormData(resetData)
    setCollapsed(resetData.content ? resetData.content.map((_: any, i: number) => i !== 0) : [])
    setMounted(true)
  }, [pageData, reset])

  const toggleCollapse = (idx: number) => setCollapsed(prev => { const copy = [...prev]; copy[idx] = !copy[idx]; return copy })

  const addBlock = (type: string) => {
    if (type === "GallerySection" || type === "GalleryContentSection") {
      const alreadyExists = content.some((b: any) => b._type === type)
      if (alreadyExists) { alert(`You can only have one ${type}.`); return }
    }
    setValue("content", [defaultBlocks[type], ...content])
    setCollapsed(prev => [false, ...prev])
    setOpen(false)
  }

  const removeBlock = (idx: number) => {
    const block = content[idx]
    if (block?._type === "GallerySection" || block?._type === "GalleryContentSection") { alert("You cannot delete the Gallery Section."); return }
    setValue("content", content.filter((_: any, i: number) => i !== idx))
    setCollapsed(prev => prev.filter((_, i) => i !== idx))
  }

  const onAddClick = () => setOpen(true)

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex md:w-7/10 shadow-lg overflow-hidden h-screen">
        <PreviewPane formData={formData} pageName={normalizedPageName} selectedDesign={selectedDesign} onDesignChange={onDesignChange} templateOptions={templateOptions} />
      </div>

      <div className="flex md:w-3/10 flex-col h-screen overflow-y-scroll">
        <Card className="flex flex-col gap-2">
          {/* header: name + add */}
          <NameAndAdd setValue={setValue} editingName={editingName} setEditingName={setEditingName} control={control} errors={errors} nameInputRef={nameInputRef} onAddClick={onAddClick} />

          {/* settings */}
          <SettingsPanel pageName={normalizedPageName} control={control} errors={errors} layoutMap={layoutMap} />

          {/* Content blocks + add dialog + DnD */}
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Block Type</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-2 p-2">
                  {Object.keys(defaultBlocks).map(type => (
                    <Button key={type} type="button" className="w-full" onClick={() => { addBlock(type); setOpen(false) }}>{type}</Button>
                  ))}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <BlocksPanel control={control} mounted={mounted} content={content} setValue={setValue} collapsed={collapsed} toggleCollapse={toggleCollapse} removeBlock={removeBlock} scrollContainerRef={scrollContainerRef} />
          </div>
        </Card>
      </div>
    </div>
  )
})

export default PageCustomize
