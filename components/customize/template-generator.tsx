"use client"

import React, { FC } from "react"
import { PortableText} from "@portabletext/react"
import SearchPageWrapper from "@/components/pages/search/search-page-wrapper"
import SharePageWrapper from "@/components/pages/share/share-page-wrapper"
import { GalleryProvider } from "@/hooks/gallery-context"
import type { TemplateDetail, TemplateJsonConfig } from "@/lib/types/types"
import type { TypedObject } from "@portabletext/types"
import components from "@/components/customize/portable_text_block/portable-components"
// -----------------------------
// Props
// -----------------------------
interface TemplateGeneratorProps {
  content: TypedObject[] // must include _type in each block
  settings: TemplateJsonConfig["settings"]
  pageName: string
  preview?: boolean
  uuid?: string
}

// Wrapper Props
interface WrapperProps {
  uuid: string
  settings: TemplateJsonConfig["settings"]
  preview?: boolean
  children: React.ReactNode
}

// -----------------------------
// TemplateGenerator
// -----------------------------
export default function TemplateGenerator({
  content,
  pageName,
  settings,
  preview = false,
  uuid = "",
}: TemplateGeneratorProps) {

  const normalizedPageName = pageName.toLowerCase();

  // Always FC with required uuid, settings, preview
  const Wrapper: FC<WrapperProps> =
    normalizedPageName === "search"
      ? SearchPageWrapper
      : normalizedPageName === "share"
        ? SharePageWrapper
        : ({ children }) => <>{children}</>

  return (
    <GalleryProvider gallerySettings={settings}>
      <Wrapper uuid={uuid} settings={settings} preview={preview}>
        {settings.customCSS && <style dangerouslySetInnerHTML={{ __html: settings.customCSS }} />}
        <PortableText value={content} components={components} />
      </Wrapper>
    </GalleryProvider>
  )
}
