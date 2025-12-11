"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ScanSearch, Check, SquareMousePointer } from "lucide-react"
import { ImageSearchDialog } from "@/components/pages/search/components/image-search-dialog"
import uploadAsset from "@/lib/uploadAsset"
import { useGalleryContext } from "@/hooks/gallery-context"
import { scrollToGallery } from "@/lib/utils"
import { TextSearchBar } from "@/components/pages/search/components/text-search-bar"

export default function SearchHeader1({
    themeColor = "#ffffff",
    pageTitle = "Search Page",
    pageLogo,
}: {
    themeColor: string
    pageTitle: string
    pageLogo?: string
}) {
    const {
        setQuery,
        query,
        selectMode,
        setSelectMode,
        selectedCount,
        setMode,
        setPersonId,
        setNoResults,
    } = useGalleryContext()

    const { uuid } = useParams<{ uuid: string }>() || { uuid: null }
    const [uploadOpen, setUploadOpen] = useState(false)

    const handleUpload = async (file: File, uuid: string) => {
        const toastID = toast.info("Uploading photo...")
        try {
            if (!uuid || !file) throw new Error()
            const result = await uploadAsset(file, uuid)
            toast.success("Uploaded successfully!", {
                id: toastID
            })
            if (!result.person_id) {
                toast.warning("No face recognized.", {
                    id: toastID
                })
                scrollToGallery()
                setNoResults(true)
                setQuery("")
                setPersonId(null)
                return
            }

            toast.success("Face recognized!", {
                id: toastID
            })
            setPersonId(result.person_id)
            setMode("person")
        } catch (err: any) {
            if (err.code === "FILE_TOO_LARGE") {
                // ✅ Handle size error gracefully, no screen change
                toast.error(err.message, {
                    id: toastID
                })
                return
            }
            console.error(err)
            toast.error(err?.message || "Upload or person fetch failed.", {
                id: toastID
            })
            setNoResults(true)
        }
    }

    const handleSearchText = (text: string) => {
        if (!text.trim()) {
            toast.error("Please enter a search term.")
            return
        }
        toast.info(`Searching for "${text}"...`)
        setQuery(text)
        setMode("keyword")
        scrollToGallery()
    }

    const toggleSelectMode = () => setSelectMode(!selectMode)

    return (
        <header className="sticky shadow-sm top-0 z-50" style={{ backgroundColor: themeColor }}>
            <div className="mx-auto w-full px-3 sm:px-4 lg:px-8 py-3">
                {/* ✅ Responsive layout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left — Logo + Page Name */}
                    <div className="flex items-center gap-2 shrink-0">
                        {pageLogo ? (
                            <img
                                src={pageLogo}
                                alt="Logo"
                                className="h-9 sm:h-10 w-9 xs:w-fit object-scale-down xs:object-contain"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                                AI
                            </div>
                        )}
                        <h1 className="text-base sm:text-lg font-semibold text-slate-800 whitespace-nowrap">
                            {pageTitle}
                        </h1>
                    </div>

                    {/* ✅ Search + Buttons always in the same row */}
                    {/* ✅ Search + Buttons row */}
                    <div className="flex flex-1 w-full sm:w-auto items-center justify-between gap-2">
                        {/* Search bar (centered, stretches) */}
                        <div className="flex-1 max-w-md xl:max-w-2xl mx-auto">
                            <TextSearchBar initialQuery={query} onSearch={handleSearchText} />
                        </div>

                        {/* Buttons (pinned right) */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => setUploadOpen(true)}
                                className="flex items-center gap-2 text-sm h-9 px-3"
                            >
                                <ScanSearch className="w-3! h-3! sm:w-6! sm:h-6!" strokeWidth={1.25} />
                                <span className="hidden sm:inline">Search</span>
                            </Button>

                            <Button
                                variant={selectMode ? "secondary" : "outline"}
                                onClick={toggleSelectMode}
                                className="flex items-center gap-2 text-sm h-9 px-3"
                            >
                                {selectMode ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <SquareMousePointer className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">
                                    {selectMode ? `Selected (${selectedCount})` : "Select"}
                                </span>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Upload Dialog */}
            <ImageSearchDialog
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onUpload={(file) => handleUpload(file, uuid)}
            />
        </header>
    )
}
