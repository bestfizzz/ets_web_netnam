import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Check, EllipsisVertical } from "lucide-react"
import ShareSelectionDrawer from "@/components/pages/share/share-selection-drawer"
import { getAllAssets } from "@/lib/api"
import { AssetMeta, useGalleryContext } from "@/hooks/gallery-context"

export default function SharePageWrapper({ children, uuid, settings, preview = false }: { children?: React.ReactNode, uuid: string, settings: any, preview?: boolean }) {

  // ✅ Reuse shared context state (instead of duplicating)
  const {
    images,
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
    selectMode,
    setSelectMode,
    selectedMap,
    setSelectedMap,
    fancyRef
  } = useGalleryContext()

  // Access + auth states
  const [contact, setContact] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [authorized, setAuthorized] = useState(false)
  const [valid, setValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (!preview) return
    setAuthorized(true)
    setShowFullLoading(false)
    const placeholderAssets: AssetMeta[] = Array.from({ length: 10 }, (_, i) => ({
      id: `placeholder-${i}`,
      thumb: `/placeholder/400.svg`,
      preview: `/placeholder/1200.svg`,
      download: `/placeholder/1200.svg`
    }))

    setImages(placeholderAssets)
    setTotal(placeholderAssets.length)
  }, [preview, setImages, setTotal])

  // ✅ Validate share URL
  useEffect(() => {
    if (!uuid || preview) return
    setValid(null)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/check-url/${uuid}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setValid(data.active ?? false)
      })
      .catch((err) => {
        console.error("Check URL failed:", err)
        setValid(false)
      })
  }, [uuid])

  // ✅ Load images after authorization and valid URL
  useEffect(() => {
    if (!authorized || !valid || preview) return
    loadImages(page)
  }, [authorized, valid, page])

  // ✅ Core loader (shared API logic)
  async function loadImages(pageNum: number) {
    if (!uuid) return
    try {
      setLoading(true)
      setShowFullLoading(true)
      setProgress(20)

      const data = await getAllAssets(uuid, pageNum, pageSize)
      const totalAssets = data.assets?.total ?? data.assets?.count ?? 0
      const items = data.assets?.items ?? []
      setTotal(totalAssets)
      setNoResults(items.length === 0)
      setProgress(70)

      const mapped: AssetMeta[] = items.map((item: any) => ({
        id: String(item.id),
        thumb: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/thumbnail/${uuid}?assetId=${item.id}&size=thumbnail`,
        preview: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/thumbnail/${uuid}?assetId=${item.id}&size=preview`,
        download: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/image/${uuid}?assetId=${item.id}`,
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

  const handleAccess = () => {
    if (!contact.trim()) return toast.error("Please enter your contact")
    if (accessCode !== "1234") return toast.error("Invalid access code")
    toast.success("Access granted ✅")
    setAuthorized(true)
  }

  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev)
  }

  if (valid === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-2xl font-bold">Not Found</h1>
        <p className="mt-2 text-gray-500">
          The requested gallery does not exist or has been deactivated.
        </p>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-bold mb-4">🔒 Restricted Access</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Please enter your contact and access code to continue.
          </p>
          <Input
            placeholder="Enter contact (email or name)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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

  // ✅ UI
  const selectedCount = Object.keys(selectedMap).length
  const totalSelectedImages = Object.values(selectedMap)
  const previewThumbnails = totalSelectedImages.map((s) => s.thumb).slice(0, 4)

  return (
    <main className="relative flex flex-col min-h-screen" ref={fancyRef} style={{ backgroundColor: settings.themeColor }}>
      <header className="sticky shadow-sm top-0 z-50" style={{ backgroundColor: settings.themeColor }}>
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {settings.pageLogo ?
                <img
                  src={settings.pageLogo}
                  alt="Logo"
                  className="h-9 sm:h-10 w-9 xs:w-fit object-scale-down xs:object-contain"
                />
                :
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  AI
                </div>
              }
              <h1 className="text-base sm:text-lg font-semibold text-slate-800">{settings.pageTitle ? settings.pageTitle : 'Share Page'}</h1>
            </div>

            <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
              <Button
                variant={selectMode ? "secondary" : "outline"}
                onClick={toggleSelectMode}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                {selectMode ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <EllipsisVertical className="w-3 h-3 sm:w-4 sm:h-4" />}
                {selectMode ? `Selected (${selectedCount})` : "Select"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {children}

      <ShareSelectionDrawer
        selectMode={selectMode}
        selectedCount={selectedCount}
        previewThumbnails={previewThumbnails}
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        setSelectMode={setSelectMode}
        images={images}
      />

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