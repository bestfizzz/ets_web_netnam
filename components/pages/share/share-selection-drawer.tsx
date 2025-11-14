"use client"

import { Button } from "@/components/ui/button"
import { Download, X, Image, CheckSquare } from "lucide-react"
import { downloadSelected } from "@/lib/utils"
import { AssetMeta, useGalleryContext } from "@/hooks/gallery-context"

export default function ShareSelectionDrawer() {
  const {
    selectMode,
    setSelectMode,
    selectedCount,
    previewThumbnails,
    selectedMap,
    setSelectedMap,
    images,
    settings
  } = useGalleryContext()
  const toggleSelectAllVisible = () => {
    const allSelected = images.every((img: AssetMeta) => Boolean(selectedMap[img.id]))
    setSelectedMap((prev: Record<string, any>) => {
      const next = { ...prev }
      if (allSelected) {
        images.forEach((img: AssetMeta) => delete next[img.id])
      } else {
        images.forEach((img: AssetMeta) => {
          next[img.id] = { thumb: img.thumb, preview: img.preview, download: img.download, filename: img.filename }
        })
      }
      return next
    })
  }

  const handleDownload = (selectedMap: Record<string, Omit<AssetMeta, "id">>) => {
    setSelectMode(false)
    setSelectedMap({})
    downloadSelected(selectedMap, settings.pageTitle)
  }

  const allPageSelected = images.length > 0 && images.every((img: AssetMeta) => Boolean(selectedMap[img.id]))

  return (
    <div
      className={`hidden md:block fixed left-1/2 transform -translate-x-1/2 bottom-4 sm:bottom-6 z-50 w-[calc(100%-1rem)] sm:w-[min(960px,calc(100%-2rem))] transition-all duration-300 ease-out
        ${selectMode ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}`}
    >
      <div className="bg-white border shadow-lg rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <div className="flex items-center justify-center rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow shrink-0">
            <Image className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base font-semibold text-slate-900 truncate">Selected Images</div>
            <div className="text-xs sm:text-sm text-slate-500 truncate">
              {selectedCount > 0
                ? `Ready to download • ${selectedCount} item${selectedCount > 1 ? "s" : ""}`
                : "No items selected"}
            </div>
          </div>
          {previewThumbnails.length > 0 && (
            <div className="flex ml-2 -space-x-2 shrink-0">
              {previewThumbnails.map((src: string, i: number) => (
                <img key={i} src={src} alt={`preview-${i}`} className="w-8 h-8 sm:w-9 sm:h-9 rounded-md border-2 border-white object-cover shadow-sm" />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Button
            onClick={toggleSelectAllVisible}
            disabled={images.length === 0}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            {allPageSelected ? "Deselect Page" : "Select Page"}
          </Button>

          <Button
            onClick={() => setSelectedMap({})}
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            Clear
          </Button>

          <Button
            onClick={() => handleDownload(selectedMap)}
            size="sm"
            disabled={selectedCount === 0}
            className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            Download
          </Button>

          <div className="flex-1"></div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectMode(false)
              setSelectedMap({})
            }}
            className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}