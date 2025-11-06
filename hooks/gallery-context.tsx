"use client"

import { createContext, useContext, useState, useEffect, ReactNode, use } from "react"
import { useFancybox } from "@/hooks/use-fancybox"
import { performDownload } from "@/lib/utils"
import { TemplateJsonConfig } from "@/lib/types/types"

export type AssetMeta = {
  id: string
  thumb: string
  preview: string
  download: string
  filename: string
}

type GallerySettings = TemplateJsonConfig["settings"]


type GalleryContextType = {
  valid: boolean | null
  setValid: (valid: boolean | null) => void

  // Search & Query
  query: string
  setQuery: (query: string) => void

  // Images & Loading
  images: AssetMeta[]
  setImages: (images: AssetMeta[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  showFullLoading: boolean
  setShowFullLoading: (loading: boolean) => void
  progress: number
  setProgress: (progress: number) => void
  noResults: boolean
  setNoResults: (noResults: boolean) => void
  privateGallery: boolean
  setPrivateGallery: (privateGallery: boolean) => void

  // Pagination
  page: number
  setPage: (page: number) => void
  total: number
  setTotal: (total: number) => void
  totalPages: number
  pageSize: number
  setPageSize: (pageSize: number) => void
  nextPage: string | null
  setNextPage: (nextPage: string | null) => void
  // Selection Mode
  selectMode: boolean
  setSelectMode: (mode: boolean) => void
  selectedMap: Record<string, Omit<AssetMeta, "id">>
  setSelectedMap: (map: Record<string, Omit<AssetMeta, "id">> | ((prev: Record<string, Omit<AssetMeta, "id">>) => Record<string, Omit<AssetMeta, "id">>)) => void
  selectedCount: number
  previewThumbnails: string[]

  // Mode (all/person)
  mode: "all" | "person" | "keyword"
  setMode: (mode: "all" | "person" | "keyword") => void
  personId: string | null
  setPersonId: (id: string | null) => void

  // Fancybox ref
  fancyRef: React.RefObject<HTMLElement | null>

  // Template Settings
  // Template Settings
  settings: GallerySettings
  setSettings: (settings: GallerySettings) => void
}

// Create the context with a default value of undefined
const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

export function useGalleryContext() {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error("useGalleryContext must be used within GalleryProvider")
  }
  return context
}

export function GalleryProvider({ children, gallerySettings }: { children: ReactNode, gallerySettings?: GallerySettings }) {
  const [valid, setValid] = useState<boolean | null>(null)
  const [query, setQuery] = useState("")
  const [images, setImages] = useState<AssetMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [showFullLoading, setShowFullLoading] = useState(gallerySettings?.privateGallery !== true)
  const [progress, setProgress] = useState(0)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedMap, setSelectedMap] = useState<Record<string, Omit<AssetMeta, "id">>>({})
  const [noResults, setNoResults] = useState(false)
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(60)
  const [mode, setMode] = useState<"all" | "person" | "keyword">("all")
  const [personId, setPersonId] = useState<string | null>(null)
  const [privateGallery, setPrivateGallery] = useState(!!gallerySettings?.privateGallery)
  const [settings, setSettings] = useState<GallerySettings>({
    themeColor: "#ffffff",
    pageTitle: "Gallery",
    pageSize: 36,
    privateGallery: false,
    pageLogo: "",
    customCSS: "",
    layout: "default",
    hasAds: false,
  })

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const fancyRef = useFancybox(images, performDownload, selectMode)

  const selectedCount = Object.keys(selectedMap).length
  const totalSelectedImages = Object.values(selectedMap)
  const previewThumbnails = totalSelectedImages.map((s) => s.thumb).slice(0, 4)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }) // scroll to top on mount
  }, [])

  useEffect(() => {
    if (gallerySettings) {
      setSettings(gallerySettings)
    }
    if (gallerySettings?.pageSize) {
      setPageSize(gallerySettings.pageSize)
    }
  }, [gallerySettings])

  useEffect(() => {
    if (typeof gallerySettings?.privateGallery === "boolean") {
      setPrivateGallery(gallerySettings.privateGallery)
    }
  }, [gallerySettings?.privateGallery])

  useEffect(() => {
    if (gallerySettings?.pageSize) {
      setPageSize(gallerySettings.pageSize)
    }
  }, [gallerySettings?.pageSize])

  const value: GalleryContextType = {
    valid,
    setValid,
    query,
    setQuery,
    images,
    setImages,
    loading,
    setLoading,
    showFullLoading,
    setShowFullLoading,
    progress,
    setProgress,
    noResults,
    setNoResults,
    page,
    setPage,
    total,
    setTotal,
    totalPages,
    pageSize,
    setPageSize,
    selectMode,
    setSelectMode,
    selectedMap,
    setSelectedMap,
    selectedCount,
    previewThumbnails,
    mode,
    setMode,
    personId,
    setPersonId,
    fancyRef,
    settings,
    setSettings,
    privateGallery,
    setPrivateGallery,
    nextPage,
    setNextPage
  }

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}