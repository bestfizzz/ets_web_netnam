"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useFancybox } from "@/hooks/use-fancybox"
import { performDownload } from "@/lib/utils"

export type AssetMeta = {
  id: string
  thumb: string
  preview: string
  download: string
}

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

  // Pagination
  page: number
  setPage: (page: number) => void
  total: number
  setTotal: (total: number) => void
  totalPages: number
  pageSize: number
  setPageSize: (pageSize: number) => void
  // Selection Mode
  selectMode: boolean
  setSelectMode: (mode: boolean) => void
  selectedMap: Record<string, Omit<AssetMeta, "id">>
  setSelectedMap: (map: Record<string, Omit<AssetMeta, "id">> | ((prev: Record<string, Omit<AssetMeta, "id">>) => Record<string, Omit<AssetMeta, "id">>)) => void
  selectedCount: number
  previewThumbnails: string[]

  // Mode (all/person)
  mode: "all" | "person"
  setMode: (mode: "all" | "person") => void
  personId: string | null
  setPersonId: (id: string | null) => void

  // Fancybox ref
  fancyRef: React.RefObject<HTMLElement | null>
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

export function GalleryProvider({ children, galleryPageSize = 60 }: { children: ReactNode, galleryPageSize?: number }) {
  const [valid, setValid] = useState<boolean | null>(null)
  const [query, setQuery] = useState("")
  const [images, setImages] = useState<AssetMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [showFullLoading, setShowFullLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedMap, setSelectedMap] = useState<Record<string, Omit<AssetMeta, "id">>>({})
  const [noResults, setNoResults] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(60)
  const [mode, setMode] = useState<"all" | "person">("all")
  const [personId, setPersonId] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const fancyRef = useFancybox(images, performDownload, selectMode)

  const selectedCount = Object.keys(selectedMap).length
  const totalSelectedImages = Object.values(selectedMap)
  const previewThumbnails = totalSelectedImages.map((s) => s.thumb).slice(0, 4)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }) // scroll to top on mount
  }, [])

  useEffect(() => {
    if (galleryPageSize) {
      setPageSize(galleryPageSize)
    }
  }, [galleryPageSize])

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
  }

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}