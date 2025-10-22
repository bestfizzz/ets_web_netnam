"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { useGalleryContext } from "@/hooks/gallery-context"
import type { AssetMeta } from "@/hooks/gallery-context"

export default function ImageGrid() {
  const { images, settings, loading, selectMode, selectedMap, setSelectedMap } = useGalleryContext()

  const toggleSelect = (asset: AssetMeta) => {
    setSelectedMap((prev) => {
      const next = { ...prev }
      if (next[asset.id]) delete next[asset.id]
      else next[asset.id] = {
        thumb: asset.thumb,
        preview: asset.preview,
        download: asset.download,
        filename: asset.filename
      }
      return next
    })
  }
  
  if (loading && images.length === 0) return <SkeletonLoading />

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full mt-4">
      {images.map((img) => {
        const isSelected = Boolean(selectedMap[img.id])

        return (
          <Card
            key={img.id}
            className={`relative overflow-hidden p-0 group transition-all duration-200 ${
              selectMode && isSelected ? "ring-2 ring-indigo-500" : ""
            }`}
          >
            <CardContent className="p-0">
              <a
                href={img.preview}
                {...(selectMode ? {} : { "data-fancybox": "gallery" })}
                data-download-src={img.download}
                data-download-filename={`${img.filename}.jpg`}
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
                  className="w-full h-[220px] sm:h-[200px] md:h-[180px] lg:h-[200px] xl:h-[220px] object-cover rounded-lg group-hover:rounded-xl transition-all duration-200 group-hover:shadow-lg"
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
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
