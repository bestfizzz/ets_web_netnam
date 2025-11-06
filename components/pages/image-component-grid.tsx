"use client"

import { useGalleryContext } from "@/hooks/gallery-context"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { Check } from "lucide-react"
import type { AssetMeta } from "@/hooks/gallery-context"
import MasonryComponentGrid from "@/components/pages/masonry-component-grid"

// 🧩 Inline components
const PromoBanner = ({ id }: { id: string }) => (
  <div
    id={id}
    className="col-span-1 row-span-1 xs:col-span-2 xs:row-span-2 sm:col-span-2 lg:col-span-2 
               w-full min-h-[220px] h-full bg-indigo-500 text-white flex flex-col 
               justify-center items-center rounded-xl p-4"
  >
    <h3 className="font-semibold text-base mb-1">🎉 Promo</h3>
    <p className="text-xs opacity-80 text-center">Exclusive offer for downloads</p>
  </div>
)

const InfoCard = ({ id }: { id: string }) => (
  <div
    id={id}
    className="col-span-1 row-span-1 xs:col-span-3 xs:row-span-2 sm:col-span-3 lg:col-span-2 
               w-full h-full bg-rose-500 text-white flex flex-col justify-center 
               items-center rounded-xl p-4"
  >
    <h3 className="font-semibold text-base mb-1">📸 Insight</h3>
    <p className="text-xs opacity-80 text-center">Behind the scenes</p>
  </div>
)

const CTASection = ({ id }: { id: string }) => (
  <div
    id={id}
    className="col-span-1 row-span-2 sm:col-span-2 lg:col-span-2 w-full h-full bg-emerald-500 
               text-white flex flex-col justify-center items-center rounded-xl p-4"
  >
    <h3 className="font-semibold text-base mb-1">⬇️ Download</h3>
    <p className="text-xs opacity-80 text-center">Get your favorite shots</p>
  </div>
)

interface InlineComponentGridProps {
  layoutType?: "default" | "masonry" // fixed mode via prop
}

export default function InlineComponentGrid({ layoutType = "masonry" }: InlineComponentGridProps) {
  const { images, loading, selectMode, selectedMap, setSelectedMap } = useGalleryContext()

  const componentConstructors = [PromoBanner, InfoCard, CTASection]
  const interval = 14

  const toggleSelect = (asset: AssetMeta) => {
    setSelectedMap((prev) => {
      const next = { ...prev }
      if (next[asset.id]) delete next[asset.id]
      else next[asset.id] = asset
      return next
    })
  }

  if (loading && images.length === 0) return <SkeletonLoading />

  const combinedList: (AssetMeta | { id: string; component: React.FC<{ id: string }> })[] = []
  let componentIndex = 0
  let compCounter = 0

  images.forEach((img, i) => {
    if (i === 0)
      combinedList.push({
        id: `component-${compCounter++}`,
        component: componentConstructors[componentIndex],
      })
    combinedList.push(img)
    if ((i + 1) % interval === 0) {
      componentIndex = (componentIndex + 1) % componentConstructors.length
      combinedList.push({
        id: `component-${compCounter++}`,
        component: componentConstructors[componentIndex],
      })
    }
  })

  // 🧱 Fixed mode render
  if (layoutType === "masonry") {
    return (
      <MasonryComponentGrid
        combinedList={combinedList}
        selectMode={selectMode}
        selectedMap={selectedMap}
        toggleSelect={toggleSelect}
      />
    )
  }

  // 🔲 Default grid
  return (
    <div
      className="
        grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5
        gap-4 w-full auto-rows-[220px] grid-flow-dense
      "
    >
      {combinedList.map((item) => {
        if ("component" in item) {
          const Comp = item.component
          return <Comp key={item.id} id={item.id} />
        }

        const img = item as AssetMeta
        const isSelected = Boolean(selectedMap[img.id])

        return (
          <div
            key={img.id}
            className={`relative overflow-hidden rounded-lg group transition-all duration-200 ${
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
                alt={img.filename}
                className="w-full h-[220px] object-cover rounded-lg group-hover:rounded-xl 
                           transition-all duration-200 group-hover:shadow-lg"
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
