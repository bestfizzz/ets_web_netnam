"use client"

import * as React from "react"
import TemplateGenerator from "@/components/customize/template-generator"
import { createRoot, Root } from "react-dom/client"

interface InlinePreviewProps {
  formData: any
  pageName: string
  mode: "desktop" | "mobile"
}

export function InlinePreview({ formData, pageName, mode }: InlinePreviewProps) {
  const maxWidth = mode === "desktop" ? 1920 : 375
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const rootRef = React.useRef<Root | null>(null)
  const fancyboxBoundRef = React.useRef(false)

  // --- Load Fancybox script & CSS once
  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return

    // Inject Fancybox CSS once
    if (!doc.getElementById("fancybox-css")) {
      const link = doc.createElement("link")
      link.id = "fancybox-css"
      link.rel = "stylesheet"
      link.href = "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox/fancybox.css"
      doc.head.appendChild(link)
    }

    // Inject Fancybox script once
    if (!doc.getElementById("fancybox-script")) {
      const script = doc.createElement("script")
      script.id = "fancybox-script"
      script.src = "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox/fancybox.umd.js"
      script.onload = () => {
        const win = iframe.contentWindow as (Window & { Fancybox?: any })
        const Fancybox = win?.Fancybox
        if (Fancybox && !fancyboxBoundRef.current) {
          Fancybox.bind("[data-fancybox='gallery']", { groupAll: true })
          fancyboxBoundRef.current = true
        }
      }
      doc.head.appendChild(script)
    } else {
      // If script already exists, bind if not done
      const win = iframe.contentWindow as (Window & { Fancybox?: any })
      const Fancybox = win?.Fancybox
      if (Fancybox && !fancyboxBoundRef.current) {
        Fancybox.bind("[data-fancybox='gallery']", { groupAll: true })
        fancyboxBoundRef.current = true
      }
    }
  }, []) // empty dependency array → runs only once

  // --- Copy parent styles & inject custom CSS
  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return

    // Copy all parent stylesheets
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join("\n")
        const styleTag = doc.createElement("style")
        styleTag.textContent = rules
        doc.head.appendChild(styleTag)
      } catch {
        // Ignore CORS-restricted sheets
      }
    })

    // Inject page-specific custom CSS
    let customStyle = doc.getElementById("custom-css") as HTMLStyleElement | null
    if (!customStyle) {
      customStyle = doc.createElement("style")
      customStyle.id = "custom-css"
      doc.head.appendChild(customStyle)
    }
    customStyle.textContent = formData.settings.customCSS || ""
  }, [formData.settings.customCSS])

  // --- Mount or update TemplateGenerator
  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return

    let rootDiv = doc.getElementById("root")
    if (!rootDiv) {
      rootDiv = doc.createElement("div")
      rootDiv.id = "root"
      rootDiv.style.width = "100%"
      rootDiv.style.height = "100%"
      doc.body.appendChild(rootDiv)
      rootRef.current = createRoot(rootDiv)
    }
    rootRef.current?.render(
      <TemplateGenerator
        content={formData.content}
        settings={formData.settings}
        pageName={pageName}
        preview={true}
      />
    )
  }, [formData.content, JSON.stringify(formData.settings), pageName])

  // --- Rebind Fancybox after content updates
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const iframe = iframeRef.current
      const win = iframe?.contentWindow as (Window & { Fancybox?: any })
      const Fancybox = win?.Fancybox

      if (Fancybox) {
        Fancybox.unbind("[data-fancybox='gallery']")
        Fancybox.bind("[data-fancybox='gallery']", { groupAll: true })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [formData.content])

  return (
    <div
      className="bg-gray-100 rounded shadow w-full h-full flex justify-center items-start overflow-hidden"
    >
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: '400px',
          maxWidth,
          border: "none",
          borderRadius: "0.5rem",
          zoom: mode === 'desktop' ? 0.75 : 1
        }}
        title="Inline Preview"
      />
    </div>
  )
}
