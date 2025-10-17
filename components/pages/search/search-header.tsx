"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Upload, Check, EllipsisVertical } from "lucide-react"
import { UploadModal } from "@/components/pages/search/upload-modal"
import uploadAsset from "@/lib/uploadAsset"
import { useGalleryContext } from "@/hooks/gallery-context"
import { scrollToGallery } from "@/lib/utils"

export default function SearchHeader({ themeColor='#ffffff', pageTitle='Search Page', pageLogo }: { themeColor: string, pageTitle: string , pageLogo?: string }) {
  const {
    query,
    setQuery,
    selectMode,
    setSelectMode,
    selectedCount,
    setMode,
    setPersonId,
    setNoResults,
  } = useGalleryContext()
  const { uuid } = useParams<{ uuid: string }>() || { uuid: "fd1cd598-5b9d-4a59-a483-659dc14a595f" }
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleUpload = async (file: File, uuid: string) => {
    try {
      toast.info("Uploading photo...")
      const result = await uploadAsset(file, uuid)

      toast.success("Uploaded successfully!")

      if (!result.person_id) {
        toast.warning("No face recognized.")
        scrollToGallery()
        setNoResults(true)
        return
      }

      toast.success("Face recognized!")
      setPersonId(result.person_id)
      setMode("person")

    } catch (err: any) {
      console.error("Upload or fetch error:", err)

      if (err.code === "FILE_TOO_LARGE") {
        // ✅ Handle size error gracefully, no screen change
        toast.error(err.message)
        return
      }

      // ✅ Only treat other errors as actual failures
      toast.error(err?.message || "Upload or person fetch failed.")
      setNoResults(true)
    }
  }

  const toggleSelectMode = () => {
    setSelectMode((prev: boolean) => !prev)
  }

  return (
    <header className="sticky shadow-sm top-0 z-50" style={{ backgroundColor: themeColor }}>
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {pageLogo ?
              <img
                src={pageLogo}
                alt="Logo"
                className="h-9 sm:h-10 w-9 xs:w-fit object-scale-down xs:object-contain"
              />
              :
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                AI
              </div>
            }
            <h1 className="text-base sm:text-lg font-semibold text-slate-800">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <Button
              variant={selectMode ? "secondary" : "outline"}
              onClick={toggleSelectMode}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              {selectMode ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <EllipsisVertical className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="hidden xs:inline">{selectMode ? `Selected (${selectedCount})` : "Select"}</span>
              <span className="xs:hidden">{selectMode ? selectedCount : "Select"}</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <UploadModal
              open={uploadOpen}
              onClose={() => setUploadOpen(false)}
              onUpload={(file) => handleUpload(file, uuid)}
              query={query}
              setQuery={setQuery}
            />
          </div>
        </div>
      </div>
    </header>
  )
}