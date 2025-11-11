'use client'
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { TemplateDetail, EmailTemplateJsonConfig } from "@/lib/types/types"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "../ui/label"

interface EmailEditorProps {
  pageData?: TemplateDetail
  templateOptions?: { id: string, label: string }[]
  selectedDesign: string
  onDesignChange: (design: string) => void
}

export const EmailEditor = forwardRef<any, EmailEditorProps>(
  ({ pageData, templateOptions = [], selectedDesign, onDesignChange }, ref) => {
    const editorRef = useRef<HTMLTextAreaElement | null>(null)
    const ckInstanceRef = useRef<any>(null)
    const pendingHtmlRef = useRef<string | null>(null)
    const scriptAddedRef = useRef(false)

    const { control, handleSubmit, getValues, setValue, reset } = useForm({
      defaultValues: {
        name: "",
        source_name: "",
        subject: "",
        html_content: "",
      },
    })

    // initialize or create CKEditor instance
    const initEditor = () => {
      const CK = (window as any).CKEDITOR
      if (!CK || !editorRef.current) return

      // if instance exists destroy it first (safe)
      try {
        CK.instances?.[editorRef.current.id]?.destroy(true)
      } catch (e) {
        // ignore
      }

      // create instance and save ref
      const inst = CK.replace(editorRef.current, {
        height: 400,
        width: "100%",
        removePlugins: "uploadimage,uploadfile,pastebase64,pasteUploadFile",
        pasteUploadFileApi: null,
      })

      ckInstanceRef.current = inst

      inst.on && inst.on("instanceReady", () => {
        // prefer pendingHtmlRef (set when pageData changed before editor ready)
        const pending = pendingHtmlRef.current
        const htmlFromPage = (pageData?.jsonConfig as EmailTemplateJsonConfig)?.html_content || ""
        const toSet = typeof pending === "string" && pending.length > 0 ? pending : htmlFromPage

        if (toSet) {
          try {
            inst.setData(toSet)
          } catch (e) {
            // ignore setData errors
          }
        }
        // clear pending since applied
        pendingHtmlRef.current = null
      })
    }

    // Load CKEditor script once (if not already loaded)
    useEffect(() => {
      // ensure textarea has an id for CKEditor lookup
      if (editorRef.current && !editorRef.current.id) {
        editorRef.current.id = `ckeditor-${Math.random().toString(36).slice(2, 9)}`
      }

      const existing = (window as any).CKEDITOR
      if (existing) {
        // CKEDITOR already present — just init instance
        initEditor()
        return
      }

      // add script only once
      if (!document.getElementById("ck-script")) {
        const script = document.createElement("script")
        script.id = "ck-script"
        script.src = "/ckeditor/ckeditor.js"
        script.async = true
        scriptAddedRef.current = true
        script.onload = () => {
          initEditor()
        }
        document.body.appendChild(script)
      } else {
        // script tag exists but CKEDITOR not yet defined (waiting)
        const check = setInterval(() => {
          if ((window as any).CKEDITOR) {
            clearInterval(check)
            initEditor()
          }
        }, 100)
        return () => clearInterval(check)
      }

      return () => {
        // do not forcibly remove global CKEditor script if other parts rely on it.
        // But destroy instance
        const CK = (window as any).CKEDITOR
        if (CK) {
          try {
            const inst = editorRef.current?.id && (window as any).CKEDITOR?.instances?.[editorRef.current.id]
            if (inst) inst.destroy(true)
          } catch (e) { }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // run once on mount

    // When pageData changes: reset form and either set editor data or stash it
    useEffect(() => {
      if (!pageData) return
      const jsonConfig = (pageData.jsonConfig as EmailTemplateJsonConfig) || {}
      const html = jsonConfig.html_content || ""

      // reset inputs
      reset({
        name: pageData.name || "",
        source_name: jsonConfig.source_name || "",
        subject: jsonConfig.subject || "",
        html_content: html,
      })

      // if editor instance ready -> setData, else stash it
      const inst = ckInstanceRef.current
      if (inst && typeof inst.setData === "function") {
        try {
          inst.setData(html)
        } catch (e) {
          // if setData fails for timing reasons, stash it
          pendingHtmlRef.current = html
        }
      } else {
        // editor not ready yet, store pending html
        pendingHtmlRef.current = html
      }
    }, [pageData, reset])

    // Imperative handle: sync html into form then return values / handleSubmit
    useImperativeHandle(
      ref,
      () => ({
        getFormData: () => {
          const inst = ckInstanceRef.current
          if (inst && typeof inst.getData === "function") {
            setValue("html_content", inst.getData() || "")
          }
          return getValues()
        },
        handleSubmit: (cb: any) => {
          return async () => {
            const inst = ckInstanceRef.current
            if (inst && typeof inst.getData === "function") {
              setValue("html_content", inst.getData() || "")
            }
            return handleSubmit(cb)()
          }
        },
      }),
      [getValues, handleSubmit, setValue]
    )

    return (
      <div className="flex flex-col gap-4">
        {/* Name + Template Type Row */}
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
                  {templateOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
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
