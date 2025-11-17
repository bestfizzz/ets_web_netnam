"use client"

import { useGalleryContext } from "@/hooks/gallery-context"
import { SkeletonLoading } from "@/components/skeleton-loading"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import type { AssetMeta } from "@/hooks/gallery-context"

// 🧩 Inline image components (keep as-is)
const PromoImage = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="Promo"
    className="min-h-[220px] 2xl:max-h-[31vw] col-span-1 row-span-1 xs:col-span-2 xs:col-start-1 sm:row-span-2 w-full h-full object-cover rounded-xl shadow-lg"
  />
)

const InfoImage = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="Insight"
    className="min-h-[220px] 2xl:max-h-[31vw] col-span-1 xs:col-span-2 xs:row-span-2 xs:col-end-[-1] w-full h-full object-cover rounded-xl shadow-lg"
  />
)

const CTAImage = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="Download"
    className="min-h-[220px] 2xl:max-h-[31vw] col-span-1 row-span-1 xs:col-span-2 xs:col-start-1 sm:row-span-2 w-full h-full object-cover rounded-xl shadow-lg"
  />
)

const RowImage = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="Insight Row"
    className="min-h-[140px] col-start-1 col-end-[-1] object-cover rounded-xl shadow-lg"
  />
)

// 📱 Breakpoint detection
function useBreakpointCols() {
  const [cols, setCols] = useState(1)

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1280) setCols(5)
      else if (window.innerWidth >= 768) setCols(4)
      else if (window.innerWidth >= 640) setCols(3)
      else if (window.innerWidth >= 475) setCols(2)
      else setCols(1)
    }
    updateCols()
    window.addEventListener("resize", updateCols)
    return () => window.removeEventListener("resize", updateCols)
  }, [])

  return cols
}

// 🖼️ External promo image mapping (parameterized object)
export const PROMO_IMAGES = {
  imagePromo: "/images/netnamSquare.jpg",
  imageInfo: "/images/netnamSquare.jpg",
  imageCTA: "/images/netnamSquare.jpg",
  imageRow: "/images/netnam720.jpg",
}

// 🧩 External promo component map (re-usable)
export const PROMO_COMPONENTS = {
  Promo: PromoImage,
  Info: InfoImage,
  CTA: CTAImage,
  Row: RowImage,
}

export default function InlineComponentGrid({
  promoImages = PROMO_IMAGES, // allows overriding externally
}: {
  promoImages?: Record<string, string>
}) {
  const { images, loading, selectMode, selectedMap, setSelectedMap } = useGalleryContext()
  const cols = useBreakpointCols()

  // 🔧 map image type → component
  const promoConstructors = [
    (id: string) => (
      <PromoImage key={id} src={promoImages?.imagePromo || PROMO_IMAGES.imagePromo} />
    ),
    (id: string) => (
      <InfoImage key={id} src={promoImages?.imageInfo || PROMO_IMAGES.imageInfo} />
    ),
    (id: string) => (
      <CTAImage key={id} src={promoImages?.imageCTA || PROMO_IMAGES.imageCTA} />
    ),
    (id: string) => (
      <RowImage key={id} src={promoImages?.imageRow || PROMO_IMAGES.imageRow} />
    ),
  ]

  const toggleSelect = (asset: AssetMeta) => {
    setSelectedMap((prev) => {
      const next = { ...prev }
      if (next[asset.id]) delete next[asset.id]
      else next[asset.id] = asset
      return next
    })
  }

  if (loading && images.length === 0) return <SkeletonLoading />

  const combinedList: React.ReactNode[] = []
  let promoIndex = 0
  let imageCounter = 0
  const imagesPerCycle = cols * 3 // roughly 3 rows worth

  images.forEach((img) => {
    // 🔁 Insert promo block at start and after each cycle
    if (imageCounter % imagesPerCycle === 0 && promoIndex < promoConstructors.length) {
      combinedList.push(promoConstructors[promoIndex](`promo-${promoIndex}`))
      promoIndex++
    }

    combinedList.push(
      <div
        key={img.id}
        className={`relative rounded-lg group transition-all duration-200 ${
          selectMode && selectedMap[img.id] ? "ring-2 ring-indigo-500" : ""
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
            className="w-full h-[220px] 2xl:h-[15vw] object-cover rounded-lg group-hover:rounded-xl transition-all duration-200 group-hover:shadow-lg"
          />
          {selectMode && (
            <div
              className={`absolute top-2 left-2 z-30 rounded-full p-1 shadow transition-all ${
                selectedMap[img.id] ? "bg-white ring-2 ring-indigo-500" : "bg-white/90"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {selectedMap[img.id] ? (
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

    imageCounter++
  })

  return (
    <div
      className="
        grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5
        gap-4 w-full grid-flow-dense
      "
    >
      {combinedList}
    </div>
  )
}
