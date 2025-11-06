"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { useForm, Controller } from "react-hook-form"
import CodeMirror from "@uiw/react-codemirror"
import { css } from "@codemirror/lang-css"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PreviewPane } from "@/components/customize/preview-panel"
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent
} from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DraggableBlock } from "@/components/customize/draggable-block"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Pencil, Check, ChevronRight } from "lucide-react"
import { DynamicBlockEditor } from "@/components/customize/dynamic-block-editor"
import { nSpaceTrimmer } from "@/lib/utils"
import { SearchLayoutMap } from "@/lib/layoutMap/search-map"
import { ShareLayoutMap } from "@/lib/layoutMap/share-map"

const defaultBlocks: Record<string, any> = {
  block: { _type: "block", style: "normal", children: [{ _type: "span", text: "" }], markDefs: [] },
  feature: { _type: "feature", title: "", description: "" },
  footer: { _type: "footer", text: "" },
  searchBar: { _type: "searchBar", placeholder: "Search..." },
  logoBlock: { _type: "logoBlock", leftLogo: "", rightLogo: "" }
}

interface PageCustomizeProps {
  pageName: string
  pageData: any
  selectedDesign: string
  onDesignChange: (design: string) => void
  templateOptions: { id: string; label: string }[]
}

export const PageCustomize = forwardRef(({
  pageName,
  pageData,
  selectedDesign,
  onDesignChange,
  templateOptions
}: PageCustomizeProps, ref) => {
  // ✅ Stable empty defaults to prevent uncontrolled fields
  const defaultValues = {
    name: "",
    content: [],
    settings: {
      themeColor: "#000000",
      pageTitle: "",
      pageLogo: "",
      pageSize: 10,
      customCSS: "",
      layout: "default",
      privateGallery: false,
      hasAds: false
    },
  };
  const layoutMap = pageName === 'search' ? SearchLayoutMap : ShareLayoutMap;
  const { control, watch, setValue, reset, getValues, formState: { errors }, handleSubmit } =
    useForm<any>({ defaultValues });

  const [formData, setFormData] = useState(defaultValues);
  const content = watch("content");
  const [editingName, setEditingName] = useState(!pageData?.name);
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // ✅ Sync name when pageData updates
  useEffect(() => {
    if (pageData?.name && !editingName) {
      setValue("name", pageData.name);
    }
  }, [pageData, setValue, editingName]);

  useImperativeHandle(ref, () => ({
    getFormData: () => getValues(),
    handleSubmit: (cb: any) => handleSubmit(cb),
  }));

  // ✅ Keep formData in sync with watched values
  useEffect(() => {
    const subscription = watch((values) => {
      // merge partial updates returned by watch into the previous full state
      setFormData((prev) => ({ ...prev, ...(values as any) }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // ✅ Reset form when new data arrives also generate inital data if available
  useEffect(() => {
    if (!pageData) return;

    const resetData = {
      ...(pageData.jsonConfig ?? {}),
      name: pageData.name ?? "",
      settings: {
        themeColor: pageData.jsonConfig?.settings?.themeColor ?? "#000000",
        pageTitle: pageData.jsonConfig?.settings?.pageTitle ?? "",
        pageLogo: pageData.jsonConfig?.settings?.pageLogo ?? "",
        pageSize: pageData.jsonConfig?.settings?.pageSize ?? 10,
        customCSS: pageData.jsonConfig?.settings?.customCSS ?? "",
        privateGallery: pageData.jsonConfig?.settings?.privateGallery ?? false,
        layout: pageData.jsonConfig?.settings?.layout ?? "default",
        hasAds: pageData.jsonConfig?.settings?.hasAds ?? false,
      },
      content: pageData.jsonConfig?.content ?? [],
    };

    reset(resetData);
    setFormData(resetData);
    setCollapsed(
      resetData.content
        ? resetData.content.map((_: any, i: number) => i !== 0)
        : []
    );
    setMounted(true);
  }, [pageData, reset]);

  const toggleCollapse = (idx: number) => {
    setCollapsed(prev => {
      const copy = [...prev]
      copy[idx] = !copy[idx]
      return copy
    })
  }

  const addBlock = (type: string) => {
    // Prevent multiple GallerySections
    if (type === "GallerySection" || type === "GalleryContentSection") {
      const alreadyExists = content.some(
        (b: any) => b._type === type
      )
      if (alreadyExists) {
        alert(`You can only have one ${type}.`)
        return
      }
    }

    setValue("content", [defaultBlocks[type], ...content])
    setCollapsed(prev => [false, ...prev])
    setOpen(false)
  }

  const removeBlock = (idx: number) => {
    const block = content[idx]
    if (block?._type === "GallerySection" || block?._type === "GalleryContentSection") {
      alert("You cannot delete the Gallery Section.")
      return
    }
    setValue("content", content.filter((_: any, i: number) => i !== idx))
    setCollapsed(prev => prev.filter((_, i) => i !== idx))
  }

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const from = Number(String(active.id).split("-")[1])
      const to = Number(String(over.id).split("-")[1])
      setValue("content", arrayMove(content, from, to))
      setCollapsed(arrayMove(collapsed, from, to))
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Preview */}
      <div className="flex md:w-7/10 shadow-lg overflow-hidden">
        <PreviewPane
          formData={formData}
          pageName={pageName}
          selectedDesign={selectedDesign}
          onDesignChange={onDesignChange}
          templateOptions={templateOptions}
        />
      </div>

      {/* Editor */}
      <div className="flex md:w-3/10 flex-col">
        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 pb-3">
            {/* Name Field */}
            {editingName ? (
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Template name is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                  maxLength: { value: 50, message: "Max 50 characters" }
                }}
                render={({ field }) => (
                  <div className="relative w-[60%]">
                    <Input
                      {...field}
                      ref={(el) => {
                        field.ref(el)
                        nameInputRef.current = el
                      }}
                      placeholder="Enter template name..."
                      className={`text-xl font-bold pr-10 ${errors.name ? "border-red-500" : ""}`}
                      value={field.value || ""}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        if (!errors.name) setEditingName(false)
                      }}
                    >
                      <Check size={16} />
                    </button>
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name.message?.toString()}</p>
                    )}
                  </div>
                )}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{getValues("name")}</span>
                <button
                  type="button"
                  onClick={() => setEditingName(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}

            {/* Add Block Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" type="button" size="sm">Add Block</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Block Type</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 p-2">
                  {Object.keys(defaultBlocks).map(type => (
                    <Button key={type} type="button" className="w-full" onClick={() => addBlock(type)}>
                      {type}
                    </Button>
                  ))}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Settings */}
          <div className="p-3 pt-0 border-b border-gray-200 flex flex-col gap-3">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="group flex justify-between w-full items-center text-md font-medium text-gray-700 hover:text-gray-900">
                <span>Settings</span>
                <ChevronRight className="w-4 h-4 group-data-[state=open]:rotate-90" strokeWidth={3} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pt-2 flex flex-col gap-3 border-t-1">
                {/* Header Layout */}
                <Controller
                  name="settings.layout"
                  control={control}
                  defaultValue="default"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm font-medium">Layout</Label>
                      <Select
                        value={field.value || "default"}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <SelectTrigger className="w-full h-10 text-sm">
                          <SelectValue placeholder="Choose header layout" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(layoutMap).map((layout) => (
                            <SelectItem key={layout.id} value={layout.id}>
                              {layout.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />


                {/* Theme Color */}
                <Controller
                  name="settings.themeColor"
                  control={control}
                  defaultValue="#ffffff"
                  rules={{
                    required: "Theme color is required",
                    pattern: { value: /^#([0-9A-Fa-f]{6})$/, message: "Enter valid hex (#RRGGBB)" },
                  }}
                  render={({ field }) => (
                    <>
                      <Label className="text-sm w-28">Theme Color</Label>
                      <div className="flex items-center gap-2">

                        <input
                          type="color"
                          value={field.value || "#000000"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={`w-12 h-10 cursor-pointer border rounded-md`}
                        />
                        <input
                          type="text"
                          value={field.value || "#000000"}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="#RRGGBB"
                          className={`flex-1 h-10 border rounded-md px-2 text-sm `}
                          maxLength={7}
                        />
                      </div>
                      {(errors as any).settings?.themeColor && (
                        <p className="text-xs text-red-500 mt-1">{(errors as any).settings.themeColor.message?.toString()}</p>
                      )}
                    </>
                  )}
                />

                {/* Page Title */}
                <Controller
                  name="settings.pageTitle"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm">Page Title</Label>
                      <Input
                        {...field}
                        placeholder="Enter page title"
                      />
                    </div>
                  )}
                />

                {/* Page Logo */}
                <Controller
                  name="settings.pageLogo"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm">Page Logo URL</Label>
                      <Input
                        {...field}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  )}
                />

                {/* Private Gallery Toggle */}
                <Controller
                  name="settings.privateGallery"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between py-2">
                      <Label className="text-sm">
                        Private Gallery
                      </Label>
                      <Switch
                        name={field.name}
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                {/* Ads Banner Toggle */}
                <Controller
                  name="settings.hasAds"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between py-2">
                      <Label className="text-sm">
                        Advertise Side Banners
                      </Label>
                      <Switch
                        name={field.name}
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                {/* Page Size */}
                <Controller
                  name="settings.pageSize"
                  control={control}
                  defaultValue={10} // optional if already defined in useForm
                  rules={{
                    required: "Page size is required",
                    min: { value: 1, message: "Minimum is 1" },
                    max: { value: 60, message: "Maximum is 60" }
                  }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm">Images per page</Label>
                      <Input
                        type="number"
                        min={1}
                        max={60}
                        value={field.value ?? 10}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="Enter number of images per page"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />

                {/* Custom CSS */}
                <Controller
                  name="settings.customCSS"
                  control={control}
                  defaultValue=""
                  render={({ field }) => {

                    const handleChange = (value: string) => {
                      const trimmed = nSpaceTrimmer(value)
                      if (trimmed !== nSpaceTrimmer(field.value)) {
                        field.onChange(trimmed)
                      }
                    }

                    return (
                      <div className="flex flex-col gap-1">
                        <Label className="text-sm font-medium">Custom CSS</Label>
                        <CodeMirror
                          value={nSpaceTrimmer(field.value)}
                          height="200px"
                          extensions={[css()]}
                          onChange={handleChange}
                          className="rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                        />
                      </div>
                    )
                  }}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Content Blocks */}
          <div>
            <Label className="px-3 py-1 text-sm">Content Blocks</Label>
            <div
              ref={scrollContainerRef}
              className="flex-1 max-h-[400px] overflow-y-auto px-2 py-2 space-y-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100"
            >
              {mounted && content && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={content.map((_: any, i: any) => `block-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          {field.value?.map((block: any, idx: number) => (
                            <DraggableBlock
                              key={idx}
                              id={`block-${idx}`}
                              block={block}
                              idx={idx}
                              collapsed={collapsed[idx]}
                              toggleCollapse={toggleCollapse}
                              removeBlock={removeBlock}
                            >
                              <DynamicBlockEditor
                                block={block}
                                idx={idx}
                                setValue={setValue}
                                fieldValue={field.value}
                              />
                            </DraggableBlock>
                          ))}
                        </div>
                      )}
                    />
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
})
