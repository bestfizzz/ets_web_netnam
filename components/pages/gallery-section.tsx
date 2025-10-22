import { useGalleryContext } from "@/hooks/gallery-context"
import NoResults from "@/components/pages/search/no-results"
import ImageSection from "@/components/pages/image-section"

export default function GallerySection() {
  const { noResults, mode, privateGallery } = useGalleryContext()

  const shouldHideGallery = privateGallery === true && mode === "all"

  // 🟢 Case 1: hide gallery completely
  if (shouldHideGallery && !noResults) return null

  return (
    <div id="gallery-section" className="flex-1 overflow-y-auto px-6 sm:px-8 pb-40">
      {noResults ? <NoResults /> : <ImageSection />}
    </div>
  )
}
