import { useEffect } from "react"
import { useGalleryContext } from "@/hooks/gallery-context"
import SearchHeader from "@/components/pages/search/search-header"
import SearchSelectionDrawer from "@/components/pages/search/search-selection-drawer"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { getPersonAssets, getAllAssets, getPersonAssetStats, getAssetsByKeyword } from "@/lib/api/assets"
import type { AssetMeta } from "@/hooks/gallery-context"
import { scrollToGallery } from "@/lib/utils"


export default function SearchPageWrapper({ children, uuid, settings, preview = false }: { children?: React.ReactNode, uuid: string, settings: any, preview?: boolean }) {
  const {
    valid,
    setValid,
    mode,
    privateGallery,
    personId,
    query,
    setImages,
    page,
    setPage,
    setTotal,
    pageSize,
    setNextPage,
    setLoading,
    showFullLoading,
    setShowFullLoading,
    progress,
    setProgress,
    setNoResults,
    fancyRef
  } = useGalleryContext()
  useEffect(() => {
    if (!preview) return
    setShowFullLoading(false)
    const placeholderAssets: AssetMeta[] = Array.from({ length: 10 }, (_, i) => ({
      id: `placeholder-${i}`,
      thumb: `/placeholder/400.svg`,
      preview: `/placeholder/1200.svg`,
      download: `/placeholder/1200.svg`,
      filename: `placeholder.svg`
    }))

    setImages(placeholderAssets)
    setTotal(placeholderAssets.length)
  }, [preview, setImages, setTotal])

  // Fetch assets when mode or personId changes
  useEffect(() => {
    if (!uuid || preview || (mode==='all' && privateGallery===true)) return

    const load = async () => {
      setShowFullLoading(true)
      setImages([])
      setPage(1)
      setNoResults(false)
      try {
        await fetchAssets(1)
      } finally {
        setTimeout(() => setShowFullLoading(false), 300)
      }
    }

    load()
  }, [mode, personId, query, uuid])

  // Separate effect for page number change
  useEffect(() => {
    if (!uuid || preview || (mode==='all' && privateGallery===true)) return
    

    if (mode != 'keyword') {
      setImages([])
      scrollToGallery()
    }

    fetchAssets(page)
  }, [page])

  async function fetchAssets(pageNum: number) {
    if (!uuid) return
    try {
      setLoading(true)
      setProgress(10)

      let data
      let totalAssets = 0

      if (mode === "person" && personId) {
        setProgress(40)
        const stats = await getPersonAssetStats(uuid, personId)
        totalAssets = stats.assets ?? 0
        setProgress(70)
        data = await getPersonAssets(uuid, personId, pageNum, pageSize)
      } else if (mode === "keyword" && query) {
        setProgress(60)
        data = await getAssetsByKeyword(uuid, query, pageNum, pageSize)
      } else {
        setProgress(50)
        data = await getAllAssets(uuid, pageNum, pageSize)
        totalAssets = data.assets?.total ?? data.assets?.count ?? 0
      }

      const items = data.assets?.items ?? []
      const nextPage = data.assets?.nextPage ?? null
      setProgress(90)

      const mapped: AssetMeta[] = items.map((item: any) => ({
        id: String(item.id),
        thumb: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/thumbnail/${uuid}?assetId=${item.id}&size=thumbnail`,
        preview: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/thumbnail/${uuid}?assetId=${item.id}&size=preview`,
        download: `${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/image/${uuid}?assetId=${item.id}`,
        filename: `${settings.pageTitle}_${item.id}`
      }))
      if (mode === 'keyword') {
        setImages(prev => [...prev, ...mapped])
      } else {
        setTotal(totalAssets)
        setImages(mapped)
      }
      setNextPage(nextPage) 
      setProgress(100)
    } catch (err) {
      console.error("Error fetching assets:", err)
      toast.error("Failed to fetch images")
    } finally {
      setTimeout(() => setProgress(0), 400)
      setLoading(false)
    }
  }

  return (
    <main className="relative flex flex-col min-h-screen" ref={fancyRef} style={{ backgroundColor: settings.themeColor }}>
      <SearchHeader themeColor={settings.themeColor} pageTitle={settings.pageTitle} pageLogo={settings.pageLogo} />

      {children}

      <SearchSelectionDrawer uuid={uuid} />

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