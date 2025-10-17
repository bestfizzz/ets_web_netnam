"use client"

import { Button } from "@/components/ui/button"
import { Download, X, ImageIcon, Share2, CheckSquare, SquareX } from "lucide-react"
import { downloadSelected } from "@/lib/utils"
import { useGalleryContext } from "@/hooks/gallery-context"

export default function SearchSelectionDrawer() {
  const {
    selectMode,
    setSelectMode,
    selectedCount,
    previewThumbnails,
    selectedMap,
    setSelectedMap,
    images,
  } = useGalleryContext()

  const toggleSelectAllVisible = () => {
    const allSelected = images.every((img) => Boolean(selectedMap[img.id]))
    setSelectedMap((prev) => {
      const next = { ...prev }
      if (allSelected) {
        images.forEach((img) => delete next[img.id])
      } else {
        images.forEach((img) => {
          next[img.id] = {
            thumb: img.thumb,
            preview: img.preview,
            download: img.download,
          }
        })
      }
      return next
    })
  }

  const handleShare = () => {
    alert("Share functionality coming soon!")
  }

  const allPageSelected = images.length > 0 && images.every((img) => Boolean(selectedMap[img.id]))

  return (
    <div
      className={`fixed left-1/2 transform -translate-x-1/2 bottom-4 sm:bottom-6 z-50 w-[calc(100%-1rem)] sm:w-[min(960px,calc(100%-2rem))] transition-all duration-300 ease-out
        ${selectMode ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}`}
    >
      <div className="bg-white border shadow-lg rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <div className="hidden sm:flex items-center justify-center rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow shrink-0">
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
            <div className="hidden sm:flex ml-2 -space-x-2 shrink-0">
              {previewThumbnails.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-md border-2 border-white object-cover shadow-sm"
                />
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
            {allPageSelected ? (
              <SquareX className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{allPageSelected ? "Deselect" : "Select"} Page</span>
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Share</span>
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
            onClick={() => downloadSelected(selectedMap)}
            size="sm"
            disabled={selectedCount === 0}
            className="hidden md:flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <span className="hidden xs:inline">Close</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
