"use client"

import { Button } from "@/components/ui/button"
import { Check, EllipsisVertical } from "lucide-react"
import { useGalleryContext } from "@/hooks/gallery-context"

export default function ShareHeader({
  themeColor = "#ffffff",
  pageTitle = "Share Page",
  pageLogo,
}: {
  themeColor: string
  pageTitle: string
  pageLogo?: string
}) {
  const { selectMode, setSelectMode, selectedMap } = useGalleryContext()
  const selectedCount = Object.keys(selectedMap).length

  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
  }

  return (
    <header
      className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: themeColor }}
    >
      <div className="mx-auto w-full px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3">
          {/* --- Logo + Title --- */}
          <div className="flex items-center gap-2 sm:gap-3">
            {pageLogo ? (
              <img
                src={pageLogo}
                alt="Logo"
                className="h-9 sm:h-10 w-9 xs:w-fit object-scale-down xs:object-contain"
              />
            ) : (
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                AI
              </div>
            )}
            <h1 className="text-sm sm:text-lg font-semibold text-slate-800">
              {pageTitle}
            </h1>
          </div>

          {/* --- Actions --- */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
            <Button
              variant={selectMode ? "secondary" : "outline"}
              onClick={toggleSelectMode}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              {selectMode ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <EllipsisVertical className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {selectMode ? `Selected (${selectedCount})` : "Select"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
