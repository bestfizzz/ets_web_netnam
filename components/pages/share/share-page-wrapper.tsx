"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import ShareSelectionDrawer from "@/components/pages/share/share-selection-drawer"
import { ShareActionsAPI } from "@/lib/server_api/share-actions"
import { AssetMeta, useGalleryContext } from "@/hooks/gallery-context"
import { ShareLayoutMap, ShareLayoutKey } from "@/lib/layoutMap/share-map"
import AdBanner from "@/components/pages/ad-banner"

export default function SharePageWrapper({
  children,
  uuid,
  settings,
  preview = false,
}: {
  children?: React.ReactNode
  uuid: string
  settings: any
  preview?: boolean
}) {
  const {
    setImages,
    page,
    setTotal,
    pageSize,
    setLoading,
    showFullLoading,
    setShowFullLoading,
    progress,
    setProgress,
    setNoResults,
    fancyRef,
  } = useGalleryContext()

  const [contactID, setContactID] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [authorized, setAuthorized] = useState(false)
  const [assetIds, setAssetIds] = useState<string[]>([]) // full list of assetIds

  // ✅ Placeholder mode for preview
  useEffect(() => {
    if (!preview) return
    setAuthorized(true)
    setShowFullLoading(false)
    const placeholderAssets: AssetMeta[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `placeholder-${i}`,
      thumb: `/placeholder/400.svg`,
      preview: `/placeholder/1200.svg`,
      download: `/placeholder/1200.svg`,
      filename: `placeholder.svg`,
    }))

    setImages(placeholderAssets)
    setTotal(120)
  }, [preview, setImages, pageSize, setTotal])

  // ✅ Load paged images locally after authorization
  useEffect(() => {
    if (!authorized || preview) return
    loadImages(page)
  }, [authorized, page])

  // ✅ Core loader (paging from assetIds)
  async function loadImages(pageNum: number) {
    if (!uuid || preview || assetIds.length === 0) return
    try {
      setLoading(true)
      setShowFullLoading(true)
      setProgress(20)

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const currentIds = assetIds.slice(start, end)
      const totalAssets = assetIds.length
      setTotal(totalAssets)
      setNoResults(currentIds.length === 0)
      setProgress(70)

      const mapped: AssetMeta[] = currentIds.map((id) => ({
        id,
        thumb: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/thumbnail/${uuid}?assetId=${id}&size=thumbnail`,
        preview: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/thumbnail/${uuid}?assetId=${id}&size=preview`,
        download: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/image/${uuid}?assetId=${id}`,
        filename: `${settings.pageTitle}_${id}`,
      }))

      setImages(mapped)
      setProgress(100)
    } catch (err) {
      console.error("Error loading shared images:", err)
      toast.error("Failed to fetch shared images")
    } finally {
      setTimeout(() => setShowFullLoading(false), 400)
      setLoading(false)
    }
  }

  // ✅ Authenticate and load full asset list
  const handleAccess = async () => {
    if (!contactID.trim() || accessCode === "") {
      return toast.error("Please enter credentials")
    }

    try {
      const data = await ShareActionsAPI.authenticate(uuid, contactID, accessCode)
      if (!data?.assetIds?.length) {
        return toast.error("No assets found for this access code")
      }

      setAssetIds(data.assetIds)
      setAuthorized(true)
      toast.success("Access granted ✅")

      // Load first page right away
      loadImages(1)
    } catch (err) {
      console.error("Access failed:", err)
      toast.error("Access denied ❌")
    }
  }

  // === UI States ===

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-bold mb-4">🔒 Restricted Access</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Please enter your contact and access code to continue.
          </p>
          <Input
            placeholder="Enter ID"
            value={contactID}
            onChange={(e) => setContactID(e.target.value)}
            className="mb-3"
            type="text"
          />
          <Input
            type="text"
            placeholder="Enter access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="mb-3"
          />
          <Button onClick={handleAccess} className="w-full">
            Continue
          </Button>
        </div>
      </div>
    )
  }

  const HeaderComponent = ShareLayoutMap[settings.layout as ShareLayoutKey]?.header ?? ShareLayoutMap.default.header
  const hasAds = false

  return (
    <main
      className="relative flex flex-col min-h-screen"
      ref={fancyRef}
      style={{ backgroundColor: settings.themeColor }}
    >
      {/* 🧭 Header */}
      <HeaderComponent
        themeColor={settings.themeColor}
        pageTitle={settings.pageTitle}
        pageLogo={settings.pageLogo}
      />

      <div className="relative flex flex-1 w-full overflow-x-hidden">
        {hasAds && <AdBanner side="left" src={settings.adbannerLeft} />}
        <div
          className={`flex-1 flex flex-col ${hasAds ? "lg:mx-40" : ""
            } transition-all duration-300`}
        >
          {children}
        </div>
        {hasAds && <AdBanner side="right" src={settings.adbannerRight} />}
      </div>

      {/* 🧺 Drawer */}
      <ShareSelectionDrawer />

      {/* ⏳ Fullscreen Loader */}
      {showFullLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
          <p className="mb-4 text-gray-700 font-medium">Loading images...</p>
          <div className="w-1/2 max-w-md">
            <Progress value={progress} className="h-3" />
          </div>
        </div>
      )}
    </main>
  )
}
