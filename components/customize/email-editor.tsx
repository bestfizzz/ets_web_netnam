'use client'
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { EmailTemplateJsonConfig, TemplateDetail } from "@/lib/types/types"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "../ui/label"
import { Switch } from "@/components/ui/switch" // ✅ make sure Switch is imported

interface EmailEditorProps {
  pageData?: TemplateDetail
  templateOptions?: { id: string; label: string }[]
  selectedDesign: string
  onDesignChange: (design: string) => void
}

export const EmailEditor = forwardRef<any, EmailEditorProps>(
  ({ pageData, templateOptions = [], selectedDesign, onDesignChange }, ref) => {
    const editorRef = useRef<HTMLTextAreaElement | null>(null)
    const ckInstanceRef = useRef<any>(null)
    const pendingHtmlRef = useRef<string | null>(null)

    const { control, handleSubmit, getValues, setValue, reset } = useForm({
      defaultValues: {
        isActive: false,
        name: "",
        source_name: "",
        subject: "",
        html_content: "",
      },
    })

    // Initialize CKEditor
    const initEditor = () => {
      const CK = (window as any).CKEDITOR
      if (!CK || !editorRef.current) return

      try {
        CK.instances?.[editorRef.current.id]?.destroy(true)
      } catch { }

      const inst = CK.replace(editorRef.current, {
        height: 400,
        width: "100%",
        removePlugins: "uploadimage,uploadfile,pastebase64,pasteUploadFile",
      })

      ckInstanceRef.current = inst

      inst.on && inst.on("instanceReady", () => {
        const html = pendingHtmlRef.current || (pageData?.jsonConfig as EmailTemplateJsonConfig)?.html_content || ""
        if (html) {
          try { inst.setData(html) } catch { }
        }
        pendingHtmlRef.current = null
      })
    }

    // Load CKEditor script once
    useEffect(() => {
      if (editorRef.current && !editorRef.current.id) {
        editorRef.current.id = `ckeditor-${Math.random().toString(36).slice(2, 9)}`
      }

      const CK = (window as any).CKEDITOR
      if (CK) {
        initEditor()
        return
      }

      if (!document.getElementById("ck-script")) {
        const script = document.createElement("script")
        script.id = "ck-script"
        script.src = "/ckeditor/ckeditor.js"
        script.async = true
        script.onload = () => initEditor()
        document.body.appendChild(script)
      } else {
        const check = setInterval(() => {
          if ((window as any).CKEDITOR) {
            clearInterval(check)
            initEditor()
          }
        }, 100)
        return () => clearInterval(check)
      }

      return () => {
        const CK = (window as any).CKEDITOR
        if (CK && editorRef.current?.id) {
          const inst = CK.instances[editorRef.current.id]
          if (inst) inst.destroy(true)
        }
      }
    }, [])

    // Update editor and form when pageData changes
    useEffect(() => {
      if (!pageData) return
      const jsonConfig = (pageData.jsonConfig as EmailTemplateJsonConfig) || {}
      const html = jsonConfig.html_content || ""

      reset({
        isActive: pageData.isActive || false,
        name: pageData.name || "",
        source_name: jsonConfig.source_name || "",
        subject: jsonConfig.subject || "",
        html_content: html,
      })

      const inst = ckInstanceRef.current
      if (inst?.setData) {
        try { inst.setData(html) } catch { pendingHtmlRef.current = html }
      } else {
        pendingHtmlRef.current = html
      }
    }, [pageData, reset])

    // Expose imperative API
    useImperativeHandle(ref, () => ({
      getFormData: () => {
        const inst = ckInstanceRef.current
        if (inst?.getData) setValue("html_content", inst.getData() || "")
        return getValues()
      },
      handleSubmit: (cb: any) => async () => {
        const inst = ckInstanceRef.current
        if (inst?.getData) setValue("html_content", inst.getData() || "")
        return handleSubmit(cb)()
      },
    }), [getValues, handleSubmit, setValue])

    return (
      <div className="flex flex-col gap-4">
        {/* Active Switch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium">Active</Label>
                <Switch name={field.name} checked={!!field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </div>

        {/* Name + Template Option */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 flex flex-col w-full">
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Template name is required",
                minLength: { value: 3, message: "At least 3 characters" },
                maxLength: { value: 50, message: "Max 50 characters" },
              }}
              render={({ field, fieldState }) => (
                <>
                  <Label className="text-sm font-medium mb-1">Template Name</Label>
                  <Input {...field} placeholder="Template name" className={fieldState.error ? "border-red-500" : ""} />
                  {fieldState.error && <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>

          {templateOptions.length > 0 && (
            <div className="flex flex-col mt-2 md:mt-0">
              <Label className="text-sm font-medium mb-1">Template Option</Label>
              <Select value={selectedDesign} onValueChange={onDesignChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templateOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Source Name + Subject */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col">
            <Controller
              name="source_name"
              control={control}
              render={({ field }) => (
                <>
                  <Label className="text-sm font-medium mb-1">Source Name</Label>
                  <Input {...field} placeholder="Source name (e.g. Digipost)" />
                </>
              )}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <>
                  <Label className="text-sm font-medium mb-1">Email Subject</Label>
                  <Input {...field} placeholder="Email subject" />
                </>
              )}
            />
          </div>
        </div>

        {/* CKEditor */}
        <Controller
          name="html_content"
          control={control}
          render={() => (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-3">
              <textarea ref={editorRef} className="w-full" />
            </div>
          )}
        />
      </div>
    )
  }
)

export default EmailEditor
