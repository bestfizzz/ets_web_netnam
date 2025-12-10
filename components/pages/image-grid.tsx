"use client"

import MasonryGrid from "@/components/pages/masonry-grid"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { useGalleryContext } from "@/hooks/gallery-context"
import { Check } from "lucide-react"
import type { AssetMeta } from "@/hooks/gallery-context"

interface ImageGridProps {
  layoutType?: "default" | "masonry"
}

export default function ImageGrid({ layoutType = "default" }: ImageGridProps) {
  const { images, loading, selectMode, selectedMap, setSelectedMap } = useGalleryContext()

  const toggleSelect = (asset: AssetMeta) => {
    setSelectedMap((prev) => {
      const next = { ...prev }
      if (next[asset.id]) delete next[asset.id]
      else
        next[asset.id] = {
          thumb: asset.thumb,
          preview: asset.preview,
          download: asset.download,
          filename: asset.filename,
        }
      return next
    })
  }

  if (loading && images.length === 0) return <SkeletonLoading />

  if (layoutType === "masonry") {
    return (
      <MasonryGrid
        images={images}
        selectMode={selectMode}
        selectedMap={selectedMap}
        toggleSelect={toggleSelect}
      />
    )
  }

  // Default grid layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-4 w-full">
      {images.map((img) => {
        const isSelected = Boolean(selectedMap[img.id])
        return (
          <div
            key={img.id}
            className={`relative rounded-lg group transition-all duration-200 ${
              selectMode && isSelected ? "ring-2 ring-indigo-500" : ""
            }`}
          >
            <a
              href={img.preview}
              {...(selectMode ? {} : { "data-fancybox": "gallery" })}
              data-download-src={img.download}
              data-download-filename={img.filename}
              onClick={(e) => {
                if (selectMode) {
                  e.preventDefault()
                  toggleSelect(img)
                }
              }}
              className="block relative"
            >
              <img
                src={img.thumb}
                alt={`Image ${img.id}`}
                className="w-full h-[220px] 2xl:h-[15vw] object-cover rounded-lg group-hover:rounded-xl transition-all duration-200 group-hover:shadow-xl"
              />

              {selectMode && (
                <div
                  className={`absolute top-2 left-2 z-30 rounded-full p-1 shadow transition-all ${
                    isSelected ? "bg-white ring-2 ring-indigo-500" : "bg-white/90"
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-sm" />
                    )}
                  </div>
                </div>
              )}
            </a>
          </div>
        )
      })}
    </div>
  )
}
