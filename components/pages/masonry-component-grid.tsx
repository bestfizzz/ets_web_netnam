import { Check } from "lucide-react"
import type { AssetMeta } from "@/hooks/gallery-context"

export default function MasonryComponentGrid({
  combinedList,
  selectMode,
  selectedMap,
  toggleSelect,
}: {
  combinedList: (AssetMeta | { id: string; component: React.FC<{ id: string }> })[]
  selectMode: boolean
  selectedMap: Record<string, any>
  toggleSelect: (asset: AssetMeta) => void
}) {
  return (
    <div
      className="
        columns-1
        xs:columns-2
        sm:columns-3
        md:columns-4
        xl:columns-5
        gap-4
        w-full
        mt-4
      "
    >
      {combinedList.map((item) => {
        // 🧩 Inline components
        if ("component" in item) {
          const Comp = item.component
          return (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <Comp id={item.id} />
            </div>
          )
        }

        // 🖼️ Image items
        const img = item as AssetMeta
        const isSelected = Boolean(selectedMap[img.id])

        return (
          <div
            key={img.id}
            className="relative mb-4 break-inside-avoid overflow-hidden group transition-all duration-200 rounded-lg"
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
                className="w-full min-h-[220px] max-h-[500px] object-cover rounded-lg group-hover:rounded-xl transition-all duration-200 group-hover:shadow-lg"
                loading="lazy"
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
