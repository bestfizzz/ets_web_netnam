import { Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import CodeMirror from "@uiw/react-codemirror"
import { css } from "@codemirror/lang-css"
import { ChevronRight } from "lucide-react"
import { nSpaceTrimmer } from "@/lib/utils"


export default function SettingsPanel({ pageName, control, errors, layoutMap }: any) {
  return (
    <div className="p-3 pt-0 border-b border-gray-200 flex flex-col gap-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="group flex justify-between w-full items-center text-md font-medium text-gray-700 hover:text-gray-900">
          <span>Settings</span>
          <ChevronRight className="w-4 h-4 group-data-[state=open]:rotate-90" strokeWidth={3} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 pt-2 flex flex-col gap-3 border-t-1">

          <Controller name="isActive" control={control} render={({ field }) => (
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Active</Label>
              <Switch name={field.name} checked={!!field.value} onCheckedChange={field.onChange} />
            </div>
          )} />
          
          {/* Layout select */}
          <Controller
            name="settings.layout"
            control={control}
            defaultValue="default"
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Layout</Label>
                <Select value={field.value || "default"} onValueChange={(val) => field.onChange(val)}>
                  <SelectTrigger className="w-full h-10 text-sm">
                    <SelectValue placeholder="Choose header layout" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(layoutMap).map((layout: any) => (
                      <SelectItem key={layout.id} value={layout.id}>{layout.label}</SelectItem>
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
            rules={{ required: "Theme color is required", pattern: { value: /^#([0-9A-Fa-f]{6})$/, message: "Enter valid hex (#RRGGBB)" } }}
            render={({ field }) => (
              <>
                <Label className="text-sm w-28">Theme Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={field.value || "#000000"} onChange={(e) => field.onChange(e.target.value)} className={`w-12 h-10 cursor-pointer border rounded-md`} />
                  <input type="text" value={field.value || "#000000"} onChange={(e) => field.onChange(e.target.value)} placeholder="#RRGGBB" className={`flex-1 h-10 border rounded-md px-2 text-sm `} maxLength={7} />
                </div>
                {(errors as any).settings?.themeColor && <p className="text-xs text-red-500 mt-1">{(errors as any).settings.themeColor.message?.toString()}</p>}
              </>
            )}
          />

          {/* Page Title + Logo */}
          <Controller name="settings.pageTitle" control={control} defaultValue="" render={({ field }) => (
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Page Title</Label>
              <Input {...field} placeholder="Enter page title" />
            </div>
          )} />

          <Controller name="settings.pageLogo" control={control} defaultValue="" render={({ field }) => (
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Page Logo URL</Label>
              <Input {...field} placeholder="https://example.com/logo.png" />
            </div>
          )} />

          <Controller name="settings.privateGallery" control={control} render={({ field }) => (
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Private Gallery</Label>
              <Switch name={field.name} checked={!!field.value} onCheckedChange={field.onChange} />
            </div>
          )} />

          <Controller name="settings.pageSize" control={control} defaultValue={10} rules={{ required: "Page size is required", min: { value: 1, message: "Minimum is 1" }, max: { value: 60, message: "Maximum is 60" } }} render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1">
              <Label className="text-sm">Images per page</Label>
              <Input type="number" min={1} max={60} value={field.value ?? 10} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="Enter number of images per page" />
              {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
            </div>
          )} />

          {/* Metadata setting */}
          <Collapsible defaultOpen={false} className="border-b border-gray-200 pb-1">
            <CollapsibleTrigger className="group flex justify-between w-full items-center text-md font-medium text-gray-700 hover:text-gray-900 py-2">
              <span>Metadata (SEO)</span>
              <ChevronRight className="w-4 h-4 group-data-[state=open]:rotate-90 transition-transform" strokeWidth={3} />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-3 mt-1 p-2 border-t border-gray-200">
              <Controller name="settings.metaTitle" control={control} defaultValue="" render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">Page Title</Label>
                  <Input {...field} placeholder="NetNam AI Search" />
                </div>
              )} />

              <Controller name="settings.metaDescription" control={control} defaultValue="" render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">Page Description</Label>
                  <Input {...field} placeholder="NETNAM CORPORATION - Your Net, We Care!" />
                </div>
              )} />
            </CollapsibleContent>
          </Collapsible>

          {/* Advertisement setting */}
          <Collapsible defaultOpen={false} className="border-b border-gray-200 pb-1">
            <CollapsibleTrigger className="group flex justify-between w-full items-center text-md font-medium text-gray-700 hover:text-gray-900 py-2">
              <span>Advertisement</span>
              <ChevronRight className="w-4 h-4 group-data-[state=open]:rotate-90 transition-transform" strokeWidth={3} />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-3 mt-1 p-2 border-t border-gray-200">
              <Controller name="settings.hasAds" control={control} render={({ field }) => (
                <div className="flex items-center justify-between py-1">
                  <Label className="text-sm">Advertise Side Banners</Label>
                  <Switch name={field.name} checked={!!field.value} onCheckedChange={field.onChange} />
                </div>
              )} />

              <Controller name="settings.adbannerLeft" control={control} defaultValue="" render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">Left Ad banner</Label>
                  <Input {...field} placeholder="https://placehold.co/160x900" />
                </div>
              )} />

              <Controller name="settings.adbannerRight" control={control} defaultValue="" render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">Right Ad banner</Label>
                  <Input {...field} placeholder="https://placehold.co/160x900" />
                </div>
              )} />
            </CollapsibleContent>
          </Collapsible>

          {/* search custom */}
          {pageName === "search" && (
            <Collapsible defaultOpen={false} className="border-b border-gray-200 pb-1 mb-1">
              <CollapsibleTrigger className="group flex justify-between w-full items-center text-md font-medium text-gray-700 hover:text-gray-900 py-2">
                <span>Share Fields</span>
                <ChevronRight className="w-4 h-4 group-data-[state=open]:rotate-90 transition-transform" strokeWidth={3} />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-2 mt-1 p-2 border-t border-gray-200">
                {["phone", "email", "telegramId"].map((fieldName) => (
                  <Controller
                    key={fieldName}
                    name={`settings.shareFields.${fieldName}`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <div className="flex items-center justify-between py-1">
                        <Label className="text-sm capitalize font-medium">{fieldName.replace(/([A-Z])/g, ' $1')}</Label>
                        <Switch name={field.name} checked={!!field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Custom CSS editor */}
          <Controller name="settings.customCSS" control={control} defaultValue="" render={({ field }) => {
            const handleChange = (value: string) => {
              const trimmed = nSpaceTrimmer(value)
              if (trimmed !== nSpaceTrimmer(field.value)) field.onChange(trimmed)
            }
            return (
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Custom CSS</Label>
                <CodeMirror value={nSpaceTrimmer(field.value)} height="200px" extensions={[css()]} onChange={handleChange} className="rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden" />
              </div>
            )
          }} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}